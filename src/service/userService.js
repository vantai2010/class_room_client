import axios from 'axios'
import { NAME_LOCAL_STORED } from '../utils/constant'
import setAuthToken from '../utils/setAuthToken'
import env from "react-dotenv";
import { environment } from '../utils/constant';


const URL_BACK_END = environment.REACT_APP_URL_BACK_END ? environment.REACT_APP_URL_BACK_END : 'http://localhost:5000'

let userService = {
    getAssignmentsByClassId: async ({ classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-assignments-of-class?classId=${classId}`)
        return response.data
    },
    getExamsByClassId: async ({ classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-exams-of-class?classId=${classId}`)
        return response.data
    },
    getContentAssignmentsByExamId: async ({ examId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-content-assignment-of-class-by-id?examId=${examId}`)
        return response.data
    },
    getListQuestionsOfExam: async ({ examId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-question-of-exam-by-examId?examId=${examId}`)
        return response.data
    },
    getListDocumentsByClass: async ({ classId, files }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-documents-of-class?classId=${classId}`)
        return response.data
    },

    searchUser: async ({ search, classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/search-user-by-name-or-email?search=${search}&classId=${classId}`)
        return response.data
    },

    searchTeacher: async ({ search }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/search-teacher-by-name-or-email?search=${search}`)
        return response.data
    },

    getInforClassByClassId: async ({ classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-infor-class?classId=${classId}`)
        return response.data
    },

    getListClass: async () => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-class`)
        return response.data
    },

    getListStudentOfClass: async ({ classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-student-of-class?classId=${classId}`)
        return response.data
    },

    outOfClassByStudent: async ({ classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.delete(`${URL_BACK_END}/api/out-class?classId=${classId}`)
        return response.data
    },

    getInforAssignment: async ({ examId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-infor-exam?examId=${examId}`)
        return response.data
    },

    saveResultExamOrAssignmentToHistory: async ({ examId, studentId, result, time }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/save-result-exam-or-assignment-to-history`, { examId, studentId, result, time })
        return response.data
    },

    saveResultChoiseQuestion: async ({ dataChoise }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/save-result-choise-question`, { dataChoise })
        return response.data
    },

    getListChoiseQuestionOfExam: async ({ studentId, examId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-choise-question-of-student?studentId=${studentId}&examId=${examId}`)
        return response.data
    },

    getMissionOfStudent: async ({ studentId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-mission-of-student?studentId=${studentId}`)
        return response.data
    },

    getListNotify: async () => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-notify`)
        return response.data
    },

    deleteOneNotify: async ({ notifyId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.delete(`${URL_BACK_END}/api/delete-one-notify?notifyId=${notifyId}`)
        return response.data
    },

    postNewNotify: async ({ receiverId, contentEN, contentVI, typeId, params }) => {
        console.log(receiverId, contentEN, contentVI, typeId, params)
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/post-new-notify`, { receiverId, contentEN, contentVI, typeId, params })
        return response.data
    },

    searchClassByName: async ({ search }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/search-class-by-name?search=${search}`)
        return response.data
    },

    createNewInvigilator: async ({ examId, invigilatorId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/create-new-invigilator`, { examId, invigilatorId })
        return response.data
    },

    sendEmail: async ({ typeId, receiverEmail, language }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/send-email`, { typeId, receiverEmail, language })
        return response.data
    },

    getReviewResultOfStudentInExam: async ({ examId, classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-review-result-of-student-in-exam?examId=${examId}&classId=${classId}`)
        return response.data
    },


    createRelationshipAccount: async ({ studentId, parentsId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/create-relationship-account`, { studentId, parentsId })
        return response.data
    },

    getListDataOfRelationshipAccount: async () => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-data-relationship-account`)
        return response.data
    },

    deleteOneRelationshipByRelationshipId: async ({ relationshipId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.delete(`${URL_BACK_END}/api/delete-one-relationship-by-relationshipId?relationshipId=${relationshipId}`)
        return response.data
    },

    getListClasOfStudentByParentsId: async ({ parentsId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-class-of-student-by-parentsId?parentsId=${parentsId}`)
        return response.data
    },

    getListStudentDataOfParents: async ({ parentsId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-student-data-of-parents?parentsId=${parentsId}`)
        return response.data
    },
}

export default userService

