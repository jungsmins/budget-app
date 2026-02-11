import request from './client';

export const getAll = () => {
  return request('/ledgers');
};

export const getById = (id) => {
  return request(`/ledgers/${id}`);
};

export const create = (data) => {
  return request('/ledgers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const update = (id, data) => {
  return request(`/ledgers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const remove = (id) => {
  return request(`/ledgers/${id}`, {
    method: 'DELETE',
  });
};
