import client from './client';

export const list = () => client.get('/api/playlists').then((r) => r.data);
export const create = (body) => client.post('/api/playlists', body).then((r) => r.data);
export const get = (id) => client.get(`/api/playlists/${id}`).then((r) => r.data);
export const update = (id, body) => client.put(`/api/playlists/${id}`, body).then((r) => r.data);
export const remove = (id) => client.delete(`/api/playlists/${id}`).then((r) => r.data);
export const addSong = (id, songId) => client.post(`/api/playlists/${id}/songs/${songId}`).then((r) => r.data);
export const removeSong = (id, songId) => client.delete(`/api/playlists/${id}/songs/${songId}`).then((r) => r.data);
