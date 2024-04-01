import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { environment, languages } from '../../../utils/constant';
import { toast } from 'react-toastify';
import FormatedText from '../../../components/FormatedText/FormatedText';
import { TiDeleteOutline } from "react-icons/ti";
import Avatar from "../../../components/Avatar";
import { CiSquarePlus } from "react-icons/ci";
import './Modal.scss';
import Loading from "../../../components/Loading"
import userService from '../../../service/userService';
import adminService from '../../../service/addminService';

export default function ModalCreateShelf({ isOpen, toggle, className, setKeyRefToNewShelf }) {
    // const dispatch = useDispatch()
    const language = useSelector(state => state.app.language)
    // const [listAuthors, setListAuthors] = useState({})
    // const [listShelfs, setListShelfs] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [inputForm, setInputForm] = useState({
        name: '',
        description: '',
        image: "",
        level: "",
    })
    const [errMess, setErrMess] = useState({
        name: '',
        description: '',
        image: "",
        level: "",
        teacherSelected: ""
    })

    const [listTeacher, setListTeacher] = useState([])
    const [textSearch, setTextSearch] = useState("")


    const handleOnchange = (type, value) => {
        setInputForm({ ...inputForm, [type]: value })
    }

    const handleClose = () => {
        toggle()
        setInputForm({
            name: '',
            location: '',
            description: '',
            image: "",
            level: "",
        })
        setErrMess({
            name: '',
            location: '',
            description: '',
            image: "",
            level: "",
        })
        setListTeacher([])
        setTextSearch("")
    }

    const handleCreateNewClass = async () => {
        let { name, description, image, level } = inputForm

        if (!name.trim()) {
            setErrMess({
                name: '',
                description: '',
                image: "",
                level: "",
                teacherSelected: "",
                name: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!description.trim()) {
            setErrMess({
                name: '',
                description: '',
                image: "",
                level: "",
                teacherSelected: "",
                description: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!level) {
            setErrMess({
                name: '',
                description: '',
                image: "",
                level: "",
                teacherSelected: "",
                level: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!image) {
            console.log("chay vo")
            setErrMess({
                name: '',
                description: '',
                image: "",
                level: "",
                teacherSelected: "",
                image: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (listTeacher.length === 0) {
            setErrMess({
                name: '',
                description: '',
                image: "",
                level: "",
                teacherSelected: "",
                teacherSelected: language === languages.EN ? 'Choose a teacher for the class' : "Chọn giáo viên cho lớp"
            })
            return
        }
        if (!isNaN(name)) {
            setErrMess({
                name: '',
                description: '',
                image: "",
                level: "",
                teacherSelected: "",
                name: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
            })
            return
        }

        try {
            setIsLoading(true)
            let response = await adminService.createNewClass({
                ...inputForm,
                teacherId: listTeacher[0]?.id
            })
            setIsLoading(false)
            if (response && response.result === true) {
                toast.success(language === languages.EN ? response.messsageEN : response.messsageVI)
                setKeyRefToNewShelf(inputForm.name)
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
                <ModalHeader toggle={handleClose}>Tạo lớp</ModalHeader>
                <ModalBody>

                    <div className="container">
                        <div className="row">
                            <div className="col-12 mb-3"><FormatedText id="manage.addShelf" /></div>
                            <div className="col-6">
                                <label>Tên lớp</label>
                                <input type="text" className="form-control" value={inputForm.name} onChange={e => handleOnchange("name", e.target.value)} />
                                <p style={{ color: "red" }}>{errMess.name}</p>
                            </div>
                            <div className="col-6">
                                <label>Cấp độ</label>
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
                            <div className="col-12">
                                <label>Mô tả</label>
                                <textarea className="form-control" value={inputForm.description} onChange={e => handleOnchange("description", e.target.value)}></textarea>
                                <p style={{ color: "red" }}>{errMess.description}</p>
                            </div>
                            <div className="col-6 mt-2">
                                <label for="fileInput">Chọn ảnh</label>
                                <input type="file" id="fileInput" onChange={e => handleOnchange("image", e.target.files[0])} />
                                <p style={{ color: "red" }}>{errMess.image}</p>
                            </div>
                            <div className="col-12">
                                <label>Giáo viên</label>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" value={textSearch} onChange={e => handleChangeSearchTeacher(e.target.value)}
                                    placeholder={language === languages.EN ? "Enter name or email" : "Nhập tên hoặc email"}
                                />
                                <p style={{ color: "red" }}>{errMess.teacherSelected}</p>
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
                    <Button color="primary" className='btn-create' onClick={() => handleCreateNewClass()}><FormatedText id="modal.create" /></Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
