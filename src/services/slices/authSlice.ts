import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// TODO: Заменить на настоящий корневой редьюсер
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi,
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';

import type { TRegisterData } from '../../utils/burger-api';
import type { TUser } from '@/utils/types';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isSuccessRegistrarion: boolean;
  isSuccessForgotPassword: boolean;
  isSuccessResetPassword: boolean;
  data: TUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  isSuccessRegistrarion: false,
  isSuccessForgotPassword: false,
  isSuccessResetPassword: false,
  data: null,
  isLoading: false,
  error: null,
};

type PasswordArgs = {
  password: string;
  token: string;
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>, { rejectWithValue }) => {
    try {
      const response = await loginUserApi({ email, password });
      setCookie('accessToken', response.accessToken, { expires: 3600 });
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка авторизации');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi({ name, email, password });
      setCookie('accessToken', response.accessToken, { expires: 3600 });
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка получения пользователя');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(user);
      return response.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка обновления данных');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка выхода');
    } finally {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
);

export const forgotPasswordUser = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }: Pick<TRegisterData, 'email'>, { rejectWithValue }) => {
    try {
      return await forgotPasswordApi({ email }); // Передаем email в API
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка восстановления пароля');
    }
  }
);

export const resetPasswordUser = createAsyncThunk(
  'auth/resetPassword',
  async ({ password, token }: PasswordArgs, { rejectWithValue }) => {
    try {
      return await resetPasswordApi({ password, token });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка сброса пароля');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectUser: (sliceState) => sliceState.data,
    selectUserisLoading: (sliceState) => sliceState.isLoading,
    selectIsSuccessRegistrarion: (sliceState) => sliceState.isSuccessRegistrarion,
    selectUserError: (sliceState) => sliceState.error,
    selectIsAuthChecked: (sliceState) => sliceState.isAuthChecked,
    selectIsSuccessForgotPassword: (sliceState) => sliceState.isSuccessForgotPassword,
    selectIsSuccessResetPassword: (sliceState) => sliceState.isSuccessResetPassword,
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.payload as string;
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
        state.isSuccessRegistrarion = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.payload as string;
        state.isSuccessRegistrarion = false;
      })

      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(forgotPasswordUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccessForgotPassword = false;
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccessForgotPassword = true;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? action.error.message ?? 'Ошибка';
        state.isSuccessForgotPassword = false;
      })

      .addCase(resetPasswordUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccessResetPassword = false;
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccessResetPassword = true;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? action.error.message ?? 'Ошибка';
        state.isSuccessResetPassword = false;
      });
  },
});

export const { setAuthChecked, clearAuthError } = authSlice.actions;

export const {
  selectUser,
  selectUserisLoading,
  selectUserError,
  selectIsSuccessRegistrarion,
  selectIsAuthChecked,
  selectIsSuccessForgotPassword,
  selectIsSuccessResetPassword,
} = authSlice.selectors;

export default authSlice.reducer;

// export const rootReducers = (): Record<string, never> => ({
//   // TODO: Собрать здесь редьюсеры слайсов

// });
