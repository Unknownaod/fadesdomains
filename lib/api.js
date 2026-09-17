'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

class ApiError extends Error {
  constructor(message, { status, code, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status || 0;
    this.code = code || 'UNKNOWN_ERROR';
    this.data = data || null;
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiError('Could not reach the Fades Domains API. Is the backend running?', {
      status: 0,
      code: 'NETWORK_ERROR',
    });
  }

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(payload?.message || `Request failed (${response.status})`, {
      status: response.status,
      code: payload?.error || 'REQUEST_FAILED',
      data: payload?.details || null,
    });
  }

  return payload;
}

export const api = {
  ApiError,

  // Auth
  register: (name, email, password) =>
    request('/api/auth/register', { method: 'POST', body: { name, email, password } }),
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/api/auth/me', { token }),

  // Users
  userMe: (token) => request('/api/users/me', { token }),

  // Domain search (public)
  search: (domain) => request(`/api/domains/search?domain=${encodeURIComponent(domain)}`),
  searchMany: (domain, tlds) =>
    request(
      `/api/domains/search-many?domain=${encodeURIComponent(domain)}${
        tlds ? `&tlds=${encodeURIComponent(tlds)}` : ''
      }`
    ),

  // Owned domains
  listDomains: (token) => request('/api/domains', { token }),
  getDomain: (token, domain) => request(`/api/domains/${encodeURIComponent(domain)}`, { token }),
  registerDomain: (token, domain, options = {}) =>
    request('/api/domains/register', { method: 'POST', token, body: { domain, ...options } }),
  renewDomain: (token, domain, options = {}) =>
    request(`/api/domains/${encodeURIComponent(domain)}/renew`, {
      method: 'POST',
      token,
      body: options,
    }),
  transferDomain: (token, domain, authCode, options = {}) =>
    request('/api/domains/transfer', {
      method: 'POST',
      token,
      body: { domain, authCode, ...options },
    }),

  // Nameservers
  getNameservers: (token, domain) =>
    request(`/api/domains/${encodeURIComponent(domain)}/nameservers`, { token }),
  updateNameservers: (token, domain, nameservers) =>
    request(`/api/domains/${encodeURIComponent(domain)}/nameservers`, {
      method: 'PUT',
      token,
      body: { nameservers },
    }),

  // DNS
  getDns: (token, domain) => request(`/api/domains/${encodeURIComponent(domain)}/dns`, { token }),
  updateDns: (token, domain, records) =>
    request(`/api/domains/${encodeURIComponent(domain)}/dns`, {
      method: 'PUT',
      token,
      body: { records },
    }),

  health: () => request('/api/health'),
};
