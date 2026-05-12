import client from './client';

export const stepsApi = {
  sync: (steps: number) =>
    client.post<{ status: string }>('/steps/sync', { steps }),
};
