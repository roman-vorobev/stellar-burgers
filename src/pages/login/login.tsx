import { clearAuthError, loginUser, selectUserError } from '@/services/slices/authSlice';

import { useDispatch, useSelector, type AppDispatch } from '@/services/store';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleClearError = () => {
    dispatch(clearAuthError());
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      onClearError={handleClearError}
    />
  );
};
