import { configureStore } from '@reduxjs/toolkit'
import appSlice from './slice/appSlice'
import authSlice from './slice/authSlice'

const store = configureStore({
    reducer: {
        app: appSlice,
        auth: authSlice,
    }
})

export default store