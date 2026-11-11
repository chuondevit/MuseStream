import client from './client';

export const list = (q) => client.get('/api/artists', { params: q ? { q } : {} }).then((r) => r.data);
export const popular = (limit = 10) => client.get('/api/artists/popular', { params: { limit } }).then((r) => r.data);
export const get = (id) => client.get(`/api/artists/${id}`).then((r) => r.data);
export const songs = (id) => client.get(`/api/artists/${id}/songs`).then((r) => r.data);
