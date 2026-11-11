import client from './client';

export const list = () => client.get('/api/genres').then((r) => r.data);
