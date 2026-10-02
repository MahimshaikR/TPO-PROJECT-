const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { isUsingMongo } = require('../config/db');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate unique MongoDB-style ObjectId hex string
const generateObjectId = () => {
  return crypto.randomBytes(12).toString('hex');
};

class LocalQuery {
  constructor(model, docsPromise) {
    this.model = model;
    this.docsPromise = Promise.resolve(docsPromise);
    this._sortObj = null;
    this._skipNum = 0;
    this._limitNum = null;
    this._populateFields = [];
    this._selectFields = null;
  }

  sort(sortObj) {
    this._sortObj = sortObj;
    return this;
  }

  skip(skipNum) {
    this._skipNum = Number(skipNum) || 0;
    return this;
  }

  limit(limitNum) {
    this._limitNum = Number(limitNum);
    return this;
  }

  populate(field, select) {
    this._populateFields.push({ field, select });
    return this;
  }

  select(fields) {
    this._selectFields = fields;
    return this;
  }

  lean() {
    return this;
  }

  async execute() {
    let docs = await this.docsPromise;
    if (!Array.isArray(docs)) {
      return docs;
    }

    // Clone to prevent direct mutation
    let result = JSON.parse(JSON.stringify(docs));

    // Sort
    if (this._sortObj) {
      const keys = Object.keys(this._sortObj);
      result.sort((a, b) => {
        for (const key of keys) {
          const dir = this._sortObj[key] === -1 || this._sortObj[key] === 'desc' ? -1 : 1;
          const aVal = a[key];
          const bVal = b[key];
          if (aVal === bVal) continue;
          if (aVal === undefined) return 1;
          if (bVal === undefined) return -1;
          return aVal > bVal ? dir : -dir;
        }
        return 0;
      });
    }

    // Skip
    if (this._skipNum > 0) {
      result = result.slice(this._skipNum);
    }

    // Limit
    if (this._limitNum && this._limitNum > 0) {
      result = result.slice(0, this._limitNum);
    }

    // Population
    if (this._populateFields.length > 0) {
      for (const pop of this._populateFields) {
        for (const doc of result) {
          await this.model._populateDoc(doc, pop.field, pop.select);
        }
      }
    }

    return result;
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }
}

class LocalModel {
  constructor(name, schemaDef) {
    this.name = name;
    this.schemaDef = schemaDef;
    this.filePath = path.join(dataDir, `${name}.json`);
    this.items = [];
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this.items = JSON.parse(raw);
      } else {
        this.items = [];
        this.saveData();
      }
    } catch (err) {
      console.error(`Error loading data for ${this.name}:`, err.message);
      this.items = [];
    }
  }

  saveData() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.items, null, 2), 'utf8');
    } catch (err) {
      console.error(`Error saving data for ${this.name}:`, err.message);
    }
  }

  matchesFilter(doc, filter = {}) {
    if (!filter || Object.keys(filter).length === 0) return true;

    for (const [key, val] of Object.entries(filter)) {
      if (key === '$or' && Array.isArray(val)) {
        const matchesAny = val.some(subFilter => this.matchesFilter(doc, subFilter));
        if (!matchesAny) return false;
        continue;
      }
      if (key === '$and' && Array.isArray(val)) {
        const matchesAll = val.every(subFilter => this.matchesFilter(doc, subFilter));
        if (!matchesAll) return false;
        continue;
      }

      const docVal = doc[key];

      if (val instanceof RegExp) {
        if (!val.test(String(docVal || ''))) return false;
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        if ('$ne' in val) {
          if (docVal === val.$ne) return false;
        }
        if ('$in' in val) {
          const list = Array.isArray(val.$in) ? val.$in : [];
          if (Array.isArray(docVal)) {
            const hasCommon = docVal.some(x => list.includes(x));
            if (!hasCommon) return false;
          } else if (!list.includes(docVal)) {
            return false;
          }
        }
        if ('$nin' in val) {
          const list = Array.isArray(val.$nin) ? val.$nin : [];
          if (list.includes(docVal)) return false;
        }
        if ('$gte' in val) {
          if (Number(docVal) < Number(val.$gte)) return false;
        }
        if ('$lte' in val) {
          if (Number(docVal) > Number(val.$lte)) return false;
        }
        if ('$gt' in val) {
          if (Number(docVal) <= Number(val.$gt)) return false;
        }
        if ('$lt' in val) {
          if (Number(docVal) >= Number(val.$lt)) return false;
        }
        if ('$regex' in val) {
          const reg = new RegExp(val.$regex, val.$options || '');
          if (!reg.test(String(docVal || ''))) return false;
        }
      } else if (Array.isArray(docVal)) {
        if (!docVal.includes(val)) return false;
      } else {
        if (String(docVal) !== String(val)) return false;
      }
    }
    return true;
  }

  async find(filter = {}) {
    this.loadData();
    const matched = this.items.filter(item => this.matchesFilter(item, filter));
    return new LocalQuery(this, matched);
  }

  async findOne(filter = {}) {
    this.loadData();
    const item = this.items.find(doc => this.matchesFilter(doc, filter));
    if (!item) return null;
    const cloned = JSON.parse(JSON.stringify(item));
    return this._wrapDocument(cloned);
  }

  async findById(id) {
    return this.findOne({ _id: String(id) });
  }

  async create(data) {
    this.loadData();
    if (Array.isArray(data)) {
      const created = [];
      for (const item of data) {
        const doc = await this.create(item);
        created.push(doc);
      }
      return created;
    }

    const now = new Date().toISOString();
    const doc = {
      _id: data._id ? String(data._id) : generateObjectId(),
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };

    this.items.push(doc);
    this.saveData();
    return this._wrapDocument(doc);
  }

  async insertMany(docs) {
    return this.create(docs);
  }

  async findByIdAndUpdate(id, update, options = {}) {
    this.loadData();
    const index = this.items.findIndex(d => String(d._id) === String(id));
    if (index === -1) {
      if (options.upsert) {
        return this.create({ _id: id, ...update });
      }
      return null;
    }

    const current = this.items[index];
    const updated = {
      ...current,
      ...update,
      _id: current._id,
      updatedAt: new Date().toISOString()
    };

    if (update.$push) {
      for (const [k, v] of Object.entries(update.$push)) {
        updated[k] = updated[k] || [];
        updated[k].push(v);
      }
      delete updated.$push;
    }

    this.items[index] = updated;
    this.saveData();
    return this._wrapDocument(options.new === false ? current : updated);
  }

  async findOneAndUpdate(filter, update, options = {}) {
    const doc = await this.findOne(filter);
    if (!doc) {
      if (options.upsert) {
        return this.create(update);
      }
      return null;
    }
    return this.findByIdAndUpdate(doc._id, update, options);
  }

  async findByIdAndDelete(id) {
    this.loadData();
    const index = this.items.findIndex(d => String(d._id) === String(id));
    if (index === -1) return null;
    const deleted = this.items.splice(index, 1)[0];
    this.saveData();
    return deleted;
  }

  async deleteOne(filter) {
    this.loadData();
    const index = this.items.findIndex(d => this.matchesFilter(d, filter));
    if (index !== -1) {
      this.items.splice(index, 1);
      this.saveData();
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(filter = {}) {
    this.loadData();
    const initialLen = this.items.length;
    this.items = this.items.filter(d => !this.matchesFilter(d, filter));
    this.saveData();
    return { deletedCount: initialLen - this.items.length };
  }

  async countDocuments(filter = {}) {
    this.loadData();
    return this.items.filter(d => this.matchesFilter(d, filter)).length;
  }

  async distinct(field, filter = {}) {
    this.loadData();
    const matched = this.items.filter(d => this.matchesFilter(d, filter));
    const set = new Set();
    for (const item of matched) {
      if (item[field] !== undefined && item[field] !== null) {
        if (Array.isArray(item[field])) {
          item[field].forEach(v => set.add(v));
        } else {
          set.add(item[field]);
        }
      }
    }
    return Array.from(set);
  }

  _wrapDocument(doc) {
    if (!doc) return null;
    const model = this;
    const wrapped = { ...doc };

    wrapped.save = async function () {
      return model.findByIdAndUpdate(this._id, this);
    };

    wrapped.toObject = function () {
      return JSON.parse(JSON.stringify(this));
    };

    wrapped.populate = async function (field, select) {
      await model._populateDoc(this, field, select);
      return this;
    };

    return wrapped;
  }

  async _populateDoc(doc, field, select) {
    const registry = require('./modelRegistry');
    const targetId = doc[field];
    if (!targetId) return;

    // Detect target model based on field name conventions
    let targetModelName = null;
    if (field === 'studentId' || field === 'student') targetModelName = 'Student';
    else if (field === 'driveId' || field === 'drive') targetModelName = 'Drive';
    else if (field === 'companyId' || field === 'company') targetModelName = 'Company';
    else if (field === 'userId' || field === 'user' || field === 'createdBy') targetModelName = 'User';
    else if (field === 'applicationId') targetModelName = 'Application';

    if (targetModelName && registry[targetModelName]) {
      const refDoc = await registry[targetModelName].findById(targetId);
      if (refDoc) {
        doc[field] = refDoc;
      }
    }
  }
}

const models = {};

const createModel = (modelName, schemaDef) => {
  // If Mongoose is actively connected, create and return standard Mongoose model
  if (isUsingMongo()) {
    try {
      if (mongoose.models[modelName]) {
        return mongoose.models[modelName];
      }
      const schema = new mongoose.Schema(schemaDef, {
        timestamps: true,
        strict: false
      });
      return mongoose.model(modelName, schema);
    } catch (err) {
      console.warn(`Mongoose model register warning for ${modelName}:`, err.message);
    }
  }

  // Otherwise return resilient dynamic LocalModel
  if (!models[modelName]) {
    models[modelName] = new LocalModel(modelName, schemaDef);
  }
  return models[modelName];
};

module.exports = {
  createModel,
  generateObjectId
};
