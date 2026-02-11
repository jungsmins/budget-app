import request from './client';

export const getAll = (ledgerId) => {
  return request(`/ledgers/${ledgerId}/transactions`);
};

export const create = (ledgerId, data) => {
  return request(`/ledgers/${ledgerId}/transactions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const update = (ledgerId, id, data) => {
  return request(`/ledgers/${ledgerId}/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const remove = (ledgerId, id) => {
  return request(`/ledgers/${ledgerId}/transactions/${id}`, {
    method: 'DELETE',
  });
};
