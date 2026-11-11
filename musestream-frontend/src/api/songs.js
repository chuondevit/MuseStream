import client from './client';

export const list = (params) => client.get('/api/songs', { params }).then((r) => r.data);
export const search = (params) => client.get('/api/songs/search', { params }).then((r) => r.data);
export const popular = (limit = 10) => client.get('/api/songs/popular', { params: { limit } }).then((r) => r.data);
export const newest = (limit = 10) => client.get('/api/songs/new', { params: { limit } }).then((r) => r.data);
export const get = (id) => client.get(`/api/songs/${id}`).then((r) => r.data);
