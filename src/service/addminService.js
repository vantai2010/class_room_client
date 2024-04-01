import axios from 'axios'
import { NAME_LOCAL_STORED } from '../utils/constant'
import setAuthToken from '../utils/setAuthToken'
import env from "react-dotenv";
import { environment } from '../utils/constant';


const URL_BACK_END = environment.REACT_APP_URL_BACK_END ? environment.REACT_APP_URL_BACK_END : 'http://localhost:5000'

let adminService = {
    getAllUsers: async () => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-all-users`)
        return response.data
    },

    deleteUserById: async ({ userId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.delete(`${URL_BACK_END}/api/delete-user-by-id?userId=${userId}`)
        return response.data
    },

    createNewUserByAdmin: async ({ email, password, firstName, lastName, roleId, image, genderId, phoneNumber }) => {
        let data = { email, firstName, password, lastName, roleId, image, genderId, phoneNumber }
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        })
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/post-new-user-by-admin`, formData)
        return response.data
    },

    updateOneUserByAdmin: async ({ email, userId, password, firstName, lastName, roleId, image, genderId, phoneNumber }) => {
        // console.log(password, firstName, lastName, roleId, image, genderId, phoneNumber)
        let data = { email, userId, firstName, password, lastName, roleId, image, genderId, phoneNumber }
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        })
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.put(`${URL_BACK_END}/api/update-one-user-by-admin`, formData)
        return response.data
    },

    getAllClass: async () => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-all-class`)
        return response.data
    },

    createNewClass: async ({ name, description, image, level, teacherId }) => {
        let data = { name, description, image, level, teacherId }
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        })
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/create-new-class`, formData)
        return response.data
    },


    updateClass: async ({ classId, name, description, image, level, newImage }) => {
        let data = { classId, name, description, image, level, newImage }
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        })
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.put(`${URL_BACK_END}/api/create-new-class`, formData)
        return response.data
    },

    deleteOneClass: async ({ classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.delete(`${URL_BACK_END}/api/delete-one-class?classId=${classId}`)
        return response.data
    },
}

export default adminService

