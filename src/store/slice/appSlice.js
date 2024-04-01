import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCodeByTypeService } from "../../service/appService"
import { languages } from "../../utils/constant";


export const appSlice = createSlice({
    name: 'app',
    initialState: {
        language: languages.VI,
        listUserOnline: [],

    },
    reducers: {
        changeLanguage: (state, action) => {
            state.language = action.payload
        },
        changeListUserOnline: (state, action) => {
            state.listUserOnline = action.payload
        }
    },
    extraReducers: {

    }
})



export const { changeLanguage, changeListUserOnline } = appSlice.actions
export default appSlice.reducer