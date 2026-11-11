import client from './client';

export const preferences = () => client.get('/api/me/preferences').then((r) => r.data);
export const updatePreferences = (body) => client.put('/api/me/preferences', body).then((r) => r.data);
export const history = (limit = 20) => client.get('/api/me/history', { params: { limit } }).then((r) => r.data);
export const likes = () => client.get('/api/me/likes').then((r) => r.data);
export const likeIds = () => client.get('/api/me/likes/ids').then((r) => r.data);
export const like = (songId) => client.post(`/api/me/likes/${songId}`).then((r) => r.data);
export const unlike = (songId) => client.delete(`/api/me/likes/${songId}`).then((r) => r.data);
