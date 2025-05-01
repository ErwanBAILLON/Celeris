import { get } from 'idb-keyval';

export const getAccessToken = async (): Promise<string | null> => {
  return (await get('accessToken')) || null;
};
