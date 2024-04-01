import React, { useEffect, useRef, useState } from 'react'
import './Manage.scss'
import FormatedText from '../../components/FormatedText/FormatedText'
import ModalCreateUser from './Modal/ModalCreateUser'
import ModalUpdateUser from './Modal/ModalUpdateUser'
import { environment, gender, languages, linkAvatarDefault, roleId } from '../../utils/constant'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleDeleteUserService, handleGetAllUserService } from '../../service/appService2'
import _ from 'lodash'
import { TbTrashFilled } from "react-icons/tb";
import { BsPencilSquare } from "react-icons/bs";
import { BiDetail } from "react-icons/bi";
import { Modal } from 'antd';
import { textEN } from '../../translations/en'
import { textVI } from '../../translations/vi'
import Select from 'react-select';
import Loading from "../../components/Loading"
import adminService from '../../service/addminService'


export default function ManageUser() {
    const dispatch = useDispatch()
    const language = useSelector(state => state.app.language)
    const [isOpenModalCreateUser, setIsOpenModalCreateUser] = useState(false)
    const [isOpenModalUpdateUser, setIsOpenModalUpdateUser] = useState(false)
    const [isOpenModalCheck, setIsOpenModalCheck] = useState(false)
    const idDelete = useRef(null)
    const [showDetail, setShowDetail] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const usersRef = useRef({})
    const searchRef = useRef(null)
    const [optionSearch, setOptionSearch] = useState({})
    const [selectedUser, setSelectedUser] = useState({})

    const [dataUpdate, setDataUpdate] = useState({})
    const [arrUsers, setArrUsers] = useState({})
    const [currentRole, setCurrentRole] = useState(roleId.ADMIN)

    useEffect(() => {
        let options = {}
        if (!_.isEmpty(arrUsers)) {
            options[currentRole] = arrUsers[currentRole]?.map(item => {
                if (language === languages.EN) {
                    return {
                        value: item.email,
                        label: `${item.email}, Name: ${item.firstName} ${item.lastName}, PhoneNumber: ${item.phoneNumber}`
                    }
                }
                if (language === languages.VI) {
                    return {
                        value: item.email,
                        label: `${item.email}, Tên: ${item.lastName} ${item.firstName}, Số điện thoại: ${item.phoneNumber}`
                    }
                }
            })
        }
        setOptionSearch(options)

    }, [language, currentRole, arrUsers])

    const getAllUsersToState = async () => {

        try {
            setIsLoading(true)
            let response = await adminService.getAllUsers()
            setIsLoading(false)
            if (response && response.result === true) {
                let coppyArrUser = { ...arrUsers }
                coppyArrUser[roleId.ADMIN] = response.data.filter(user => user.roleId === roleId.ADMIN)
                coppyArrUser[roleId.TEACHER] = response.data.filter(user => user.roleId === roleId.TEACHER)
                coppyArrUser[roleId.STUDENT] = response.data.filter(user => user.roleId === roleId.STUDENT)
                coppyArrUser[roleId.PARENTS] = response.data.filter(user => user.roleId === roleId.PARENTS)
                setArrUsers({ ...coppyArrUser })
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getAllUsersToState()
    }, [])

    useEffect(() => {
        const handleEvent = () => {
            if (window.scrollY > 129) {
                searchRef.current.classList.add('search-fix')
            }
            else {
                searchRef.current.classList.remove('search-fix')
            }
        }
        window.addEventListener('scroll', handleEvent);
        return () => window.removeEventListener('scroll', handleEvent)
    }, [])

    useEffect(() => {
        let options = {}
        if (!_.isEmpty(arrUsers)) {
            for (let i = 0; i < Object.keys(roleId).length; i++) {
                let keyUserRole = Object.keys(roleId)[i]
                arrUsers[roleId[keyUserRole]]?.map(item => {
                    options[item.id] = false
                })
            }
        }
        setShowDetail(options)
    }, [arrUsers])


    const toggleModalCreateUser = () => {
        setIsOpenModalCreateUser(!isOpenModalCreateUser)
    }
    const toggleModalUpdateUser = () => {
        setIsOpenModalUpdateUser(!isOpenModalUpdateUser)
    }

    const handleCreateNewUser = () => {
        setIsOpenModalCreateUser(true)
    }


    const handleUpdateUser = (user) => {
        setDataUpdate(user)
        setIsOpenModalUpdateUser(true)
    }

    const handleDeleteModalCheck = async () => {
        try {
            const response = await adminService.deleteUserById({ userId: idDelete.current })
            if (response && response.result === true) {
                toast.success(language === languages.EN ? response.messsageEN : response.messsageVI)
                getAllUsersToState()
                idDelete.current = null
                setIsOpenModalCheck(false)
            } else {
                toast.error(language === languages.EN ? response.messsageEN : response.messsageVI)
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const handleCancelModalCheck = () => {
        setIsOpenModalCheck(false)
    }

    const setCssUserSearched = (opject) => {
        if (opject) {
            opject.classList.add('active')
            // console.log('top', opject.offsetTop)
            opject.scrollIntoView({ block: "center" })
            // console.log(window, window.scrollY)
            setTimeout(() => {
                opject.classList.remove('active')
            }, 3000)
        }
    }

    const setKeyRefToNewUser = async (key) => {
        await getAllUsersToState()
        let user = usersRef.current[key]
        setCssUserSearched(user)
    }


    const handleSearchUser = (optionSelect) => {
        let user = usersRef.current[optionSelect.value]
        setSelectedUser(optionSelect)
        setCssUserSearched(user)
    }

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


    return (
        <>
            {
                isLoading && <Loading />
            }
            <div className="manage-container manage-user" >
                <ModalCreateUser
                    isOpen={isOpenModalCreateUser}
                    toggle={toggleModalCreateUser}
                    className={'modal-user-container'}
                    setCurrentRole={setCurrentRole}
                    setKeyRefToNewUser={setKeyRefToNewUser}
                />
                <ModalUpdateUser
                    isOpen={isOpenModalUpdateUser}
                    toggle={toggleModalUpdateUser}
                    className={'modal-user-container'}
                    user={dataUpdate}
                    setKeyRefToNewUser={setKeyRefToNewUser}
                    setCurrentRole={setCurrentRole}
                />
                <Modal title={language === languages.EN ? textEN.manage.confirm : textVI.manage.confirm} open={isOpenModalCheck} onOk={handleDeleteModalCheck} onCancel={handleCancelModalCheck}>
                    <p><FormatedText id="manage.checkDelete" /></p>
                </Modal>

                <div className="title text-center"><FormatedText id="manage.titleUser" /></div>
                <div className="mt-4 mx-3">
                    <div className="btn-container">
                        <button className="btn-create" onClick={() => handleCreateNewUser()}><FormatedText id="manage.btnCreate" /></button>

                        <div className="nav-btn">
                            <button
                                className={currentRole === roleId.ADMIN ? 'select' : ''}
                                onClick={() => setCurrentRole(roleId.ADMIN)}
                            >
                                Admin ({arrUsers[roleId.ADMIN]?.length})
                            </button>
                            <button
                                className={currentRole === roleId.TEACHER ? 'select' : ''}
                                onClick={() => setCurrentRole(roleId.TEACHER)}
                            >
                                Giáo viên ({arrUsers[roleId.TEACHER]?.length})
                            </button>
                            <button
                                className={currentRole === roleId.STUDENT ? 'select' : ''}
                                onClick={() => setCurrentRole(roleId.STUDENT)}
                            >
                                Học sinh ({arrUsers[roleId.STUDENT]?.length})
                            </button>
                            <button
                                className={currentRole === roleId.PARENTS ? 'select' : ''}
                                onClick={() => setCurrentRole(roleId.PARENTS)}
                            >
                                Phụ Huynh ({arrUsers[roleId.PARENTS]?.length})
                            </button>
                        </div>

                    </div>
                    <div className="col-12 row search-container">
                        <div className="col-12 form-group search-fix-design" ref={searchRef}>
                            <label><FormatedText id="manage.search" /></label>
                            <Select
                                value={selectedUser}
                                className='col-4'
                                onChange={handleSearchUser}
                                options={optionSearch[currentRole] ? optionSearch[currentRole] : []}
                            />
                        </div>
                        {/* <div className="col-">

                        </div> */}
                    </div>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th><FormatedText id="table.email" /></th>
                                <th><FormatedText id="table.firstName" /></th>
                                <th><FormatedText id="table.lastName" /></th>
                                <th><FormatedText id="table.phoneNumber" /></th>
                                <th><FormatedText id="table.gender" /></th>
                                <th><FormatedText id="table.action" /></th>

                            </tr>

                            {
                                arrUsers && arrUsers[currentRole] && arrUsers[currentRole].length > 0 &&
                                arrUsers[currentRole].map((user, index) => {
                                    return (
                                        <>
                                            <tr key={user.id} ref={el => usersRef.current[user.email] = el}>
                                                <td>{user.email}</td>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td>
                                                    {language === languages.EN ? gender_typeId[user.genderId].valueEN : gender_typeId[user.genderId].valueVI}
                                                </td>
                                                <button onClick={() => setShowDetail({ ...showDetail, [user.id]: !showDetail[user.id] })}>
                                                    <BiDetail />
                                                </button>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleUpdateUser(user)}
                                                >
                                                    <BsPencilSquare />
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => { setIsOpenModalCheck(true); idDelete.current = user.id }}
                                                >
                                                    <TbTrashFilled />
                                                </button>
                                            </tr>
                                            {
                                                showDetail[user.id] &&
                                                <tr >
                                                    <td className='extra-infor-container' colSpan={7}>
                                                        <div className="extra-infor-body">
                                                            <div className='extra-infor-image' >
                                                                {
                                                                    user.image ?
                                                                        <img src={environment.REACT_APP_URL_BACK_END + "/Images/" + user.image} /> :
                                                                        (
                                                                            user.genderId === gender.MALE ?
                                                                                <img src={linkAvatarDefault.MALE} /> :
                                                                                user.genderId === gender.FEMALE ?
                                                                                    <img src={linkAvatarDefault.FEMALE} /> :
                                                                                    <img src={linkAvatarDefault.OTHER} />
                                                                        )
                                                                }
                                                            </div>
                                                            <div className='extra-infor row'>
                                                                <div className='col-6 my-3'><FormatedText id='manage.email' />: {user.email}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.role' />: {language === languages.EN ? role_typeId[user?.roleId].valueEN : role_typeId[user?.roleId].valueVI}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.firstName' />: {user.firstName}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.phoneNumber' />: {user.phoneNumber}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.lastName' />: {user.lastName}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.gender' />: {language === languages.EN ? user.genderUserData?.valueVi : user.genderUserData?.valueEn}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            }
                                        </>
                                    )
                                })
                            }
                            {
                                arrUsers && arrUsers[currentRole] && arrUsers[currentRole].length === 0 &&
                                <tr colSpan={7}>
                                    <FormatedText id="table.noData" />
                                </tr>
                            }

                        </tbody>
                    </table>
                </div >
            </div >
        </>
    )
}
