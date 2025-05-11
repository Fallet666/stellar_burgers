import { getUserApi, loginUserApi, logoutApi, registerUserApi, TLoginData, TRegisterData, updateUserApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TUser } from "@utils-types";
import { deleteCookie, getCookie, setCookie } from "src/utils/cookie";


export type TstateUser = {
    isAuthChecked: boolean;
    isAuthenticated: boolean;
    user: TUser | null;
    error: null | string;
    loginUserRequest: boolean;
};

const initialState: TstateUser = {
    isAuthChecked: false,
    isAuthenticated: false,
    user: null,
    error: null,
    loginUserRequest: false
};

export const userApi = createAsyncThunk('user/userApi', getUserApi);

export const toRegisterUser = createAsyncThunk(
    'user/register',
    async ({ email, password, name }: TRegisterData) => {
        const data = await registerUserApi({ email, password, name });

        setCookie('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        return data.user;
    }
);

export const logInUser = createAsyncThunk(
    'user/login',
    async ({ email, password }: TLoginData) => {
        const data = await loginUserApi({ email, password });

        setCookie('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        return data.user;
    }
);

export const logOutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await logoutApi();
            deleteCookie('accessToken');
            localStorage.clear();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateUser = createAsyncThunk('user/update', updateUserApi);

export const userStateSlice = createSlice({
    name: 'userstate',
    initialState,
    reducers: {
        authChecked: (state) => {
            state.isAuthChecked = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userApi.pending, (state) => {
                state.isAuthenticated = false;
                state.error = null;
                state.user = null;
                state.loginUserRequest = true;
            })
            .addCase(userApi.fulfilled, (state, action) => {
                state.isAuthChecked = true;
                state.user = action.payload.user;
                state.isAuthChecked = true;
                state.loginUserRequest = false;
            })
            .addCase(userApi.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch user data';
                state.isAuthenticated = false;
                state.isAuthChecked = true;
                state.user = null;
                state.loginUserRequest = false;
            })
            .addCase(toRegisterUser.pending, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loginUserRequest = true;
            })
            .addCase(toRegisterUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.loginUserRequest = false;
            })
            .addCase(toRegisterUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.error = action.error.message || 'Failed to fetch register user ';
                state.loginUserRequest = false;
            })
            .addCase(logInUser.pending, (state) => {
                state.error = null;
                state.loginUserRequest = true;
            })
            .addCase(logInUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.loginUserRequest = false;
                state.isAuthChecked = true;
            })
            .addCase(logInUser.rejected, (state, action) => {
                state.loginUserRequest = false;
                state.error = action.error.message || 'Failed to fetch Log in user ';
                state.isAuthChecked = true;
            })
            .addCase(logOutUser.pending, (state) => {
                state.isAuthenticated = true;
                state.loginUserRequest = true;
            })
            .addCase(logOutUser.fulfilled, (state, action) => {
                state.isAuthenticated = false;
                state.loginUserRequest = false;
                state.user = null;
                deleteCookie('accessToken');
                localStorage.removeItem('refreshToken');
            })
            .addCase(logOutUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loginUserRequest = false;
                state.error = action.error.message || 'Failed to fetch Log Out user ';
            })
            .addCase(updateUser.pending, (state) => {
                state.isAuthenticated = true;
                state.loginUserRequest = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.loginUserRequest = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch update user';
                state.loginUserRequest = false;
            });
    },
    selectors: {
        selectUser: (state) => state.user,
        selectIsAuthenticated: (state) => state.isAuthenticated,
        selectLoginUserError: (state) => state.error,
        selectIsAuthChecked: (state) => state.isAuthChecked,
        selectloginUserRequest: (state) => state.loginUserRequest
    }
});

export const checkUserAuth = createAsyncThunk(
    'user/checkUser',
    (_, { dispatch }) => {
        if (getCookie('accessToken')) {
            dispatch(userApi()).finally(() => {
                dispatch(authChecked());
            });
        } else {
            dispatch(authChecked());
        }
    }
);

export const { authChecked } = userStateSlice.actions;
export default userStateSlice;

export const {
    selectUser,
    selectIsAuthenticated,
    selectLoginUserError,
    selectIsAuthChecked,
    selectloginUserRequest
} = userStateSlice.selectors;