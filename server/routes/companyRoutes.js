const express = require('express');
const router = express.Router();
const { Company, Drive, Selection } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/companies
// @desc    Public company directory with search and filter
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { search, industry, tier, status, sort = 'name' } = req.query;

    const filter = {};
    if (industry && industry !== 'ALL') filter.industry = industry;
    if (tier && tier !== 'ALL') filter.tier = tier;
    if (status && status !== 'ALL') filter.status = status;
    else if (!req.user || req.user.role === 'STUDENT') filter.status = 'ACTIVE';

    let companies = await Company.find(filter);

    if (search) {
      const q = search.toLowerCase().trim();
      companies = companies.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Dynamic stats sync: update company stats based on real selection records
    const allSelections = await Selection.find({});
    for (const comp of companies) {
      const compSelections = allSelections.filter(s => String(s.companyId) === String(comp._id));
      if (compSelections.length > 0) {
        comp.totalOffersCount = compSelections.length;
        const packages = compSelections.map(s => Number(s.packageLpa) || 0).filter(p => p > 0);
        if (packages.length > 0) {
          comp.highestPackageOffered = Math.max(...packages);
          comp.averagePackageOffered = Number((packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1));
        }
      }
    }

    if (sort === 'package') {
      companies.sort((a, b) => (b.highestPackageOffered || 0) - (a.highestPackageOffered || 0));
    } else if (sort === 'offers') {
      companies.sort((a, b) => (b.totalOffersCount || 0) - (a.totalOffersCount || 0));
    } else {
      companies.sort((a, b) => a.name.localeCompare(b.name));
    }

    return res.status(200).json({
      success: true,
      message: 'Companies retrieved',
      data: companies
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/companies/:id
// @desc    Get company details with dynamic recruitment drives and real offer statistics
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    // Dynamic selection statistics
    const selections = await Selection.find({ companyId: company._id });
    const offersCount = selections.length;
    let highestPackage = company.highestPackageOffered || 0;
    let averagePackage = company.averagePackageOffered || 0;

    if (offersCount > 0) {
      const validPackages = selections.map(s => Number(s.packageLpa) || 0).filter(p => p > 0);
      if (validPackages.length > 0) {
        highestPackage = Math.max(...validPackages);
        averagePackage = Number((validPackages.reduce((a, b) => a + b, 0) / validPackages.length).toFixed(1));
      }
    }

    // Company drives
    const drives = await Drive.find({ companyId: company._id });

    return res.status(200).json({
      success: true,
      message: 'Company details retrieved',
      data: {
        ...company,
        totalOffersCount: offersCount,
        highestPackageOffered: highestPackage,
        averagePackageOffered: averagePackage,
        drives
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/companies
// @desc    Create new company (Admin/Recruiter)
router.post('/', protect, authorize('ADMIN', 'RECRUITER'), async (req, res, next) => {
  try {
    const { name, logo, website, industry, description, headOffice, contactEmail, contactPhone, tier } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required.',
        error: { code: 'NAME_REQUIRED' }
      });
    }

    const existing = await Company.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A company with this name already exists in the system.',
        error: { code: 'DUPLICATE_COMPANY' }
      });
    }

    const company = await Company.create({
      name: name.trim(),
      logo: logo || '',
      website: website || '',
      industry: industry || 'Technology',
      description: description || '',
      headOffice: headOffice || '',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      tier: tier || 'TIER_1',
      status: 'ACTIVE'
    });

    await logAudit(req, 'CREATE_COMPANY', 'Company', company._id, { name: company.name });

    return res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/companies/:id
// @desc    Update company details
router.put('/:id', protect, authorize('ADMIN', 'RECRUITER'), async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Company.findByIdAndUpdate(company._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_COMPANY', 'Company', company._id, { name: updated.name });

    return res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/companies/:id
// @desc    Delete company (Admin only)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Company.findByIdAndDelete(company._id);
    await logAudit(req, 'DELETE_COMPANY', 'Company', company._id, { name: company.name });

    return res.status(200).json({
      success: true,
      message: 'Company record deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
