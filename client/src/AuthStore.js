import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const authAtom = atomWithStorage(
  'ecommerce-auth',
  {
    token: '',
    user: null,
  }
);

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom);

  const login = (token, user) => {
    setAuth({
      token,
      user,
    });
  };

  const logout = () => {
    setAuth({
      token: '',
      user: null,
    });
  };

  return {
    auth,
    login,
    logout,
    isAuthenticated: Boolean(auth.token),
  };
};