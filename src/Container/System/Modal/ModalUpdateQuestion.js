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

export default function ModalUpdateQuestion({ isOpen, toggle, className, setKeyRefToNewShelf, data }) {
    const language = useSelector(state => state.app.language)
    const [isLoading, setIsLoading] = useState(false)
    const [inputForm, setInputForm] = useState({
        questionPrompt: data?.questionPrompt,
        optionsA: data && data.option && data?.options[0],
        optionsB: data && data.option && data?.options[1],
        optionsC: data && data.option && data?.options[2],
        optionsD: data && data.option && data?.options[3],
        answer:data?.answer,
        typeId:data?.typeId,
        level: data?.level,
        teacherId: data?.teacherId,
    })
    const [errMess, setErrMess] = useState({
        questionPrompt: '',
        optionsA: "",
        optionsB: "",
        optionsC: "",
        optionsD: "",
        answer:"",
        typeId:"",
        level: "",
        teacherId:""
    })

    const [listTeacher, setListTeacher] = useState([{
        id: data?.teacherOfQuestionData?.id ,
        email: data?.teacherOfQuestionData?.email,
        firstName:  data?.teacherOfQuestionData?.firstName,
        lastName: data?.teacherOfQuestionData?.lastName,
        image: data?.teacherOfQuestionData?.image,

    }])
    const [textSearch, setTextSearch] = useState("")


    const handleOnchange = (type, value) => {
        setInputForm({ ...inputForm, [type]: value })
    }

    const handleClose = () => {
        toggle()
        setInputForm({
            questionPrompt: data?.questionPrompt,
            optionsA: data?.options[0],
            optionsB:  data?.options[1],
            optionsC:  data?.options[2],
            optionsD:  data?.options[3],
            answer:data?.answer,
            typeId:data?.typeId,
            level: data?.level,
            teacherId: data?.teacherId,
        })
        setErrMess({
            questionPrompt: '',
            options: "",
            answer:"",
            typeId:"",
            level: "",
            teacherId:""
        })
        setListTeacher([])
        setTextSearch("")
    }

    const handleUpdateOneQuestion = async () => {
        let {teacherId,questionPrompt, optionsA,optionsB,optionsC,optionsD, answer, typeId, level} = inputForm

        if (!questionPrompt.trim()) {
            setErrMess({
                optionsA: "",
                optionsB: "",
                optionsC: "",
                optionsD: "",
                answer:"",
                typeId:"",
                level: "",
                teacherId:"",
                questionPrompt: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if(!answer.trim()){
            setErrMess({
                questionPrompt: '',
                optionsA: "",
                optionsB: "",
                optionsC: "",
                optionsD: "",
                typeId:"",
                level: "",
                teacherId:"",
                answer: language === languages.EN ? 'Missing' : 'Còn thiếu'
            }
            )
            return;
        }
        if (!optionsA.trim()) {
            setErrMess({
                questionPrompt: '',
                answer:"",
                typeId:"",
                level: "",
                teacherId:"",
                optionsA: language === languages.EN ? 'Missing' : 'Còn thiếu',
                optionsB: "",
                optionsC: "",
                optionsD: "",
            })
            return
        }
        if (!optionsB.trim()) {
            setErrMess({
                questionPrompt: '',
                answer:"",
                typeId:"",
                level: "",
                teacherId:"",
                optionsB: language === languages.EN ? 'Missing' : 'Còn thiếu',
                optionsA: "",
                optionsC: "",
                optionsD: "",
            })
            return
        }
        if (!optionsC.trim()) {
            setErrMess({
                questionPrompt: '',
                answer:"",
                typeId:"",
                level: "",
                teacherId:"",
                optionsC: language === languages.EN ? 'Missing' : 'Còn thiếu',
                optionsB: "",
                optionsA: "",
                optionsD: "",
            })
            return
        }
        if (!optionsD.trim()) {
            setErrMess({
                questionPrompt: '',
                answer:"",
                typeId:"",
                level: "",
                teacherId:"",
                optionsD: language === languages.EN ? 'Missing' : 'Còn thiếu',
                optionsB: "",
                optionsC: "",
                optionsA: "",
            })
            return
        }

        if (!level) {
            setErrMess({
                questionPrompt: '',
                options: "",
                answer:"",
                typeId:"",
                level: "",
                teacherId:"",
                level: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!typeId) {
            setErrMess({
                questionPrompt: '',
                options: "",
                answer:"",
                typeId: language === languages.EN ? 'Missing' : 'Còn thiếu',
                level: "",
                teacherId:"",
                level:"",
            })
            return
        }
        
        if (listTeacher.length === 0) {
            setErrMess({
                questionPrompt: '',
                options: "",
                answer:"",
                typeId:"",
                level: "",
                teacherId:language === languages.EN ? 'Please select a teacher' : "Vui lòng chọn giáo viên",
            })
            return
        }

        try {
            setIsLoading(true)
            let response = await adminService.updateOneQuestion({
                questionId: data?.id,
                teacherId: listTeacher[0]?.id,
                questionPrompt: questionPrompt,
                options: [optionsA, optionsB, optionsC, optionsD],
                answer:answer,
                typeId: typeId,
                level: level,
            })
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
    
    const [listUserSearched, setListUserSearched] = useState([])
    const idTimeOut = useRef()
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
    const removeTeacher = (idSelected) => {
        let arr = [...listTeacher]
        arr = arr.filter(item => item.id !== idSelected)
        setListTeacher(arr)
    }

    const addTeacher = (data) => {
        let arr = [...listTeacher]
        if (arr.some(item => item.id === data.id) || listTeacher.length === 1) {
            return
        }
        arr.push(data)
        setListTeacher(arr)
    }
useEffect(() => {
    setInputForm({
        questionPrompt: data?.questionPrompt,
        optionsA: data?.options?.[0],
        optionsB: data?.options?.[1],
        optionsC: data?.options?.[2],
        optionsD: data?.options?.[3],
        answer:data?.answer,
        typeId:data?.typeId,
        level: data?.level,
        teacherId: data?.teacherId,
    })
    setListTeacher([{
        id: data?.teacherOfQuestionData?.id ,
        email: data?.teacherOfQuestionData?.email,
        firstName:  data?.teacherOfQuestionData?.firstName,
        lastName: data?.teacherOfQuestionData?.lastName,
        image: data?.teacherOfQuestionData?.image,

    }])
}, [data])
    return (
        <>
            {
                isLoading && <Loading />
            }
            <Modal
                isOpen={isOpen}
                toggle={handleClose}
                className={className}
                size={'lg'}
            >
                <ModalHeader toggle={handleClose}>Sửa câu hỏi</ModalHeader>
                <ModalBody>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <label>Câu hỏi</label>
                                <input type="text" className="form-control" value={inputForm.questionPrompt} onChange={e => handleOnchange("questionPrompt", e.target.value)} />
                                <p style={{ color: "red" }}>{errMess.questionPrompt}</p>
                            </div>
                            <div className="col-12">
                                <label className="">Câu trả lời: </label>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" value={inputForm?.optionsA} onChange={e => handleOnchange("optionsA", e.target.value)} />
                                <p style={{ color: "red" }}>{errMess.optionsA}</p>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" value={inputForm?.optionsB} onChange={e => handleOnchange("optionsB", e.target.value)} />
                                <p style={{ color: "red" }}>{errMess.optionsB}</p>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" value={inputForm?.optionsC} onChange={e => handleOnchange("optionsC", e.target.value)} />
                                <p style={{ color: "red" }}>{errMess.optionsC}</p>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" value={inputForm?.optionsD} onChange={e => handleOnchange("optionsD", e.target.value)} />
                                <p style={{ color: "red" }}>{errMess.optionsD}</p>
                            </div>
                            <div className="col-6">
                                <label>Trình độ</label>
                                <select className="form-control" value={inputForm.level} onChange={e => handleOnchange("level", e.target.value)}>
                                    <option></option>
                                    <option value="1">{language === languages.EN ? "Class 1" : "Lớp 1"}</option>
                                    <option value="2">{language === languages.EN ? "Class 2" : "Lớp 2"}</option>
                                    <option value="3">{language === languages.EN ? "Class 3" : "Lớp 3"}</option>
                                    <option value="4">{language === languages.EN ? "Class 4" : "Lớp 4"}</option>
                                    <option value="5">{language === languages.EN ? "Class 5" : "Lớp 5"}</option>
                                </select>
                                <p style={{ color: "red" }}>{errMess.level}</p>
                            </div>
                            <div className="col-6">
                                <label>Đáp án: </label>
                                <input type="text" className="form-control" onChange={e => handleOnchange("answer", e.target.value)} value={inputForm.answer}  />
                                <p style={{ color: "red" }}>{errMess.answer}</p>
                            </div>
                            <div className="col-12">
                                <label>Độ khó: </label>
                                <select className="form-control " value={inputForm.typeId} onChange={e => handleOnchange("typeId", e.target.value)}>
                                    <option></option>
                                    <option value={question_typeId.EASY}>{language === languages.EN ? "Easy" : "Dễ"}</option>
                                    <option value={question_typeId.MEDIUM}>{language === languages.EN ? "Medium" : "Trung bình"}</option>
                                    <option value={question_typeId.HARD}>{language === languages.EN ? "Hard" : "Khó"}</option>
                                </select>
                                <p style={{ color: "red" }}>{errMess.typeId}</p>
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
                                                listUserSearched.length > 0 ?
                                                    listUserSearched.map(item => {
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

                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className='btn-close' onClick={handleClose}><FormatedText id="modal.close" /></Button>
                    <Button color="primary" className='btn-create' onClick={() => handleUpdateOneQuestion()}><FormatedText id="modal.create" /></Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
