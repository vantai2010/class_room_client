import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { environment, languages } from '../../../utils/constant';
import { toast } from 'react-toastify';
import FormatedText from '../../../components/FormatedText/FormatedText';
import { question_typeId } from '../../../utils/constant';
import { TiDeleteOutline } from "react-icons/ti";
import Avatar from "../../../components/Avatar";
import { CiSquarePlus } from "react-icons/ci";
import './Modal.scss';
import Loading from "../../../components/Loading"
import userService from '../../../service/userService';
import adminService from '../../../service/addminService';
import { set } from 'lodash';

export default function ModalCreateResultHistory({ isOpen, toggle, className, setKeyRefToNewShelf }) {
    // const dispatch = useDispatch()
    const language = useSelector(state => state.app.language)
    // const [listAuthors, setListAuthors] = useState({})
    // const [listShelfs, setListShelfs] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [inputForm, setInputForm] = useState({
        teacherId: "", 
        name: "", 
        description: "", 
        timeLimit: "", 
        classId: "", 
        dateFinish: "", 
        typeId: "", 
        statusId: "", 
        listQuestionId: "", 
    })
    const [errMess, setErrMess] = useState({
        teacherId: "", 
        name: "", 
        description: "", 
        timeLimit: "", 
        classId: "", 
        dateFinish: "", 
        typeId: "", 
        statusId: "", 
        listQuestionId: "", 
    })

    const [listTeacher, setListTeacher] = useState([])
    const [listSearchUser, setListSearchUser] = useState([]);
    const [listSearchClass, setListSearchClass] = useState([]);
    const [textSearch, setTextSearch] = useState("")
    const [nameClass, setNameClass] = useState("")
    const [isModalChoiseQuestionOpen, setIsModalChoiseQuestionOpen] = useState(false);
    
    const handleOnchange = (type, value) => {
        setInputForm({ ...inputForm, [type]: value })
    }

    const handleClose = () => {
        toggle()
        setInputForm({
            teacherId: "", 
            name: "", 
            description: "", 
            timeLimit: "", 
            classId: "", 
            dateFinish: "", 
            typeId: "", 
            statusId: "", 
            listQuestionId: "", 
        })
        setErrMess({
            teacherId: "", 
            name: "", 
            description: "", 
            timeLimit: "", 
            classId: "", 
            dateFinish: "", 
            typeId: "", 
            statusId: "", 
            listQuestionId: "", 
        })
        setListTeacher([])
        setTextSearch("")
    }

    const handleCreateNewClass = async () => {

        let { teacherId, name, description, timeLimit, classId, dateFinish, typeId, statusId, listQuestionId } = inputForm

        if (!name.trim()) {
            setErrMess({
                teacherId: "", 
                name: language === languages.EN ? 'Missing' : 'Còn thiếu', 
                description: "", 
                timeLimit: "", 
                classId: "", 
                dateFinish: "", 
                typeId: "", 
                statusId: "", 
                listQuestionId: "", 
            })
            return
        }
        if(!typeId){
            setErrMess({
                teacherId: "", 
                name: "", 
                description: "", 
                timeLimit: "", 
                classId: "", 
                dateFinish: "", 
                typeId: language === languages.EN ? 'Missing' : 'Còn thiếu', 
                statusId: "", 
                listQuestionId: "", 
            }
            )
            return;
        }
        if (!description.trim()) {
            setErrMess({
                teacherId: "", 
                name: "", 
                description: language === languages.EN ? 'Missing' : 'Còn thiếu', 
                timeLimit: "", 
                classId: "", 
                dateFinish: "", 
                typeId: "", 
                statusId: "", 
                listQuestionId: "", 
            })
            return
        }
        if (!statusId) {
            setErrMess({
                teacherId: "", 
                name: "", 
                description: "", 
                timeLimit: "", 
                classId: "", 
                dateFinish: "", 
                typeId: "", 
                statusId: language === languages.EN ? 'Missing' : 'Còn thiếu', 
                listQuestionId: "", 
            })
            return
        }
        if (!classId) {
            setErrMess({
                teacherId: "", 
                name: "", 
                description: "", 
                timeLimit: "", 
                classId: language === languages.EN ? 'Missing' : 'Còn thiếu',
                dateFinish: "", 
                typeId: "", 
                statusId: "", 
                listQuestionId: "", 
            })
            return
        }
        if (!timeLimit.trim()) {
            setErrMess({
                teacherId: "", 
                name: "", 
                description: "", 
                timeLimit: language === languages.EN ? 'Missing' : 'Còn thiếu', 
                classId: "",
                dateFinish: "", 
                typeId: "", 
                statusId: "", 
                listQuestionId: "", 
            })
            return
        }

        if (!dateFinish) {
            setErrMess({
                teacherId: "", 
                name: "", 
                description: "", 
                timeLimit: "", 
                classId: "",
                dateFinish: language === languages.EN ? 'Missing' : 'Còn thiếu', 
                typeId: "", 
                statusId: "", 
                listQuestionId: "", 
            })
            return
        }

        
        if (listTeacher.length === 0) {
            setErrMess({
                teacherId: language === languages.EN ? 'Missing' : 'Còn thiếu', 
                name: "", 
                description: "", 
                timeLimit: "", 
                classId: "",
                dateFinish: "", 
                typeId: "", 
                statusId: "", 
                listQuestionId: "", 
            })
            return
        }

        try {
            setIsLoading(true)
            let response = await adminService.createOneQuestion()
            setIsLoading(false)
            if (response && response.result === true) {
                toast.success(language === languages.EN ? response.messsageEN : response.messsageVI)
                setKeyRefToNewShelf(inputForm.questionPrompt)
                handleClose()
            } else {
                toast.error(language === languages.EN ? response.messsageEN : response.messsageVI)
            }
        } catch (error) {
            console.log(error)
        }


    }
    const [listClassName, setListClassName] = useState([])
    const idTimeOut = useRef()
    const classTimeOut =useRef()
    const handleChangeSearchTeacher = async (value) => {
        setTextSearch(value)
        if (idTimeOut.current) {
            clearInterval(idTimeOut.current)
        }
        idTimeOut.current = setTimeout(async () => {
            let response = await userService.searchTeacher({ search: value })
            if (response && response.result === true) {
                setListSearchUser(response.data)
            }
        }, 500)
    }
    const removeTeacher = (idSelected) => {
        let arr = [...listTeacher]
        arr = arr.filter(item => item.id !== idSelected)
        setListTeacher(arr)
    }
    const removeClass = (id) => {
        let arr= [...listClassName]
        arr = arr.filter((item) => item.id !== id)
        setListClassName(arr)
    }

    const addTeacher = (data) => {
        let arr = [...listTeacher]
        if (arr.some(item => item.id === data.id) || listTeacher.length === 1) {
            return
        }
        arr.push(data)
        setListTeacher(arr)
    }
    const addClass = (data) => {
        let arr = [...listClassName]
        if (arr.some(item => item.id === data.id) || listClassName.length === 1) {
            return
        }
        arr.push(data)
        setListClassName(arr)
    }
    const handleOkModalSelectQuestion = () => {
        setIsModalChoiseQuestionOpen(false)
    }
    const handleCloseModalSelectQuestion = () => {
        setIsModalChoiseQuestionOpen(false)
    }
    const handleChangeSearchClass = (event) => {
        setNameClass(event)
        if (classTimeOut.current) {
            clearInterval(classTimeOut.current)
        }
        classTimeOut.current = setTimeout(async () => {
            let response = await adminService.getClassByName({search : event})
            if (response && response.result === true) {
                setListSearchClass(response.data)
            }
        }, 500)

    }
    //  chưa lấy được level, tearcheId
    const getAllQuestionsTeacher = async() => {
        try {
           let data = listClassName.map((item) => {
                return {
                    level: item.level,
                    teacherId: item.teacherOfClassData?.id
                }
            })
            let typeId =inputForm && inputForm?.type;
            console.log(">>> check data",data)
            let response = await adminService.getQuestionsTeacher()
        } catch (error) {
            
        }

    }
    console.log(">>> check data",listClassName, inputForm?.type,listClassName?.level, listClassName?.teacherOfClassData?.id)
    useEffect(() => {
        getAllQuestionsTeacher();
    },[listClassName])

    return (
        <>
            {
                isLoading && <Loading />
            }
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
                            <input type="text" className="form-control" />
                            {/* {
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
                            } */}
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isOpen}
                toggle={handleClose}
                className={className}
                size={'lg'}
            >
                <ModalHeader toggle={handleClose}>Thêm mới bài tập</ModalHeader>
                <ModalBody>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <label>Câu hỏi</label>
                                <input type="text" className="form-control" value={inputForm.name} onChange={e => handleOnchange("name", e.target.value)} />
                                <p style={{ color: "red" }}>{errMess.name}</p>
                            </div>
                            <div className="col-6">
                                <label>Thể loại</label>
                                <select className="form-control" value={inputForm.typeId} onChange={e => handleOnchange("typeId", e.target.value)}>
                                    <option></option>
                                    <option value="type_assi">{language === languages.EN ? "ASSIGNMENT" : "Bài kiểm tra"}</option>
                                    <option value="type_exam">{language === languages.EN ? "EXAM" : "Bài thi"}</option>
                                </select>
                                <p style={{ color: "red" }}>{errMess.typeId}</p>
                            </div>
                            <div className="col-6">
                                <label>Mô tả</label>
                                <input type="text" className="form-control" value={inputForm.description} onChange={e => handleOnchange("description", e.target.value)} />
                                <p style={{ color: "red" }}>{errMess.description}</p>
                            </div>
                            <div className="col-6">
                                <label>Trạng thái</label>
                                <select className="form-control" value={inputForm.statusId} onChange={e => handleOnchange("statusId", e.target.value)}>
                                    <option></option>
                                    <option value="status_open">{language === languages.EN ? "OPEN" : "Mở"}</option>
                                    <option value="status_close">{language === languages.EN ? "CLOSE" : "Đóng"}</option>
                                </select>
                                <p style={{ color: "red" }}>{errMess.statusId}</p>
                            </div>
                            <div className="col-6">
                                <label>Trình độ</label>
                                <select className="form-control" value={inputForm.classId} onChange={e => handleOnchange("classId", e.target.value)}>
                                    <option></option>
                                    <option value="1">{language === languages.EN ? "Class 1" : "Lớp 1"}</option>
                                    <option value="2">{language === languages.EN ? "Class 2" : "Lớp 2"}</option>
                                    <option value="3">{language === languages.EN ? "Class 3" : "Lớp 3"}</option>
                                    <option value="4">{language === languages.EN ? "Class 4" : "Lớp 4"}</option>
                                    <option value="5">{language === languages.EN ? "Class 5" : "Lớp 5"}</option>
                                </select>
                                <p style={{ color: "red" }}>{errMess.classId}</p>
                            </div>
                            <div className="col-12">
                                <label>Giáo viên</label>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" value={textSearch} onChange={e => handleChangeSearchTeacher(e.target.value)}
                                    placeholder={language === languages.EN ? "Enter name or email" : "Nhập tên hoặc email"}
                                />
                                <p style={{ color: "red" }}>{errMess.teacherId}</p>
                            </div>
                            <div className="col-6">
                                <div className="tag-name-container">
                                    {
                                        listTeacher.length > 0 &&
                                        listTeacher.map(item => {
                                            return (
                                                <div className="tag-name" key={item.id} >
                                                    <span>{language === languages.EN ? `${item?.firstName} ${item?.lastName}` : `${item?.lastName} ${item?.firstName}`} ({item?.email})</span>
                                                    <TiDeleteOutline className="btn-tag-name-close" onClick={() => removeTeacher(item.id)} />
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
                                                listSearchUser.length > 0 ?
                                                    listSearchUser.map(item => {
                                                        return (
                                                            <div className="col-6" key={item.id}>
                                                                <div className="each-teacher-search">
                                                                    <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                                    <span>{language === languages.EN ? `${item.firstName} ${item.lastName}` : `${item.lastName} ${item.firstName}`} ({item.email})</span>
                                                                    <CiSquarePlus className="btn-plus-teacher" onClick={() => addTeacher(item)} />
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
                                <label>Chọn lớp</label>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" value={nameClass} onChange={e => handleChangeSearchClass(e.target.value)}
                                    placeholder={language === languages.EN ? "Selector class" : "Chọn class"}
                                />
                                <p style={{ color: "red" }}>{errMess.teacherId}</p>
                            </div>
                            <div className="col-6">
                                <div className="tag-name-container">
                                    {
                                        listClassName.length > 0 &&
                                        listClassName.map(item => {
                                            return (
                                                <div className="tag-name" key={item.id} >
                                                    <span>{language === languages.EN ? `${item.name} ${item.level}` : `${item.name} ${item.level}`} ({item?.teacherOfClassData?.email})</span>
                                                    <TiDeleteOutline className="btn-tag-name-close" onClick={() => removeClass(item.id)} />
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                            </div>
                            {
                                nameClass.length > 0 &&
                                <div className="col-12">
                                    <div className="container">
                                        <div className="list-teacher-search row">
                                            {
                                                listSearchClass.length > 0 ?
                                                    listSearchClass.map(item => {
                                                        return (
                                                            <div className="col-6" key={item.id}>
                                                                <div className="each-teacher-search">
                                                                    <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                                    <span>{language === languages.EN ? `${item.name} ${item.level}` : `${item.name} ${item.level}`} ({item?.teacherOfClassData?.email})</span>
                                                                    <CiSquarePlus className="btn-plus-teacher" onClick={() => addClass(item)} />
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
                            <div className="col-6">
                                <label>Chọn câu hỏi</label>
                                <button>Chọn câu hỏi</button>
                            </div>
                            <div className="col-6">
                                <label>Thời gian</label>
                                <input type="text" className="form-control" value={inputForm.timeLimit} onChange={e => handleOnchange("timeLimit", e.target.value)} />
                                <p style={{ color: "red" }}>{errMess.timeLimit}</p>
                            </div>
                            <div className="col-6">
                                <label>Thời gian kết thúc</label>
                                <input type="date" className="form-control" value={inputForm.dateFinish} onChange={e => handleOnchange("dateFinish", e.target.value)} />
                                <p style={{ color: "red" }}>{errMess.dateFinish}</p>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className='btn-close' onClick={handleClose}><FormatedText id="modal.close" /></Button>
                    <Button color="primary" className='btn-create' onClick={() => handleCreateNewClass()}><FormatedText id="modal.create" /></Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
