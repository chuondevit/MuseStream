import client from './client';

export const list = (limit = 10) => client.get('/api/recommendations', { params: { limit } }).then((r) => r.data);
export const onboardingOptions = () => client.get('/api/recommendations/onboarding/options').then((r) => r.data);
export const submitOnboarding = (body) => client.post('/api/recommendations/onboarding', body).then((r) => r.data);
export const recordPlay = (songId) => client.post(`/api/recommendations/play/${songId}`).then((r) => r.data);
