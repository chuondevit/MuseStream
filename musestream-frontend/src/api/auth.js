import client from './client';

export const register = (body) => client.post('/api/auth/register', body).then((r) => r.data);
export const login = (body) => client.post('/api/auth/login', body).then((r) => r.data);
export const me = () => client.get('/api/auth/me').then((r) => r.data);
