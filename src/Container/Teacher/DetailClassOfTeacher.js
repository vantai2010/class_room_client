import FormatedText from "../../components/FormatedText/FormatedText";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from 'react-router';
import { confirm_type, email_typeId, environment, exam_statusId, exam_typeId, languages, notify_typeId, path, processId, question_typeId, time_type, type_modalId } from "../../utils/constant";
import { useSelector } from "react-redux";
import { MdAssignment } from "react-icons/md";
import "./DetailClass.scss";
import { MdEdit } from "react-icons/md";
import { TbTrashFilled } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { TiDeleteOutline } from "react-icons/ti";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { Modal } from 'antd';
import { Progress } from 'antd';
import Avatar from "../../components/Avatar";
import { MdOutlineAssignment } from "react-icons/md";
import { CiSquarePlus } from "react-icons/ci";
import userService from "../../service/userService";
import { toast } from 'react-toastify';
import teacherService from "../../service/teacherService";
import moment from "moment";
import { CiSettings } from "react-icons/ci";
import { appService } from "../../service/appService";
import { responsiveArray } from "antd/es/_util/responsiveObserver";


function DetailClassOfTeacher() {
    const navigate = useNavigate()
    const params = useParams()
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)
    const [isModalCreateAssignmentOpen, setIsModalCreateAssignmentOpen] = useState(false);
    const [isModalCreateExamOpen, setIsModalCreateExamOpen] = useState(false);
    const [isModalChoiseQuestionOpen, setIsModalChoiseQuestionOpen] = useState(false);
    const [isModalReviewExamOpen, setIsModalReviewExamOpen] = useState(false);
    const [isModalReviewResultOpen, setIsModalReviewResultOpen] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    const [isModalInforClassOpen, setIsModalInforClassOpen] = useState(false);
    const [isModalAddStudentOpen, setIsModalAddStudentOpen] = useState(false);
    const [questionTypeShow, setQuestionTypeShow] = useState()
    const [processTypeShow, setProcessTypeShow] = useState()

    const [listQuestionSelected, setListQuestionSelected] = useState({ EASY: [], MEDIUM: [], HARD: [] })
    const [inputForm, setInputForm] = useState({
        name: "",
        dateFinish: "",
        description: "",
        typeId: "",
        statusId: "",
        timeLimit: "",
    })
    const [errMess, setErrMess] = useState({
        name: "",
        dateFinish: "",
        description: "",
        typeId: "",
        statusId: "",
        timeLimit: "",
        questionSelected: "",
        invigilatorSelected: ""
    })
    // information class
    const [listStudentOfClass, setListStudentOfClass] = useState([])
    const [listUserSearched, setListUserSearched] = useState([])
    const [textSearch, setTextSearch] = useState("")
    const [textSearchListStudent, setTextSearchListStudent] = useState("")
    const idStudentSelected = useRef()
    const listStudent = useRef()
    const getListStudentOfClass = async () => {
        let response = await userService.getListStudentOfClass({ classId: params.id })
        if (response && response.result === true) {
            listStudent.current = response.data
            console.log(response.data)
            setListStudentOfClass(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const handleChangeTextSearchStudent = (value) => {
        setTextSearch(value)
        if (idTimeOut.current) {
            clearInterval(idTimeOut.current)
        }
        idTimeOut.current = setTimeout(async () => {
            let response = await userService.searchUser({ search: value, classId: params.id })
            if (response && response.result === true) {
                setListUserSearched(response.data)
            }
        }, 500)
    }
    const handleChangeTextSearchListStudent = (value) => {
        setTextSearchListStudent(value)
        if (value === "") {
            setListStudentOfClass(listStudent.current)
        }
        setListStudentOfClass(listStudent.current.filter(student => {
            return student.studentClassData?.firstName.includes(value) || student.studentClassData?.lastName.includes(value)
        }))
    }
    /// update infor class
    const [isModalUpdateInforClassOpen, setIsModalUpdateInforClassOpen] = useState(false);
    const [inforClass, setInforClass] = useState({
        name: "",
        description: "",
        level: "",
        image: ""
    })
    const [errMessUpdate, setErrMessUpdate] = useState({
        name: "",
        description: "",
    })
    const [newImageUpdate, setNewImageUpdate] = useState()
    const handleChangeFileImage = (value) => {
        setNewImageUpdate(value)
    }
    const handleChangeInputUpdate = (type, value) => {
        setInforClass({
            ...inforClass,
            [type]: value
        })
    }
    const getInforClassByClassId = async () => {
        let response = await userService.getInforClassByClassId({ classId: params.id })
        if (response && response.result === true) {
            setInforClass({
                name: response.data.name,
                description: response.data.description,
                level: response.data.level,
                image: response.data.image
            })
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }

    }
    const handleUpdateInforClass = async () => {
        let { name, description, level, image } = inforClass
        if (!name.trim()) {
            setErrMessUpdate({
                name: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                description: "",
            })
            return
        }
        if (!description.trim()) {
            setErrMessUpdate({
                name: "",
                description: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
            })
            return
        }
        if (!isNaN(name)) {
            setErrMessUpdate({
                name: language === languages.EN ? "This field must be not a number" : "Trường này không thể là số",
                description: "",
            })
            return
        }
        if (!isNaN(description)) {
            setErrMessUpdate({
                name: "",
                description: language === languages.EN ? "This field must be not a number" : "Trường này không thể là số",
            })
            return
        }
        let response = await teacherService.updateInforClass({
            classId: params.id,
            name,
            description,
            image,
            level,
            newImage: newImageUpdate
        })

        if (response && response.result === true) {
            toast.success(language === languages.EN ? response.messageEN : response.messageVI)
            handleCloseModalUpdateInforClass()
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    ///

    const typeQuestionCurrent = useRef()
    const [listAssignments, setListAssignments] = useState([])
    const [listExams, setListExams] = useState([])
    const [listOptionsQuestions, setListOptionsQuestions] = useState([])
    const [listCheckboxChecked, setListCheckboxChecked] = useState([])
    const [searchQuestion, setSearchQuestion] = useState("")
    const idTimeOut = useRef()
    const idExamSelected = useRef()
    const documentSelected = useRef()
    const isUpdateListQuestion = useRef()
    const typeFunction = useRef()
    const confirmType = useRef()
    const [listDocuments, setListDocuments] = useState([])

    const getListOptionsQuestion = async () => {
        let response = await teacherService.getQuestion({ typeId: typeQuestionCurrent.current, level: params.level, search: "" })
        if (response && response.result === true) {
            // let customData = response.data.map(item => {
            //     return {
            //         ...item,
            //         isSelected: false
            //     }
            // })
            setListOptionsQuestions(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const handleChangeCheckbox = (itemSelect) => {
        isUpdateListQuestion.current = true
        if (listCheckboxChecked.some(item => item.id === itemSelect.id)) {
            setListCheckboxChecked(listCheckboxChecked.filter(item => item.id !== itemSelect.id))
        } else {
            let arr = [...listCheckboxChecked]
            arr.push(itemSelect)
            setListCheckboxChecked(arr)
        }
    }
    const handleSearchQuestion = (value) => {
        setSearchQuestion(value)
        if (idTimeOut.current) {
            clearTimeout(idTimeOut.current)
        }
        idTimeOut.current = setTimeout(async () => {
            let response = await teacherService.getQuestion({ typeId: typeQuestionCurrent.current, level: params.level, search: value })
            if (response && response.result === true) {

                setListOptionsQuestions(response.data)
            } else {
                toast.error(language === languages.EN ? response.messageEN : response.messageVI)
            }
        }, 500)
    }
    const handleOkModalCreateAssignmentQuestion = async () => {
        let { name, dateFinish, description, typeId, statusId, timeLimit } = inputForm
        let easyQuestionId = listQuestionSelected.EASY.map(item => item.id)
        let mediumQuestionId = listQuestionSelected.MEDIUM.map(item => item.id)
        let hardQuestionId = listQuestionSelected.HARD.map(item => item.id)
        const listQuestionId = [...easyQuestionId, ...mediumQuestionId, ...hardQuestionId]
        // console.log(listQuestionId, inputForm, moment(dateFinish).format(time_type.NO_HOURS))
        if (!name.trim()) {
            setErrMess({
                name: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: ""
            })
            return
        }
        if (!dateFinish) {
            setErrMess({
                name: "",
                dateFinish: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: ""
            })
            return
        }
        if (!description.trim()) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: ""
            })
            return
        }
        if (!statusId) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: language === languages.EN ? "Please select this field" : "Vui lòng chọn trường này",
                timeLimit: "",
                questionSelected: ""
            })
            return
        }
        if (!timeLimit.trim()) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                questionSelected: ""
            })
            return
        }
        if (!isNaN(name)) {
            setErrMess({
                name: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: ""
            })
            return
        }
        if (!isNaN(description)) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: ""
            })
            return
        }
        if (isNaN(timeLimit)) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: language === languages.EN ? 'This field must be a number' : "Trường này phải là số",
                questionSelected: ""
            })
            return
        }
        if (listQuestionId.length === 0) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: language === languages.EN ? "Please select a question" : "Vui lòng chọn câu hỏi"
            })
            return
        }
        let response
        if (typeFunction.current === type_modalId.CREATE) {
            response = await teacherService.createNewAssignment({ name, description, classId: params.id, timeLimit, dateFinish: moment(dateFinish).format(time_type.NO_HOURS), statusId, listQuestionId })
        } else if (typeFunction.current === type_modalId.UPDATE) {
            response = await teacherService.updateOneAssignment({ examId: idExamSelected.current, name, description, classId: params.id, timeLimit, dateFinish: moment(dateFinish).format(time_type.NO_HOURS), statusId, listQuestionId, isUpdateQuestion: isUpdateListQuestion.current })
        }
        if (response && response.result === true) {
            toast.success(language === languages.EN ? response.messageEN : response.messageVI)
            getListAssignmentsClassByClassId()
            handleCloseModalCreateAssignment()
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }


    const getListAssignmentsClassByClassId = async () => {
        let response = await userService.getAssignmentsByClassId({ classId: params.id })
        if (response && response.result === true) {
            setListAssignments(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const getListExamsClassByClassId = async () => {
        let response = await userService.getExamsByClassId({ classId: params.id })
        if (response && response.result === true) {
            console.log(response.data)
            setListExams(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const getListDocumentsByClassId = async () => {
        let response = await userService.getListDocumentsByClass({ classId: params.id })
        if (response && response.result === true) {
            setListDocuments(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const getContentExamByExamId = async () => {
        let response = await userService.getContentAssignmentsByExamId({ examId: idExamSelected.current })
        if (response && response.result === true) {
            isUpdateListQuestion.current = false
            setInputForm({
                name: response.data.name,
                dateFinish: convertToISODate(response.data.dateFinish),
                description: response.data.description,
                typeId: response.data.typeId,
                statusId: response.data.statusId,
                timeLimit: response.data.timeLimit,
            })
            console.log(response.data)
            setListQuestionSelected(response.data.question)
            if (confirmType.current === confirm_type.EXAM) {
                setListInvigilator([response.data.invigilatorData])
            }
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    useEffect(() => {
        getListAssignmentsClassByClassId()
        getListDocumentsByClassId()
        getListExamsClassByClassId()
        getInforClassByClassId()
    }, [])

    const handleChangeInput = (type, value) => {
        setInputForm({
            ...inputForm,
            [type]: value
        })
    }
    const handleSelectFile = async (e) => {
        let arrFiles = Object.values(e)
        let response = await teacherService.postDocuments({ classId: params.id, files: arrFiles })
        if (response && response.result === true) {
            toast.success(language === languages.EN ? response.messageEN : response.messageVI)
            getListDocumentsByClassId()
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    const handleShowReviewQuestion = async () => {
        let response = await userService.getListQuestionsOfExam({ examId: idExamSelected.current })
        if (response && response.result === true) {
            setIsModalReviewExamOpen(true)
            setListCheckboxChecked([...response.data.EASY, ...response.data.MEDIUM, ...response.data.HARD])
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    const handleCloseModalSelectQuestion = () => {
        setIsModalChoiseQuestionOpen(false)
        setListCheckboxChecked([])
    }
    const handleOkModalSelectQuestion = () => {
        setIsModalChoiseQuestionOpen(false)
        setListCheckboxChecked([])
        setListQuestionSelected({
            ...listQuestionSelected,
            [typeQuestionCurrent.current]: listCheckboxChecked
        })
    }
    const handleDeleteQuestionSelected = (type, idSelected) => {
        setListQuestionSelected({
            ...listQuestionSelected,
            [type]: listQuestionSelected[type].filter(item => item.id !== idSelected)
        })
    }
    const handleCloseModalCreateAssignment = () => {
        setIsModalCreateAssignmentOpen(false)
        setInputForm({
            name: "",
            dateFinish: "",
            description: "",
            typeId: "",
            statusId: "",
            timeLimit: "",
        })
        setErrMess({
            name: "",
            dateFinish: "",
            description: "",
            typeId: "",
            statusId: "",
            timeLimit: "",
            questionSelected: "",
        })
        setListQuestionSelected({ EASY: [], MEDIUM: [], HARD: [] })
    }
    const handleOkModalConfirmDelete = async () => {
        let response
        if (confirmType.current === confirm_type.ASSIGNMENT || confirmType.current === confirm_type.EXAM) {
            response = await teacherService.deleteOneAssignment({ examId: idExamSelected.current })
        } else if (confirmType.current === confirm_type.DOCUMENT) {
            response = await teacherService.deleteOneDocument({ documentId: documentSelected.current.id, file: documentSelected.current.file })
        } else if (confirmType.current === confirm_type.DEL_STUDENT) {
            response = await teacherService.deleteStudentOfClass({ studentId: idStudentSelected.current, classId: params.id })
        } else if (confirmType.current === confirm_type.DEL_CLASS) {
            response = await teacherService.deleteClassByClassId({ classId: params.id })
        }
        if (response && response.result === true) {
            toast.success(language === languages.EN ? response.messageEN : response.messageVI)
            setIsModalConfirmOpen(false)
            if (confirmType.current === confirm_type.ASSIGNMENT) {
                getListAssignmentsClassByClassId()
            } else if (confirmType.current === confirm_type.DOCUMENT) {
                getListDocumentsByClassId()
            } else if (confirmType.current === confirm_type.DEL_CLASS) {
                return navigate("/home" + path.TEACHER.MY_CLASS)
            } else if (confirmType.current === confirm_type.DEL_STUDENT) {
                getListStudentOfClass()
                await userService.postNewNotify({
                    receiverId: idStudentSelected.current,
                    contentEN: `You have been dropped from class ${inforClass.name}`,
                    contentVI: `Bạn đã bị rời khỏi lớp ${inforClass.name}`,
                    typeId: notify_typeId.NOTIFY,
                })
            } else if (confirmType.current === confirm_type.EXAM) {
                getListExamsClassByClassId()
            }
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const handleCloseModalRequestJoinClass = () => {
        setIsModalAddStudentOpen(false)
        setTextSearch("")
        setListUserSearched([])
    }
    const handleCloseModalInforClass = () => {
        setIsModalInforClassOpen(false)
        setTextSearchListStudent("")
    }
    const handleCloseModalUpdateInforClass = () => {
        setIsModalUpdateInforClassOpen(false)
        getInforClassByClassId()
        setErrMessUpdate({
            name: "",
            description: "",
            level: ""
        })
    }
    const handleCloseModalCreateExam = () => {
        setTextSearch("")
        setIsModalCreateExamOpen(false)
        setInputForm({
            name: "",
            dateFinish: "",
            description: "",
            typeId: "",
            statusId: "",
            timeLimit: "",
        })
        setErrMess({
            name: "",
            dateFinish: "",
            description: "",
            typeId: "",
            statusId: "",
            timeLimit: "",
            questionSelected: "",
            invigilatorSelected: ""

        })
        setListQuestionSelected({ EASY: [], MEDIUM: [], HARD: [] })
        setListInvigilator([])
    }

    const convertToISODate = (dateString) => {
        var parts = dateString.split('/');
        return parts[2] + '-' + parts[1] + '-' + parts[0];
    }

    // const downloadFile = async (fileName) => {
    //     let response = await appService.dowloadDocument({ fileName: fileName })
    //     if (response && response.result === false) {
    //         toast.error(language === languages.EN ? response.messageVI : response.messageEN)
    //     }
    // };

    const handleReqJoinClass = async ({ studentId }) => {
        let response = await userService.postNewNotify({
            receiverId: studentId,
            contentEN: `Teacher ${userInfor.lastName} ${userInfor.firstName} would like to invite you to join class ${inforClass.name}`,
            contentVI: `Giáo viên ${userInfor.lastName} ${userInfor.firstName} muốn mời bạn tham gia vào lớp ${inforClass.name}`,
            typeId: notify_typeId.TEACHER_REQ_JOIN_CLASS,
            params: params.id
        })
        if (response && response.result === true) {
            toast.success(language === languages.EN ? "Invitation sent successfully" : "Gửi lời mời thành công")
        } else {
            toast.error(language === languages.EN ? "Invitation sent failed" : "Gửi lời mời thất bại")
        }
    }

    // exam
    const [listInvigilator, setListInvigilator] = useState([])
    const addInvigilator = (data) => {
        let arr = [...listInvigilator]
        if (arr.some(item => item.id === data.id) || listInvigilator.length === 1) {
            return
        }
        arr.push(data)
        setListInvigilator(arr)
    }
    const removeInvigilator = (idSelected) => {
        let arr = [...listInvigilator]
        arr = arr.filter(item => item.id !== idSelected)
        setListInvigilator(arr)
    }
    const handleChangeSearchTeacher = async (value) => {
        setTextSearch(value)
        if (idTimeOut.current) {
            clearInterval(idTimeOut.current)
        }
        idTimeOut.current = setTimeout(async () => {
            let response = await userService.searchTeacher({ search: value })
            if (response && response.result === true) {
                setListUserSearched(response.data)
            }
        }, 500)
    }
    const handleOkModalCreateExam = async () => {
        let { name, dateFinish, description, typeId, statusId, timeLimit } = inputForm
        let easyQuestionId = listQuestionSelected.EASY.map(item => item.id)
        let mediumQuestionId = listQuestionSelected.MEDIUM.map(item => item.id)
        let hardQuestionId = listQuestionSelected.HARD.map(item => item.id)
        const listQuestionId = [...easyQuestionId, ...mediumQuestionId, ...hardQuestionId]
        // console.log(listQuestionId, inputForm, moment(dateFinish).format(time_type.NO_HOURS))
        if (!name.trim()) {
            setErrMess({
                name: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: "",
                invigilatorSelected: ""
            })
            return
        }
        if (!dateFinish) {
            setErrMess({
                name: "",
                dateFinish: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: "",
                invigilatorSelected: ""
            })
            return
        }
        if (!description.trim()) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: "",
                invigilatorSelected: ""
            })
            return
        }
        if (!statusId) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: language === languages.EN ? "Please select this field" : "Vui lòng chọn trường này",
                timeLimit: "",
                questionSelected: "",
                invigilatorSelected: ""
            })
            return
        }
        if (!timeLimit.trim()) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                questionSelected: "",
                invigilatorSelected: ""
            })
            return
        }
        if (!isNaN(name)) {
            setErrMess({
                name: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: "",
                invigilatorSelected: ""
            })
            return
        }
        if (!isNaN(description)) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: "",
                invigilatorSelected: ""
            })
            return
        }
        if (isNaN(timeLimit)) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: language === languages.EN ? 'This field must be a number' : "Trường này phải là số",
                questionSelected: "",
                invigilatorSelected: ""
            })
            return
        }
        if (listQuestionId.length === 0) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: language === languages.EN ? "Please select a question" : "Vui lòng chọn câu hỏi",
                invigilatorSelected: ""
            })
            return
        }
        console.log(listInvigilator, listInvigilator.length)

        if (listInvigilator.length === 0) {
            setErrMess({
                name: "",
                dateFinish: "",
                description: "",
                typeId: "",
                statusId: "",
                timeLimit: "",
                questionSelected: "",
                invigilatorSelected: language === languages.EN ? "Please choise proctor the exam" : "Vui lòng chọn giám thị coi thi"
            })
            return
        }
        if (typeFunction.current === type_modalId.CREATE) {
            let response = await teacherService.createNewExam({ name, description, classId: params.id, timeLimit, dateFinish: moment(dateFinish).format(time_type.NO_HOURS), statusId, listQuestionId })
            if (response && response.result === true) {
                getListExamsClassByClassId()
                handleCloseModalCreateExam()
                let res = await userService.createNewInvigilator({ examId: response.examId, invigilatorId: listInvigilator[0].id })
                if (res && res.result === true) {
                    userService.sendEmail({ typeId: email_typeId.SEND_TO_INVIGILATOR, receiverEmail: listInvigilator[0].email, language })
                    toast.success(language === languages.EN ? response.messageEN : response.messageVI)
                } else {
                    toast.error(language === languages.EN ? res.messageEN : res.messageVI)
                }
            } else {
                toast.error(language === languages.EN ? response.messageEN : response.messageVI)
            }
        }
        if (typeFunction.current === type_modalId.UPDATE) {
            let response = await teacherService.updateOneExam({ examId: idExamSelected.current, name, description, classId: params.id, timeLimit, dateFinish: moment(dateFinish).format(time_type.NO_HOURS), statusId, listQuestionId, isUpdateQuestion: isUpdateListQuestion.current })
            if (response && response.result === true) {
                let res = await teacherService.updateInvigilatorOfExam({ examId: idExamSelected.current, invigilatorId: listInvigilator[0].id })
                if (res.result === true) {
                    userService.sendEmail({ typeId: email_typeId.SEND_TO_INVIGILATOR, receiverEmail: listInvigilator[0].email, language })
                }
                getListExamsClassByClassId()
                handleCloseModalCreateExam()
                toast.success(language === languages.EN ? response.messageEN : response.messageVI)
            } else {
                toast.error(language === languages.EN ? response.messageEN : response.messageVI)
            }
        }

    }
    //
    const [dataReviewResult, setDataReviewResult] = useState({ DONE: [], UNFINISHED: [], UNDER_FIVE: [], FIVE_TO_SEVEN: [], EIGHT_TO_TEN: [], total: 0 })
    const handleShowReviewResultOfExam = async (examId) => {
        setIsModalReviewResultOpen(true)
        let response = await userService.getReviewResultOfStudentInExam({ classId: params.id, examId })
        if (response && response.result === true) {
            let data = response.data
            setDataReviewResult({
                DONE: data.filter(item => item.point !== -1),
                UNFINISHED: data.filter(item => item.point === -1),
                UNDER_FIVE: data.filter(item => item.point < 5 && item.point >= 0),
                FIVE_TO_SEVEN: data.filter(item => item.point < 7 && item.point >= 5),
                EIGHT_TO_TEN: data.filter(item => item.point >= 8),
                total: data.length
            })
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    const optionsQuestionMap = { 0: "A. ", 1: "B. ", 2: "C. ", 3: "D. " }

    const handleOpenExam = async (examId) => {
        let response = await teacherService.openExamByTeacher({ examId })
        if (response && response.result === true) {
            navigate(path.ROOT_PATH_NORMAL + path.EXAM + "/" + examId)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }

    }

    return (
        <>
            <Modal title={language === languages.EN ? "Assignment form" : "Mẫu bài tập"}
                width={800}
                open={isModalCreateAssignmentOpen}
                onOk={() => handleOkModalCreateAssignmentQuestion()}
                onCancel={() => handleCloseModalCreateAssignment()}
            >
                <div className="row">
                    <div className="col-6">
                        <label>Tên bài: </label>
                        <input type="text" className="form-control" value={inputForm.name} onChange={e => handleChangeInput("name", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.name}</p>
                    </div>
                    <div className="col-6">
                        <label>Hạn nộp: </label>
                        <input type="date" className="form-control" min={new Date().toISOString().split('T')[0]} value={inputForm.dateFinish} onChange={e => handleChangeInput("dateFinish", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.dateFinish}</p>
                    </div>
                    <div className="col-12">
                        <label>Mô tả: </label>
                        <textarea className="form-control" value={inputForm.description} onChange={e => handleChangeInput("description", e.target.value)}></textarea>
                        <p style={{ color: "red" }}>{errMess.description}</p>
                    </div>
                    <div className="col-6">
                        <label>Trạng thái: </label>
                        <select className="form-control" value={inputForm.statusId} onChange={e => handleChangeInput("statusId", e.target.value)}>
                            <option></option>
                            <option value={exam_statusId.CLOSE}>{language === languages.EN ? "CLose" : "Đóng"}</option>
                            <option value={exam_statusId.OPEN}>{language === languages.EN ? "Open" : "Mở"}</option>
                        </select>
                        <p style={{ color: "red" }}>{errMess.statusId}</p>
                    </div>
                    <div className="col-6">
                        <label>Thời gian làm bài (phút): </label>
                        <input type="text" className="form-control" value={inputForm.timeLimit} onChange={e => handleChangeInput("timeLimit", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.timeLimit}</p>
                    </div>

                    <div className="col-12">
                        <p>Danh sách câu hỏi</p>
                    </div>
                    <div className="col-6">
                        <label>Câu hỏi dễ ({listQuestionSelected[question_typeId.EASY].length})</label>
                        {
                            questionTypeShow === question_typeId.EASY ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow(question_typeId.EASY)} />
                        }

                    </div>
                    <div className="col-6">
                        <button className="btn btn-primary"
                            onClick={() => { typeQuestionCurrent.current = question_typeId.EASY; getListOptionsQuestion(); setIsModalChoiseQuestionOpen(true) }}
                        >
                            Chọn câu hỏi
                        </button>
                    </div>
                    <div className="col-12">
                        <div className={questionTypeShow === question_typeId.EASY ? "question-select-container selected" : "question-select-container"}>
                            {
                                listQuestionSelected[question_typeId.EASY].length > 0 &&
                                listQuestionSelected[question_typeId.EASY].map(item => {
                                    return (
                                        <div className="each-question">
                                            <p className="name-question">{item.questionPrompt}</p>
                                            <div className="btn-container">
                                                <TiDeleteOutline className="btn-delete" onClick={() => handleDeleteQuestionSelected(question_typeId.EASY, item.id)} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="col-6">
                        <label>Câu hỏi trung bình ({listQuestionSelected[question_typeId.MEDIUM].length})</label>
                        {
                            questionTypeShow === question_typeId.MEDIUM ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow(question_typeId.MEDIUM)} />
                        }

                    </div>
                    <div className="col-6">
                        <button className="btn btn-primary"
                            onClick={() => { typeQuestionCurrent.current = question_typeId.MEDIUM; getListOptionsQuestion(); setIsModalChoiseQuestionOpen(true) }}
                        >
                            Chọn câu hỏi
                        </button>
                    </div>
                    <div className="col-12">
                        <div className={questionTypeShow === question_typeId.MEDIUM ? "question-select-container selected" : "question-select-container"}>
                            {
                                listQuestionSelected[question_typeId.MEDIUM].length > 0 &&
                                listQuestionSelected[question_typeId.MEDIUM].map(item => {
                                    return (
                                        <div className="each-question">
                                            <p className="name-question">{item.questionPrompt}</p>
                                            <div className="btn-container">
                                                <TiDeleteOutline className="btn-delete" onClick={() => handleDeleteQuestionSelected(question_typeId.MEDIUM, item.id)} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="col-6">
                        <label>Câu hỏi khó ({listQuestionSelected[question_typeId.HARD].length})</label>
                        {
                            questionTypeShow === question_typeId.HARD ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow(question_typeId.HARD)} />
                        }

                    </div>
                    <div className="col-6">
                        <button className="btn btn-primary"
                            onClick={() => { typeQuestionCurrent.current = question_typeId.HARD; getListOptionsQuestion(); setIsModalChoiseQuestionOpen(true) }}
                        >
                            Chọn câu hỏi
                        </button>
                    </div>
                    <div className="col-12">
                        <div className={questionTypeShow === question_typeId.HARD ? "question-select-container selected" : "question-select-container"}>
                            {
                                listQuestionSelected[question_typeId.HARD].length > 0 &&
                                listQuestionSelected[question_typeId.HARD].map(item => {
                                    return (
                                        <div className="each-question">
                                            <p className="name-question">{item.questionPrompt}</p>
                                            <div className="btn-container">
                                                <TiDeleteOutline className="btn-delete" onClick={() => handleDeleteQuestionSelected(question_typeId.HARD, item.id)} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <p style={{ color: "red" }}>{errMess.questionSelected}</p>
                </div>
            </Modal>

            <Modal title={language === languages.EN ? "Exam form" : "Mẫu bài thi"}
                width={800}
                open={isModalCreateExamOpen}
                onOk={() => handleOkModalCreateExam()}
                onCancel={() => handleCloseModalCreateExam()}
            >
                <div className="row">
                    <div className="col-6">
                        <label>Tên bài: </label>
                        <input type="text" className="form-control" value={inputForm.name} onChange={e => handleChangeInput("name", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.name}</p>
                    </div>
                    <div className="col-6">
                        <label>Hạn nộp: </label>
                        <input type="date" className="form-control" min={new Date().toISOString().split('T')[0]} value={inputForm.dateFinish} onChange={e => handleChangeInput("dateFinish", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.dateFinish}</p>
                    </div>
                    <div className="col-12">
                        <label>Mô tả: </label>
                        <textarea className="form-control" value={inputForm.description} onChange={e => handleChangeInput("description", e.target.value)} ></textarea>
                        <p style={{ color: "red" }}>{errMess.description}</p>
                    </div>
                    {/* <div className="col-3">
                        <label>Dạng bài: </label>
                        <select className="form-control" value={inputForm.typeId} onChange={e => handleChangeInput("typeId", e.target.value)}>
                            <option>Bài tập</option>
                            <option>Bài thi</option>
                        </select>
                        <p style={{ color: "red" }}>{errMess.typeId}</p>
                    </div> */}
                    <div className="col-3">
                        <label>Trạng thái: </label>
                        <select className="form-control" value={inputForm.statusId} onChange={e => handleChangeInput("statusId", e.target.value)}>
                            <option></option>
                            <option value={exam_statusId.CLOSE}>{language === languages.EN ? "CLose" : "Đóng"}</option>
                            <option value={exam_statusId.OPEN}>{language === languages.EN ? "Open" : "Mở"}</option>
                        </select>
                        <p style={{ color: "red" }}>{errMess.statusId}</p>
                    </div>
                    <div className="col-6">
                        <label>Thời gian làm bài (phút): </label>
                        <input type="text" className="form-control" value={inputForm.timeLimit} onChange={e => handleChangeInput("timeLimit", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.timeLimit}</p>
                    </div>
                    <div className="col-12">
                        <label>Giám thị (Tối đa 1 người)</label>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" value={textSearch} onChange={e => handleChangeSearchTeacher(e.target.value)}
                            placeholder={language === languages.EN ? "Enter name or email" : "Nhập tên hoặc email"}
                        />
                        <p style={{ color: "red" }}>{errMess.invigilatorSelected}</p>
                    </div>
                    <div className="col-6">
                        <div className="tag-name-container">
                            {
                                listInvigilator.length > 0 &&
                                listInvigilator.map(item => {
                                    return (
                                        <div className="tag-name" key={item.id}>
                                            <span>{language === languages.EN ? `${item?.firstName} ${item?.lastName}` : `${item?.lastName} ${item?.firstName}`} ({item?.email})</span>
                                            <TiDeleteOutline className="btn-tag-name-close" onClick={() => removeInvigilator(item.id)} />
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                    {
                        textSearch.length > 0 &&
                        <div className="col-12">
                            <div className="container">
                                <div className="list-teacher-search row">
                                    {
                                        listUserSearched.length > 0 ?
                                            listUserSearched.map(item => {
                                                return (
                                                    <div className="col-4" key={item.id}>
                                                        <div className="each-teacher-search">
                                                            <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                            <span>{language === languages.EN ? `${item.firstName} ${item.lastName}` : `${item.lastName} ${item.firstName}`} ({item.email})</span>
                                                            <CiSquarePlus className="btn-plus-teacher" onClick={() => addInvigilator(item)} />
                                                        </div>
                                                    </div>
                                                )
                                            }) :
                                            <p>{language === languages.EN ? "Not found" : "Không có kết quả"}</p>
                                    }
                                </div>
                            </div>
                        </div>
                    }

                    <div className="col-12">
                        <p>Danh sách câu hỏi</p>
                    </div>
                    <div className="col-6">
                        <label>Câu hỏi dễ ({listQuestionSelected[question_typeId.EASY].length})</label>
                        {
                            questionTypeShow === question_typeId.EASY ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow(question_typeId.EASY)} />
                        }

                    </div>
                    <div className="col-6">
                        <button className="btn btn-primary"
                            onClick={() => { typeQuestionCurrent.current = question_typeId.EASY; getListOptionsQuestion(); setIsModalChoiseQuestionOpen(true) }}
                        >
                            Chọn câu hỏi
                        </button>
                    </div>
                    <div className="col-12">
                        <div className={questionTypeShow === question_typeId.EASY ? "question-select-container selected" : "question-select-container"}>
                            {
                                listQuestionSelected[question_typeId.EASY].length > 0 &&
                                listQuestionSelected[question_typeId.EASY].map(item => {
                                    return (
                                        <div className="each-question">
                                            <p className="name-question">{item.questionPrompt}</p>
                                            <div className="btn-container">
                                                <TiDeleteOutline className="btn-delete" onClick={() => handleDeleteQuestionSelected(question_typeId.EASY, item.id)} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="col-6">
                        <label>Câu hỏi trung bình ({listQuestionSelected[question_typeId.MEDIUM].length})</label>
                        {
                            questionTypeShow === question_typeId.MEDIUM ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow(question_typeId.MEDIUM)} />
                        }

                    </div>
                    <div className="col-6">
                        <button className="btn btn-primary"
                            onClick={() => { typeQuestionCurrent.current = question_typeId.MEDIUM; getListOptionsQuestion(); setIsModalChoiseQuestionOpen(true) }}
                        >
                            Chọn câu hỏi
                        </button>
                    </div>
                    <div className="col-12">
                        <div className={questionTypeShow === question_typeId.MEDIUM ? "question-select-container selected" : "question-select-container"}>
                            {
                                listQuestionSelected[question_typeId.MEDIUM].length > 0 &&
                                listQuestionSelected[question_typeId.MEDIUM].map(item => {
                                    return (
                                        <div className="each-question">
                                            <p className="name-question">{item.questionPrompt}</p>
                                            <div className="btn-container">
                                                <TiDeleteOutline className="btn-delete" onClick={() => handleDeleteQuestionSelected(question_typeId.MEDIUM, item.id)} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="col-6">
                        <label>Câu hỏi khó ({listQuestionSelected[question_typeId.HARD].length})</label>
                        {
                            questionTypeShow === question_typeId.HARD ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setQuestionTypeShow(question_typeId.HARD)} />
                        }

                    </div>
                    <div className="col-6">
                        <button className="btn btn-primary"
                            onClick={() => { typeQuestionCurrent.current = question_typeId.HARD; getListOptionsQuestion(); setIsModalChoiseQuestionOpen(true) }}
                        >
                            Chọn câu hỏi
                        </button>
                    </div>
                    <div className="col-12">
                        <div className={questionTypeShow === question_typeId.HARD ? "question-select-container selected" : "question-select-container"}>
                            {
                                listQuestionSelected[question_typeId.HARD].length > 0 &&
                                listQuestionSelected[question_typeId.HARD].map(item => {
                                    return (
                                        <div className="each-question">
                                            <p className="name-question">{item.questionPrompt}</p>
                                            <div className="btn-container">
                                                <TiDeleteOutline className="btn-delete" onClick={() => handleDeleteQuestionSelected(question_typeId.HARD, item.id)} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <p style={{ color: "red" }}>{errMess.questionSelected}</p>
                </div>
            </Modal>

            <Modal title={language === languages.EN ? "Choise question" : "Chọn câu hỏi"}
                width={800}
                open={isModalChoiseQuestionOpen}
                onOk={() => handleOkModalSelectQuestion(false)}
                onCancel={() => handleCloseModalSelectQuestion(false)}
            >
                <div className="row">
                    <div className="col-12">
                        <div className="list-question-container">
                            <span>Tìm kiếm</span>
                            <input type="text" className="form-control" value={searchQuestion} onChange={e => handleSearchQuestion(e.target.value)} />
                            {
                                listOptionsQuestions.length > 0 &&
                                listOptionsQuestions.map(item => {
                                    return (
                                        <div className="each-question" key={item.id}>
                                            <input type="checkbox" checked={listCheckboxChecked.some(eachQuestion => eachQuestion.id === item.id)}
                                                onChange={() => handleChangeCheckbox(item)}
                                            />
                                            <div className="infor-question ml-2">
                                                <p className="title-question">{item.questionPrompt}</p>
                                                <div className="answer">
                                                    <div className="row" style={{}}>
                                                        {
                                                            item.options.map((option, index) => {
                                                                return (<div className="col-3"><p>{optionsQuestionMap[index]}{option}</p></div>)
                                                            })
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal title={language === languages.EN ? "Review sample assignment" : "Xem mẫu bài làm"}
                width={800}
                open={isModalReviewExamOpen}
                onOk={() => setIsModalReviewExamOpen(false)}
                onCancel={() => setIsModalReviewExamOpen(false)}
            >
                <div className="row">
                    {
                        listCheckboxChecked.length > 0 &&
                        listCheckboxChecked.map(item => {
                            return (
                                <div className="col-12">
                                    <div className="each-question">
                                        <div className="infor-question ml-2">
                                            <p className="title-question">{item.questionPrompt}</p>
                                            <div className="answer">
                                                <div className="row">
                                                    {
                                                        item.options.map((eachOption, index) => {
                                                            return (<div className="col-3"><p>{optionsQuestionMap[index]}{eachOption}</p></div>)
                                                        })
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Modal>

            <Modal title={language === languages.EN ? "Review result" : "Xem kết quả"}
                width={900}
                open={isModalReviewResultOpen}
                onOk={() => setIsModalReviewResultOpen(false)}
                onCancel={() => setIsModalReviewResultOpen(false)}
            >
                <div className="row">
                    <div className="col-12">
                        <label>Hoàn thành ({dataReviewResult.DONE.length}/{dataReviewResult.total})</label>
                        {
                            processTypeShow === processId.DONE ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setProcessTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setProcessTypeShow(processId.DONE)} />
                        }
                        <Progress percent={Math.floor((dataReviewResult.DONE.length / dataReviewResult.total) * 100)} status="success" />
                        {
                            processTypeShow === processId.DONE &&
                            <div className="list-user-progress row">
                                {
                                    dataReviewResult.DONE.length > 0 &&
                                    dataReviewResult.DONE.map(item => {
                                        return (
                                            <div className="col-6">
                                                <div className="each-user-progress">
                                                    <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                    <div className="ml-3">
                                                        <span>{language === languages.EN ? `${item.firstName} ${item.lastName}` : `${item.lastName} ${item.firstName}`}</span> <br />
                                                        <span>Điểm số: {item.point} điểm</span>
                                                        <span className="ml-2">thời gian làm bài: {item.time} phút</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>

                    <div className="col-12 mt-2">
                        <label>Chưa hoàn thành ({dataReviewResult.UNFINISHED.length}/{dataReviewResult.total})</label>
                        {
                            processTypeShow === processId.UNFINISHED ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setProcessTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setProcessTypeShow(processId.UNFINISHED)} />
                        }
                        <Progress percent={Math.floor((dataReviewResult.UNFINISHED.length / dataReviewResult.total) * 100)} status="exception" />
                        {
                            processTypeShow === processId.UNFINISHED &&
                            <div className="list-user-progress row">
                                {
                                    dataReviewResult.UNFINISHED.length > 0 &&
                                    dataReviewResult.UNFINISHED.map(item => {
                                        return (
                                            <div className="col-6">
                                                <div className="each-user-progress">
                                                    <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                    <div className="ml-3">
                                                        <span>{language === languages.EN ? `${item.firstName} ${item.lastName}` : `${item.lastName} ${item.firstName}`}</span> <br />
                                                        {/* <span>Điểm số: {item.point} điểm</span>
                                                        <span className="ml-2">thời gian làm bài: {item.time} phút</span> */}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>

                    <div className="col-12 mt-2">
                        <label>Dưới 5 điểm ({dataReviewResult.UNDER_FIVE.length}/{dataReviewResult.total})</label>
                        {
                            processTypeShow === processId.UNDER_FIVE ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setProcessTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setProcessTypeShow(processId.UNDER_FIVE)} />
                        }
                        <Progress percent={Math.floor((dataReviewResult.UNDER_FIVE.length / dataReviewResult.total) * 100)} />
                        {
                            processTypeShow === processId.UNDER_FIVE &&
                            <div className="list-user-progress row">
                                {
                                    dataReviewResult.UNDER_FIVE.length > 0 &&
                                    dataReviewResult.UNDER_FIVE.map(item => {
                                        return (
                                            <div className="col-6">
                                                <div className="each-user-progress">
                                                    <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                    <div className="ml-3">
                                                        <span>{language === languages.EN ? `${item.firstName} ${item.lastName}` : `${item.lastName} ${item.firstName}`}</span> <br />
                                                        <span>Điểm số: {item.point} điểm</span>
                                                        <span className="ml-2">thời gian làm bài: {item.time} phút</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>

                    <div className="col-12 mt-2">
                        <label>5 điểm đến 7 điểm ({dataReviewResult.FIVE_TO_SEVEN.length}/{dataReviewResult.total})</label>
                        {
                            processTypeShow === processId.FIVE_TO_SEVEN ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setProcessTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setProcessTypeShow(processId.FIVE_TO_SEVEN)} />
                        }
                        <Progress percent={Math.floor((dataReviewResult.FIVE_TO_SEVEN.length / dataReviewResult.total) * 100)} />
                        {
                            processTypeShow === processId.FIVE_TO_SEVEN &&
                            <div className="list-user-progress row">
                                {
                                    dataReviewResult.FIVE_TO_SEVEN.length > 0 &&
                                    dataReviewResult.FIVE_TO_SEVEN.map(item => {
                                        return (
                                            <div className="col-6">
                                                <div className="each-user-progress">
                                                    <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                    <div className="ml-3">
                                                        <span>{language === languages.EN ? `${item.firstName} ${item.lastName}` : `${item.lastName} ${item.firstName}`}</span> <br />
                                                        <span>Điểm số: {item.point} điểm</span>
                                                        <span className="ml-2">thời gian làm bài: {item.time} phút</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>

                    <div className="col-12 mt-2">
                        <label>8 đến 10 điểm ({dataReviewResult.EIGHT_TO_TEN.length}/{dataReviewResult.total})</label>
                        {
                            processTypeShow === processId.EIGHT_TO_TEN ?
                                <FaCaretUp className="ml-2 btn-down-up" onClick={() => setProcessTypeShow("")} /> :
                                <FaCaretDown className="ml-2 btn-down-up" onClick={() => setProcessTypeShow(processId.EIGHT_TO_TEN)} />
                        }
                        <Progress percent={Math.floor((dataReviewResult.EIGHT_TO_TEN.length / dataReviewResult.total) * 100)} />
                        {
                            processTypeShow === processId.EIGHT_TO_TEN &&
                            <div className="list-user-progress row">
                                {
                                    dataReviewResult.EIGHT_TO_TEN.length > 0 &&
                                    dataReviewResult.EIGHT_TO_TEN.map(item => {
                                        return (
                                            <div className="col-6">
                                                <div className="each-user-progress">
                                                    <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                    <div className="ml-3">
                                                        <span>{language === languages.EN ? `${item.firstName} ${item.lastName}` : `${item.lastName} ${item.firstName}`}</span> <br />
                                                        <span>Điểm số: {item.point} điểm</span>
                                                        <span className="ml-2">thời gian làm bài: {item.time} phút</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
            </Modal>

            <Modal title={language === languages.EN ? "Confirm" : "Xác nhận"}
                width={400}
                open={isModalConfirmOpen}
                onOk={() => handleOkModalConfirmDelete(false)}
                onCancel={() => setIsModalConfirmOpen(false)}
            >
                <p>Bạn có chắc chắn với hành động này</p>
            </Modal>

            <Modal title={language === languages.EN ? "Information class" : "Thông tin lớp"}
                width={800}
                open={isModalInforClassOpen}
                onOk={() => handleCloseModalInforClass()}
                onCancel={() => handleCloseModalInforClass()}
            >
                <div className="row">
                    <div className="col-3">
                        <p>Số lượng {listStudent.current?.length} học sinh</p>
                    </div>
                    <div className="col-3">
                        <button className="btn btn-primary" onClick={() => setIsModalAddStudentOpen(true)}>Thêm học sinh</button>
                    </div>
                    <div className="col-12 my-2">
                        <label>Tìm kiếm</label>
                        <input type="text" className="form-control" value={textSearchListStudent} onChange={e => handleChangeTextSearchListStudent(e.target.value)} />
                    </div>
                    {
                        listStudentOfClass.length > 0 &&
                        listStudentOfClass.map(item => {
                            return (
                                <div className="col-12" key={item.id}>
                                    <div className="each-infor-student my-1">
                                        <span>{language === languages.EN ? item.studentClassData?.firstName + " " + item.studentClassData?.lastName : item.studentClassData?.lastName + " " + item.studentClassData?.firstName}</span>
                                        <span className="infor-parents">Thông tin phụ huynh:
                                            {
                                                item.parentIdOfStudentData ?
                                                    <span> Tên: {language === languages.EN ? `${item.parentIdOfStudentData?.parentOfStudentData?.firstName} ${item.parentIdOfStudentData?.parentOfStudentData?.lastName}` : `${item.parentIdOfStudentData?.parentOfStudentData?.lastName} ${item.parentIdOfStudentData?.parentOfStudentData?.firstName}`} ({item.parentIdOfStudentData?.parentOfStudentData?.email} - {item.parentIdOfStudentData?.parentOfStudentData?.phoneNumber})</span>
                                                    :
                                                    <span> Chưa có thông tin</span>
                                            }
                                        </span>
                                        <TiDeleteOutline className="btn-close-student" onClick={() => { idStudentSelected.current = item.studentClassData?.id; confirmType.current = confirm_type.DEL_STUDENT; setIsModalConfirmOpen(true) }} />
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
            </Modal>

            <Modal title={language === languages.EN ? "Please join the class" : "Mời tham gia lớp"}
                width={800}
                open={isModalAddStudentOpen}
                onOk={() => setIsModalAddStudentOpen(false)}
                onCancel={() => handleCloseModalRequestJoinClass()}
            >
                <div className="row">
                    <div className="col-6">
                        <label>Nhập tên hoặc email học sinh</label>
                        <input type="text" className="form-control" value={textSearch} onChange={(e) => { handleChangeTextSearchStudent(e.target.value) }} />
                    </div>
                    <div className="col-12">
                        <div className="container">
                            <div className="list-teacher-search row">
                                {
                                    listUserSearched.length > 0 ?
                                        listUserSearched.map(item => {
                                            return (
                                                <div className="col-6">
                                                    <div className="each-teacher-search">
                                                        <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                        <span>{language === languages.EN ? item.firstName + " " + item.lastName : item.lastName + " " + item.firstName}</span>
                                                        <CiSquarePlus className="btn-plus-teacher" onClick={() => { handleReqJoinClass({ studentId: item.id }) }} />
                                                    </div>
                                                </div>
                                            )
                                        }) :
                                        <p>Không tìm thấy</p>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal title={language === languages.EN ? "Update information my class" : "Sửa thông tin lớp"}
                width={800}
                open={isModalUpdateInforClassOpen}
                onOk={() => handleUpdateInforClass()}
                onCancel={() => handleCloseModalUpdateInforClass()}
            >
                <div className="row">
                    <div className="col-12">
                        <label>Tên lớp</label>
                        <input type="text" className="form-control" value={inforClass.name} onChange={e => handleChangeInputUpdate("name", e.target.value)} />
                        <p style={{ color: "red" }}>{errMessUpdate.name}</p>
                    </div>
                    <div className="col-12">
                        <label>Mô tả lớp</label>
                        <textarea className="form-control" value={inforClass.description} onChange={e => handleChangeInputUpdate("description", e.target.value)} ></textarea>
                        <p style={{ color: "red" }}>{errMessUpdate.description}</p>
                    </div>
                    <div className="col-12">
                        <label htmlFor="choise-image-update">Chọn ảnh</label>
                        <input id="choise-image-update" className="form-control" type="file"
                            onChange={e => handleChangeFileImage(e.target.files[0])}
                        />
                    </div>
                </div>
            </Modal>


            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <p className="title">{inforClass.name}</p>
                        <div className="desciption">
                            <p>Trình độ: lớp {inforClass.level} </p>
                            <p>{inforClass.description}</p>
                        </div>
                    </div>
                    <div className="col-6">
                    </div>
                    <div className="col-6" >
                        <div className="icon-setting-container">
                            <CiSettings className="icon-setting" />
                            <div className="menu-container">
                                <span onClick={() => { setIsModalInforClassOpen(true); getListStudentOfClass() }}>Thông tin lớp</span>
                                <span onClick={() => { setIsModalUpdateInforClassOpen(true) }}>Sửa thông tin lớp</span>
                                <span onClick={() => { confirmType.current = confirm_type.DEL_CLASS; setIsModalConfirmOpen(true) }}>Xóa lớp</span>
                            </div>
                        </div>
                    </div>

                    {/* assignment */}
                    <div className="col-12"> <button className="btn btn-primary" onClick={() => { typeFunction.current = type_modalId.CREATE; setIsModalCreateAssignmentOpen(true) }}>Thêm mới bài tập</button></div>
                    <div className="col-12">
                        <div className="asigment-title">
                            <p>Bài tập</p>
                            <p>Số lượng: {listAssignments.length}</p>
                            <p>Sắp xếp</p>
                        </div>
                    </div>

                    {
                        listAssignments.length > 0 &&
                        listAssignments.map(item => {
                            return (
                                <div className="col-6 mt-3" key={item.id}>
                                    <div className="each-assignment">
                                        <div className="icon-container">
                                            <MdAssignment className="icon-assignment" />
                                        </div>
                                        <div className="infor-assignment">
                                            <span>{item.name}</span> <br />
                                            <span>Trang thái: </span><span className={item.statusId === exam_statusId.CLOSE ? "status-assignment closed" : "status-assignment open"}>{item.statusId}</span><br />
                                            <span>Ngày đăng: {item.dateUpload}</span>
                                            <span className="mx-4">Hạn: {item.dateFinish}</span>
                                        </div>
                                        <div className="function-container">
                                            <FaEye className="btn-review" onClick={() => { idExamSelected.current = item.id; handleShowReviewQuestion() }} />
                                            <VscGraph className="btn-graph" onClick={() => { handleShowReviewResultOfExam(item.id) }} />
                                            <MdEdit className="btn-edit" onClick={async () => { confirmType.current = confirm_type.ASSIGNMENT; idExamSelected.current = item.id; typeFunction.current = type_modalId.UPDATE; await getContentExamByExamId(); setIsModalCreateAssignmentOpen(true) }} />
                                            <TbTrashFilled className="btn-delete" onClick={() => { confirmType.current = confirm_type.ASSIGNMENT; idExamSelected.current = item.id; setIsModalConfirmOpen(true) }} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }


                    {/* exam */}
                    <div className="col-12 mt-5"> <button className="btn btn-primary" onClick={() => { typeFunction.current = type_modalId.CREATE; setIsModalCreateExamOpen(true) }}>Thêm mới bài thi</button></div>
                    <div className="col-12 ">
                        <div className="asigment-title">
                            <p>Bài thi</p>
                            <p>Số lượng: {listExams.length}</p>
                            <p>Sắp xếp</p>
                        </div>
                    </div>
                    {
                        listExams.length > 0 &&
                        listExams.map(item => {
                            return (
                                <div className="col-6 mt-3" key={item.id}>
                                    <div className="each-assignment">
                                        <div className="icon-container">
                                            <MdAssignment className="icon-assignment" />
                                        </div>
                                        <div className="infor-assignment">
                                            <span>{item.name}</span> <br />
                                            <span>Trang thái: </span><span className={item.statusId === exam_statusId.CLOSE ? "status-assignment closed" : "status-assignment open"}>{item.statusId}</span><br />
                                            <span>Ngày đăng: {item.dateUpload}</span>
                                            <span className="mx-4">Hạn: {item.dateFinish}</span>
                                        </div>
                                        <div className="function-container">
                                            {
                                                item.statusId === exam_statusId.CLOSE ?
                                                    <button type="button" className="btn btn-primary" onClick={() => handleOpenExam(item.id)}>Bắt đầu</button>
                                                    :
                                                    <button type="button" className="btn btn-warning" onClick={() => navigate(path.ROOT_PATH_NORMAL + path.EXAM + "/" + item.id)}>Vào</button>
                                            }
                                            <FaEye className="btn-review" onClick={() => { idExamSelected.current = item.id; handleShowReviewQuestion() }} />
                                            <VscGraph className="btn-graph" onClick={() => setIsModalReviewResultOpen(true)} />
                                            <MdEdit className="btn-edit" onClick={async () => { confirmType.current = confirm_type.EXAM; idExamSelected.current = item.id; typeFunction.current = type_modalId.UPDATE; await getContentExamByExamId(); setIsModalCreateExamOpen(true) }} />
                                            <TbTrashFilled className="btn-delete" onClick={() => { confirmType.current = confirm_type.EXAM; idExamSelected.current = item.id; setIsModalConfirmOpen(true) }} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }



                    {/* document */}
                    <div className="col-12 mt-5">
                        <input id="choise-image" className="form-control" type="file" hidden multiple
                            onChange={(e) => handleSelectFile(e.target.files)}
                        />
                        <label htmlFor="choise-image" className="btn btn-primary">Thêm tài liệu</label>
                    </div>
                    <div className="col-12 ">
                        <div className="asigment-title">
                            <p>Tài liệu</p>
                            <p>Số lượng: {listDocuments.length}</p>
                            <p>Sắp xếp</p>
                        </div>
                    </div>
                    {
                        listDocuments.length > 0 &&
                        listDocuments.map(item => {
                            return (
                                <div className="col-6 mt-3" key={item.id}>
                                    <div className="each-file-document">
                                        <div className="infor-file-document">
                                            <span>{item.file}</span>
                                        </div>
                                        <span className="date-file-document">-{item.dateUpload}-</span>
                                        <div className="function-file-document">
                                            <a href={environment.REACT_APP_URL_BACK_END + "/Documents/" + item.file} target="_blank"><FaEye /></a>
                                            {/* <FaFileDownload className="btn-dowload-file mx-2" onClick={() => downloadFile(item.file)} /> */}
                                            <TbTrashFilled className="btn-del-file ml-2" onClick={() => { confirmType.current = confirm_type.DOCUMENT; documentSelected.current = item; setIsModalConfirmOpen(true) }} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
            </div >
        </>
    );
}

export default DetailClassOfTeacher;
