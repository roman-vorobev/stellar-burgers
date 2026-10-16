import {
  clearAuthError,
  registerUser,
  selectUserError,
} from '@/services/slices/authSlice';
import { useDispatch, useSelector } from '@/services/store';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(clearAuthError());
    void dispatch(registerUser({ name: userName, email, password }));
  };

  const handleClearError = (): void => {
    dispatch(clearAuthError());
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      onClearError={handleClearError}
    />
  );
};
