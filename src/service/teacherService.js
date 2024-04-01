import axios from 'axios'
import { NAME_LOCAL_STORED, exam_typeId } from '../utils/constant'
import setAuthToken from '../utils/setAuthToken'
import env from "react-dotenv";
import { environment } from '../utils/constant';


const URL_BACK_END = environment.REACT_APP_URL_BACK_END ? environment.REACT_APP_URL_BACK_END : 'http://localhost:5000'

let teacherService = {
    getMyClass: async (search) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(
            search ? `${URL_BACK_END}/api/get-list-classes-by-teacher?search=${search}` :
                `${URL_BACK_END}/api/get-list-classes-by-teacher`
        )
        return response.data
    },

    createNewClass: async ({ name, description, image, level }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let data = { name, description, image, level }
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        })
        let response = await axios.post(`${URL_BACK_END}/api/create-new-class-by-teacher`, formData)
        return response.data
    },

    createNewQuestion: async ({ questionPrompt, options, answer, typeId, level }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/create-new-question-by-teacher`, { questionPrompt, options, answer, typeId, level })
        return response.data
    },

    updateOneQuestion: async ({ questionPrompt, options, answer, typeId, level, questionSelectedId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.put(`${URL_BACK_END}/api/update-question-by-teacher`, { questionPrompt, options, answer, typeId, level, questionSelectedId })
        return response.data
    },

    deleteOneQuestion: async ({ questionSelectedId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.delete(`${URL_BACK_END}/api/delete-question-by-teacher?questionSelectedId=${questionSelectedId}`)
        return response.data
    },

    getQuestion: async ({ typeId, level, search }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(
            search ? `${URL_BACK_END}/api/get-questions-by-teacher?typeId=${typeId}&level=${level}&search=${search}` :
                `${URL_BACK_END}/api/get-questions-by-teacher?typeId=${typeId}&level=${level}`
        )
        return response.data
    },

    createNewAssignment: async ({ name, description, classId, timeLimit, dateFinish, statusId, listQuestionId }) => {
        // console.log(listQuestionId)
        // listQuestionId = JSON.stringify(listQuestionId)
        // console.log(listQuestionId)
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/create-new-exam-by-teacher`, { name, description, classId, dateFinish, timeLimit, typeId: exam_typeId.ASSIGNMENT, statusId, listQuestionId })
        return response.data
    },

    createNewExam: async ({ name, description, classId, timeLimit, dateFinish, statusId, listQuestionId }) => {
        // console.log(listQuestionId)
        // listQuestionId = JSON.stringify(listQuestionId)
        // console.log(listQuestionId)
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/create-new-exam-by-teacher`, { name, description, classId, dateFinish, timeLimit, typeId: exam_typeId.EXAM, statusId, listQuestionId })
        return response.data
    },

    updateOneAssignment: async ({ examId, name, description, classId, dateFinish, timeLimit, statusId, listQuestionId, isUpdateQuestion }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.put(`${URL_BACK_END}/api/update-one-exam-by-teacher`, { examId, name, description, classId, timeLimit, dateFinish, typeId: exam_typeId.ASSIGNMENT, statusId, listQuestionId, isUpdateQuestion })
        return response.data
    },

    updateOneExam: async ({ examId, name, description, classId, dateFinish, timeLimit, statusId, listQuestionId, isUpdateQuestion }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.put(`${URL_BACK_END}/api/update-one-exam-by-teacher`, { examId, name, description, classId, timeLimit, dateFinish, typeId: exam_typeId.EXAM, statusId, listQuestionId, isUpdateQuestion })
        return response.data
    },

    updateInvigilatorOfExam: async ({ examId, invigilatorId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.put(`${URL_BACK_END}/api/update-one-exam-invigilator-by-teacher`, { examId, invigilatorId })
        return response.data
    },

    deleteOneAssignment: async ({ examId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.delete(`${URL_BACK_END}/api/delete-one-exam-by-teacher?examId=${examId}`)
        return response.data
    },

    postDocuments: async ({ classId, files }) => {
        const formData = new FormData();
        files.forEach(item => {
            formData.append("files", item);
        })
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/post-new-documents-by-teacher?classId=${classId}`, formData)
        return response.data
    },

    deleteOneDocument: async ({ documentId, file }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.delete(`${URL_BACK_END}/api/delete-one-documents-by-documentId?documentId=${documentId}&file=${file}`)
        return response.data
    },

    deleteStudentOfClass: async ({ studentId, classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.delete(`${URL_BACK_END}/api/delete-student-of-class-by-teacher?studentId=${studentId}&classId=${classId}`)
        return response.data
    },

    deleteClassByClassId: async ({ classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.delete(`${URL_BACK_END}/api/delete-class-by-teacher?classId=${classId}`)
        return response.data
    },

    updateInforClass: async ({ classId, name, description, image, level, newImage }) => {
        let data = { classId, name, description, image, level, newImage }
        let formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.put(`${URL_BACK_END}/api/update-infor-of-class-by-teacher`, formData)
        return response.data
    },

    addOneStudentToClass: async ({ studentId, classId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/add-new-student-to-class-by-teacher`, { studentId, classId })
        return response.data
    },

    getListExamsOfInvigilatorByTeacherId: async () => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.get(`${URL_BACK_END}/api/get-list-exam-of-invigilator-by-teacher`)
        return response.data
    },

    openExamByTeacher: async ({ examId }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.put(`${URL_BACK_END}/api/open-exam-by-teacher`, { examId })
        return response.data
    },

    createRoomVideoByTeacher: async ({ examId, roomId, roomToken }) => {
        setAuthToken(localStorage[environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
        let response = await axios.post(`${URL_BACK_END}/api/create-room-video-by-teacher`, { examId, roomId, roomToken })
        return response.data
    },

}

export default teacherService

