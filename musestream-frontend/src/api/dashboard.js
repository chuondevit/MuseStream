import client from './client';

export const get = () => client.get('/api/dashboard').then((r) => r.data);
