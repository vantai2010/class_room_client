import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { environment, languages } from '../../../utils/constant';
import { toast } from 'react-toastify';
import FormatedText from '../../../components/FormatedText/FormatedText';
import CommonUtils from '../../../utils/CommonUtils'
import { handleUpdateUserService } from '../../../service/appService';
import Select from 'react-select';
import './Modal.scss';
import _ from 'lodash'
import Loading from "../../../components/Loading"
import adminService from '../../../service/addminService';

const gender_typeId = {
    MALE: {
        valueEN: "Male",
        valueVI: "Nam"
    },
    FEMALE: {
        valueEN: "Female",
        valueVI: "Nữ"
    }
}

const role_typeId = {
    ADMIN: {
        valueEN: "Admin",
        valueVI: "Quản trị viên"
    },
    TEACHER: {
        valueEN: "Teacher",
        valueVI: "Giáo viên"
    },
    PARENTS: {
        valueEN: "Parents",
        valueVI: "Phụ huynh"
    },
    STUDENT: {
        valueEN: "Student",
        valueVI: "Học sinh"
    },
}

export default function ModalUpdateUser({ isOpen, toggle, className, user, setKeyRefToNewUser, listGenders, listRoles, setCurrentRole }) {
    const language = useSelector(state => state.app.language)
    let selectedObtionGender = {}, selectedObtionRole = {}
    if (language === languages.EN) {
        selectedObtionGender = {
            value: user.genderId,
            label: gender_typeId[user.genderId]?.valueEN
        }
        selectedObtionRole = {
            value: user.roleId,
            label: role_typeId[user.roleId]?.valueEN
        }
    }
    if (language === languages.VI) {
        selectedObtionGender = {
            value: user.genderId,
            label: gender_typeId[user.genderId]?.valueVI
        }
        selectedObtionRole = {
            value: user.roleId,
            label: role_typeId[user.roleId]?.valueVI
        }
    }

    const [inputForm, setInputForm] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phoneNumber: user.phoneNumber
    })

    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState(user.image)
    const imageFile = useRef()
    const [showPassword, setShowPassword] = useState(false)
    const [obtionGender, setObtionGender] = useState([])
    const [selectedGender, setSelectedGender] = useState(selectedObtionGender)
    const [obtionRole, setObtionRole] = useState([])
    const [selectedRole, setSelectedRole] = useState(selectedObtionRole)

    const [errMessage, setErrMessage] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        genderId: '',
        roleId: ''
    })

    useEffect(() => {
        let gender = []
        if (language === languages.EN) {
            gender = [
                { value: "MALE", label: "Male" },
                { value: "FEMALE", label: "Female" },
            ]
        }
        if (language === languages.VI) {
            gender = [
                { value: "MALE", label: "Nam" },
                { value: "FEMALE", label: "Nữ" },
            ]
        }
        setObtionGender(gender)
    }, [language])

    useEffect(() => {
        let role
        if (language === languages.EN) {
            role = [
                { value: "ADMIN", label: "Admin" },
                { value: "TEACHER", label: "Teacher" },
                { value: "STUDENT", label: "Student" },
                { value: "PARENTS", label: "Parents" },
            ]
        }
        if (language === languages.VI) {
            role = [
                { value: "ADMIN", label: "Quản trị viên" },
                { value: "TEACHER", label: "Giáo viên" },
                { value: "STUDENT", label: "Học sinh" },
                { value: "PARENTS", label: "Phụ huynh" },
            ]
        }
        setObtionRole(role)
    }, [language])


    useEffect(() => {
        setInputForm({
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phoneNumber,
        })
        setImage(user.image)
        setSelectedGender(selectedObtionGender)
        setSelectedRole(selectedObtionRole)
    }, [user])

    const handleOnchange = (type, even) => {
        setInputForm({ ...inputForm, [type]: even.target.value })
    }

    const handleClose = () => {
        setInputForm({
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phoneNumber
        })

        setErrMessage({
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            genderId: '',
            roleId: ''
        })
        setImage(user.image)
        setSelectedGender(selectedObtionGender)
        setSelectedRole(selectedObtionRole)
        toggle()
    }

    const handleOnchangeImage = async (e) => {
        let data = e.target.files
        let file = data[0]
        if (file) {
            imageFile.current = file
            // let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            setImage(objectUrl)
            // setPreviewImgUrl(objectUrl)

        }

    }




    const handleShowHidePassword = () => {
        setShowPassword(!showPassword)
    }



    const handleUpdateUser = async () => {

        let { firstName, lastName, phoneNumber } = inputForm
        if (!firstName) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                firstName: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!lastName) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                lastName: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!phoneNumber) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                phoneNumber: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!selectedGender.value) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                genderId: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!selectedRole.value) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                roleId: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!isNaN(firstName)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                firstName: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
            })
            return
        }
        if (!isNaN(lastName)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                lastName: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
            })
            return
        }
        if (isNaN(phoneNumber)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                phoneNumber: language === languages.EN ? 'This field must be number' : "Trường này phải là số"
            })
            return
        }
        if (/^\d+\.\d+$/.test(phoneNumber)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                phoneNumber: language === languages.EN ? 'This field must be Integer' : "Trường này phải là số nguyên"
            })
            return
        }
        if (phoneNumber.length < 10 || phoneNumber.length > 10) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                phoneNumber: language === languages.EN ? '10 digit phone number' : "Số điện thoại có 10 số"
            })
            return
        }
        try {
            setIsLoading(true)
            let response = await adminService.updateOneUserByAdmin({
                email: user.email,
                userId: user.id,
                ...inputForm,
                genderId: selectedGender.value,
                // roleId: selectedRole.value,
                image: imageFile.current
            })
            console.log(response, "ssssssss")
            setIsLoading(false)
            if (response && response.result === true) {
                toast.success(language === languages.EN ? response.messsageEN : response.messsageVI)
                setCurrentRole(selectedRole.value)
                setKeyRefToNewUser(user.email)
                handleClose()
            } else {
                toast.error(language === languages.EN ? response.messsageEN : response.messsageVI)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeGender = (obtionSelect) => {
        setSelectedGender(obtionSelect)
    }
    const handleChangeRole = (obtionSelect) => {
        setSelectedRole(obtionSelect)
    }

    const isBase64 = (str) => {
        // Biểu thức chính quy để kiểm tra chuỗi Base64
        const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return base64Regex.test(str);
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
                <ModalHeader toggle={handleClose}><FormatedText id="modal.titleUpdateUser" />---{user.email}---</ModalHeader>
                <ModalBody>

                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <label><FormatedText id="manage.firstName" /></label>
                                <input value={inputForm.firstName} onChange={(e) => handleOnchange('firstName', e)} className="form-control" type="text" />
                                <p style={{ color: 'red' }}>{errMessage.firstName}</p>
                            </div>
                            <div className="col-6">
                                <label><FormatedText id="manage.lastName" /></label>
                                <input value={inputForm.lastName} onChange={(e) => handleOnchange('lastName', e)} className="form-control" type="text" />
                                <p style={{ color: 'red' }}>{errMessage.lastName}</p>
                            </div>
                            <div className="col-3">
                                <label><FormatedText id="manage.phoneNumber" /></label>
                                <input value={inputForm.phoneNumber} onChange={(e) => handleOnchange('phoneNumber', e)} className="form-control" type="text" />
                                <p style={{ color: 'red' }}>{errMessage.phoneNumber}</p>
                            </div>
                            <div className="col-3">
                                <label><FormatedText id="manage.gender" /></label>
                                <Select
                                    value={selectedGender}
                                    onChange={handleChangeGender}
                                    options={obtionGender}
                                />
                                <p style={{ color: 'red' }}>{errMessage.genderId}</p>
                            </div>
                            {/* <div className="col-3">
                                <label><FormatedText id="manage.role" /></label>
                                <Select
                                    value={selectedRole}
                                    onChange={handleChangeRole}
                                    options={obtionRole}
                                />
                                <p style={{ color: 'red' }}>{errMessage.roleId}</p>
                            </div> */}
                            <div className="col-3">
                                <label><FormatedText id="manage.image" /></label>
                                <div className="preview-img-container">
                                    <input id="choise-image" className="form-control" type="file" hidden
                                        onChange={(e) => handleOnchangeImage(e)}
                                    />
                                    <label htmlFor="choise-image" className="btn-choise-image"><FormatedText id="manage.choise" /><i className="fas fa-upload"></i></label>
                                    <div className="preview-image" style={{ backgroundImage: `url(${imageFile.current !== null ? image : `${process.env.REACT_APP_URL_BACK_END}/Images/${image}`})` }}>
                                        {/* <img className="preview-image" src={`${this.state.previewImgUrl}`}/> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className='btn-close' onClick={handleClose}><FormatedText id="modal.close" /></Button>
                    <Button color="primary" className='btn-create' onClick={() => handleUpdateUser()}><FormatedText id="modal.update" /></Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
