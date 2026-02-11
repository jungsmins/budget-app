const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const headers = options.body
    ? { 'Content-Type': 'application/json' }
    : {};

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export default request;
