import axios from 'axios'
import { NAME_LOCAL_STORED } from '../utils/constant'
import setAuthToken from '../utils/setAuthToken'
import env from "react-dotenv";
import { environment } from '../utils/constant';

// const URL_BACK_END = environment.REACT_APP_URL_BACK_END ? environment.REACT_APP_URL_BACK_END : 'http://localhost:5000'

const URL_BACK_END = environment.REACT_APP_URL_BACK_END ? environment.REACT_APP_URL_BACK_END : 'http://localhost:5000'

let appService = {
    registerUserService: async ({ email, password, roleId }) => {
        let response = await axios.post(`${URL_BACK_END}/api/register`, { email, password, roleId })
        return response.data
    },

    registerExtraInforService: async ({ firstName, lastName, email, genderId, phoneNumber, image }) => {
        let data = { firstName, lastName, email, genderId, phoneNumber, image }
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        })
        let response = await axios.post(`${URL_BACK_END}/api/register-information`, formData)
        return response.data
    },

    handleLoginService: async ({ email, password }) => {
        let response = await axios.post(`${URL_BACK_END}/api/login`, { email, password })
        return response.data
    },

    handleChangePasswordService: async ({ email, newPassword, phoneNumber }) => {
        let response = await axios.put(`${URL_BACK_END}/api/change-password`, { email, newPassword, phoneNumber })
        return response.data
    },

    sendEmailForgotPasswordService: async ({ email, language }) => {
        let response = await axios.post(`${URL_BACK_END}/api/send-email-forgot-password`, { email, language })
        return response.data
    },

    loginFromTokenService: async () => {
        let response = await axios.post(`${URL_BACK_END}/api/login-with-token`)
        return response.data
    },

    dowloadDocument: async ({ fileName }) => {
        let response = await axios.get(`${URL_BACK_END}/api/dowload-file?fileName=${fileName}`)
        return response.data
    },

}

export default appService


