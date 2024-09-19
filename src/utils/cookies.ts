// utils/cookies.ts
import Cookies from 'js-cookie';

export const setTokenCookie = (token: string): void => {
  Cookies.set('token', token, { expires: 7 }); // Cookie expires in 7 days
};

export const getTokenCookie = (): string | undefined => {
  return Cookies.get('token');
};

export const removeTokenCookie = (): void => {
  Cookies.remove('token');
};
