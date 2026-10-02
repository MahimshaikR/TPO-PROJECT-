/**
 * TPO Connect — Global State & Authentication Store
 */
class StateManager {
  constructor() {
    this.token = localStorage.getItem('tpo_token') || null;
    this.user = null;
    try {
      const stored = localStorage.getItem('tpo_user');
      if (stored) this.user = JSON.parse(stored);
    } catch (e) {
      this.user = null;
    }
    this.settings = null;
    this.listeners = {};
  }

  init() {
    this.token = localStorage.getItem('tpo_token') || null;
    try {
      const stored = localStorage.getItem('tpo_user');
      this.user = stored ? JSON.parse(stored) : null;
    } catch (e) {
      this.user = null;
    }
    return this;
  }

  get(key) {
    if (key === 'user') return this.getUser();
    if (key === 'token') return this.getToken();
    if (key === 'role') return this.getRole();
    if (key === 'settings') return this.getSettings();
    return this[key];
  }

  set(key, value) {
    if (key === 'user') this.user = value;
    else if (key === 'token') this.token = value;
    else if (key === 'settings') this.setSettings(value);
    else this[key] = value;
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  getRole() {
    return this.user ? this.user.role : null;
  }

  isAdmin() {
    const role = this.getRole();
    return ['ADMIN', 'TP_OFFICER', 'SUPER_ADMIN'].includes(role);
  }

  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('tpo_token', token);
    localStorage.setItem('tpo_user', JSON.stringify(user));
    this.emit('auth:change', { token, user });
  }

  updateUser(updatedFields) {
    if (!this.user) return;
    this.user = { ...this.user, ...updatedFields };
    localStorage.setItem('tpo_user', JSON.stringify(this.user));
    this.emit('user:update', this.user);
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('tpo_token');
    localStorage.removeItem('tpo_user');
    this.emit('auth:change', { token: null, user: null });
  }

  setSettings(settings) {
    this.settings = settings;
    this.emit('settings:update', settings);
  }

  getSettings() {
    return this.settings;
  }
}

window.State = new StateManager();
