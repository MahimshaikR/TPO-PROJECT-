/**
 * TPO Connect — Universal HTTP & REST API Client
 */
class ApiClient {
  constructor() {
    let base = window.APP_CONFIG?.API_BASE_URL || '/api';
    if (!base.startsWith('http') && typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')) {
      base = `${window.location.origin}${base.startsWith('/') ? '' : '/'}${base}`;
    }
    this.baseUrl = base;
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Inject JWT token if available
    const token = window.State?.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // For file uploads (FormData), do not set Content-Type header manually
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Special handling for file exports
      const disposition = response.headers.get('content-disposition');
      if (disposition && disposition.includes('attachment')) {
        const blob = await response.blob();
        return blob;
      }

      const resData = await response.json();

      if (!response.ok) {
        // If 401 Unauthorized, clean state and redirect if needed
        if (response.status === 401 && window.State?.isAuthenticated()) {
          console.warn('Session expired. Logging out.');
          window.State.clearAuth();
          if (window.Router) {
            window.Router.navigate('/login');
          }
        }
        const error = new Error(resData.message || 'API request failed');
        error.code = resData.error?.code || 'UNKNOWN_ERROR';
        error.status = response.status;
        throw error;
      }

      return resData.data !== undefined ? resData.data : resData;
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err.message);
      throw err;
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  put(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  patch(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

window.API = new ApiClient();
