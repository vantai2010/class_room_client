import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appService from "../../service/appService"

export const sendEmailForgotPassword = createAsyncThunk('auth/sendEmailForgotPassword', async ({ email, language }) => {
    try {
        let response = await appService.sendEmailForgotPasswordService({ email, language })
        return response
    } catch (error) {
        console.log(error.message)
    }
})


export const handleChangePasswordThunk = createAsyncThunk('auth/handleForotPassword', async ({ email, newPassword, phoneNumber }) => {
    try {
        let response = await appService.handleChangePasswordService({ email, newPassword, phoneNumber })
        return response
    } catch (error) {
        console.log(error.message)
    }
})

export const handleloginAccountThunk = createAsyncThunk('auth/handleLoginAccount', async ({ email, password }) => {
    try {
        let response = await appService.handleLoginService({ email, password })
        console.log(response, "skdjaj")
        return response
    } catch (error) {
        console.log(error.message)
    }
})

export const handleRegisterUserThunk = createAsyncThunk('auth/handleRegisterAccount', async ({ email, password, roleId, language }) => {
    try {
        let response = await appService.registerUserService({ email, password, roleId, language })
        return response
    } catch (error) {
        console.log(error.message)
    }
})

export const handleAddExtraInforAfterRegisterThunk = createAsyncThunk('auth/handleAddExtraInforAfterRegister', async ({ firstName, lastName, email, genderId, phoneNumber, image }) => {
    try {
        let response = await appService.registerExtraInforService({ firstName, lastName, email, genderId, phoneNumber, image })
        return response
    } catch (error) {
        console.log(error.message)
    }
})


export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        isLoading: false,
        userInfor: {},
        socketNotify: null
    },
    reducers: {
        handleLoginFromTokenSuccess: (state, action) => {
            state.isAuthenticated = true
            state.userInfor = action.payload
        },
        handleLoginFromTokenFailed: (state, action) => {
            state.isAuthenticated = false
            state.userInfor = {}
        },
        handleLogoutAccount: (state, action) => {
            state.isAuthenticated = false
            state.userInfor = {}
        },
        connectSocketNotify: (state, action) => {
            state.socketNotify = action.payload
        },
        changeInforUser: (state, action) => {
            state.userInfor = { ...state.userInfor, ...action.payload }
        }
    },
    extraReducers: {
        [sendEmailForgotPassword.pending]: (state, action) => {
            state.isLoading = true
        },
        [sendEmailForgotPassword.fulfilled]: (state, action) => {
            state.isLoading = false
        },
        [sendEmailForgotPassword.rejected]: (state, action) => {
            state.isLoading = false
        },
        [handleloginAccountThunk.pending]: (state, action) => {
            state.isLoading = true
            state.isAuthenticated = false
        },
        [handleloginAccountThunk.fulfilled]: (state, action) => {
            state.userInfor = action.payload?.data
            state.isLoading = false
            state.isAuthenticated = true
        },
        [handleloginAccountThunk.rejected]: (state, action) => {
            state.userInfor = {}
            state.isLoading = false
            state.isAuthenticated = false
        },
        [handleRegisterUserThunk.pending]: (state, action) => {
            state.isLoading = true
        },
        [handleRegisterUserThunk.fulfilled]: (state, action) => {
            state.isLoading = false
        },
        [handleRegisterUserThunk.rejected]: (state, action) => {
            state.isLoading = false
        },
        [handleChangePasswordThunk.pending]: (state, action) => {
            state.isLoading = true
        },
        [handleChangePasswordThunk.fulfilled]: (state, action) => {
            state.isLoading = false
        },
        [handleChangePasswordThunk.rejected]: (state, action) => {
            state.isLoading = false
        },

    }
})




export const { handleLoginFromTokenSuccess, handleLoginFromTokenFailed, handleLogoutAccount, connectSocketNotify, changeInforUser } = authSlice.actions
export default authSlice.reducer