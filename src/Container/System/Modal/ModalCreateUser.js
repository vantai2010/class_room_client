import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { languages } from '../../../utils/constant';
import { toast } from 'react-toastify';
import FormatedText from '../../../components/FormatedText/FormatedText';
import CommonUtils from '../../../utils/CommonUtils'
import Select from 'react-select';
import './Modal.scss';
import Loading from "../../../components/Loading"
import adminService from '../../../service/addminService';

export default function ModalCreateUser({ isOpen, toggle, className, setCurrentRole, setKeyRefToNewUser }) {
    const language = useSelector(state => state.app.language)

    const [inputForm, setInputForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
    })
    const [image, setImage] = useState(null)
    const imageFile = useRef()
    const [isLoading, setIsLoading] = useState(false)
    const [obtionGender, setObtionGender] = useState([])
    const [selectedGender, setSelectedGender] = useState({})
    const [obtionRole, setObtionRole] = useState([])
    const [selectedRole, setSelectedRole] = useState({})
    const [errMessage, setErrMessage] = useState({
        email: '',
        password: '',
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


    const handleOnchange = (type, even) => {
        setInputForm({ ...inputForm, [type]: even.target.value })
    }

    const handleClose = () => {
        toggle()
        setInputForm({
            ...inputForm,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            genderId: 'M',
            roleId: 'R1',
        })
        setErrMessage({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            genderId: '',
            roleId: ''
        })
        setImage(null)
        setSelectedGender({})
        setSelectedRole({})
        imageFile.current = null
    }

    const handleOnchangeImage = async (e) => {
        let data = e.target.files
        let file = data[0]
        if (file) {
            imageFile.current = file
            let base64 = await CommonUtils.getBase64(file)
            // let objectUrl = URL.createObjectURL(file)
            setImage(base64)
            // setPreviewImgUrl(objectUrl)
        }

    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleCreateNewUser = async () => {
        let { email, password, firstName, lastName, phoneNumber } = inputForm
        if (!email.trim()) {
            setErrMessage({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                email: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!password.trim()) {
            setErrMessage({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                password: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!firstName.trim()) {
            setErrMessage({
                email: '',
                password: '',
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
        if (!lastName.trim()) {
            setErrMessage({
                email: '',
                password: '',
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
        if (!phoneNumber.trim()) {
            setErrMessage({
                email: '',
                password: '',
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
                email: '',
                password: '',
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
                email: '',
                password: '',
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
        if (!validateEmail(email)) {
            setErrMessage({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                roleId: '',
                email: language === languages.EN ? 'This field must be email' : "Trường này phải là email"
            })
            return
        }
        if (!isNaN(firstName)) {
            setErrMessage({
                email: '',
                password: '',
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
                email: '',
                password: '',
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
                email: '',
                password: '',
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
                email: '',
                password: '',
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
                email: '',
                password: '',
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
            console.log(inputForm,
                selectedGender.value,
                selectedRole.value,
                imageFile.current, "bdas")
            setIsLoading(true)
            let response = await adminService.createNewUserByAdmin({
                ...inputForm,
                genderId: selectedGender.value,
                roleId: selectedRole.value,
                image: imageFile.current
            })
            console.log(response)
            setIsLoading(false)

            if (response && response.result === true) {
                toast(language === languages.EN ? response.messsageEN : response.messsageVI)
                setCurrentRole(selectedRole.value)
                setKeyRefToNewUser(email, selectedRole.value)
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

    return (
        <>
            {
                isLoading && <Loading />
            }
            <Modal
                isOpen={isOpen}
                toggle={handleClose}
                // className={className}
                size={'lg'}
            // zIndex={10}
            >
                <ModalHeader toggle={handleClose}><FormatedText id="modal.titleCreateUser" /></ModalHeader>
                <ModalBody>

                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <label><FormatedText id="manage.email" /></label>
                                <input required value={inputForm.email} onChange={(e) => handleOnchange('email', e)} className="form-control" type="text" />
                                <p style={{ color: 'red' }}>{errMessage.email}</p>
                            </div>
                            <div className="col-6">
                                <label><FormatedText id="manage.password" /></label>
                                <input value={inputForm.password} onChange={(e) => handleOnchange('password', e)} className="form-control" type="text" />
                                <p style={{ color: 'red' }}>{errMessage.password}</p>
                            </div>
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
                            <div className="col-3">
                                <label><FormatedText id="manage.role" /></label>
                                <Select
                                    value={selectedRole}
                                    onChange={handleChangeRole}
                                    options={obtionRole}
                                />
                                <p style={{ color: 'red' }}>{errMessage.roleId}</p>
                            </div>
                            <div className="col-3">
                                <label><FormatedText id="manage.image" /></label>
                                <div className="preview-img-container">
                                    <input id="choise-image" className="form-control" type="file" hidden
                                        onChange={(e) => handleOnchangeImage(e)}
                                    />
                                    <label htmlFor="choise-image" className="btn-choise-image"><FormatedText id="manage.choise" /><i className="fas fa-upload"></i></label>
                                    <div className="preview-image" style={{ backgroundImage: `url(${image})` }}>
                                        {/* <img className="preview-image" src={`${this.state.previewImgUrl}`}/> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className='btn-close' onClick={handleClose}><FormatedText id="modal.close" /></Button>
                    <Button color="primary" className='btn-create' onClick={() => handleCreateNewUser()}><FormatedText id="modal.create" /></Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
