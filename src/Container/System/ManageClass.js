import React, { useEffect, useState, useRef } from 'react'
import FormatedText from '../../components/FormatedText/FormatedText'
import { useSelector } from 'react-redux'
import { languages } from '../../utils/constant'
import { handleGetAllShelfService, handleDeleteShelfService } from '../../service/appService2'
import { TbTrashFilled } from "react-icons/tb";
import { BsPencilSquare } from "react-icons/bs";
import { toast } from 'react-toastify'
import './Manage.scss'
import ModalUpdateClass from './Modal/ModalUpdateClass'
import _ from "lodash"
import ModalCreateClass from './Modal/ModalCreateClass'
import { Modal } from 'antd'
import { textEN } from '../../translations/en'
import { textVI } from '../../translations/vi'
import Select from 'react-select';
import Loading from "../../components/Loading"
import adminService from '../../service/addminService'

export default function ManageClass() {
    const language = useSelector(state => state.app.language)
    const [listClass, setListClass] = useState([])
    const [isShowModalCreateShelf, setIsShowModalCreateShelf] = useState(false)
    const [isShowModalUpdateShelf, setIsShowModalUpdateShelf] = useState(false)
    const [isOpenModalCheck, setIsOpenModalCheck] = useState(false)
    const idDelete = useRef(null)
    const [dataUpdate, setDataUpdate] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const shelfsRef = useRef({})
    const searchRef = useRef(null)
    const [optionSearch, setOptionSearch] = useState([])
    const [selectedShelf, setSelectedShelf] = useState({})

    const getAllListClass = async () => {
        try {
            setIsLoading(true)
            let response = await adminService.getAllClass()
            setIsLoading(false)
            if (response && response.result === true) {
                setListClass(response.data)
            } else {
                toast.error(language === languages.EN ? response.messsageEN : response.messsageVI)
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getAllListClass()
    }, [])

    useEffect(() => {
        let options = []
        if (listClass && listClass.length > 0) {
            listClass.map(item => {
                let optionItem = {}
                if (language === languages.EN) {
                    optionItem.value = item.name
                    optionItem.label = `Name: ${item.name}, level: class ${item.level}`

                }
                if (language === languages.VI) {

                    optionItem.value = item.name
                    optionItem.label = `Tên: ${item.name}, Trình độ: lớp ${item.level}`

                }
                options.push(optionItem)
            })
            setOptionSearch(options)
        }
    }, [listClass, language])

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


    const handleCreateNewShelf = () => {
        setIsShowModalCreateShelf(true)
    }

    const handleUpdateShelf = (data) => {
        setDataUpdate(data)
        setIsShowModalUpdateShelf(true)
    }


    const toggleModalCreateShelf = () => {
        setIsShowModalCreateShelf(!isShowModalCreateShelf)
    }

    const toggleModalUpdateShelf = () => {
        setIsShowModalUpdateShelf(!isShowModalUpdateShelf)
    }

    const handleDeleteModalCheck = async () => {
        try {
            const response = await adminService.deleteOneClass({ classId: idDelete.current })
            if (response && response.result === true) {
                toast.success(language === languages.EN ? response.messsageEN : response.messsageVI)
                getAllListClass()
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

    const setCssShelfSearched = (object) => {
        if (object) {
            object.classList.add('active')
            object.scrollIntoView({ block: "center" })
            setTimeout(() => {
                object.classList.remove('active')
            }, 3000)
        }
    }

    const handleSearchShelf = (optionSelect) => {
        let shelf = shelfsRef.current[optionSelect.value]
        setSelectedShelf(optionSelect)
        setCssShelfSearched(shelf)
    }

    const setKeyRefToNewShelf = async (key) => {
        await getAllListClass()
        let shelf = shelfsRef.current[key]
        setCssShelfSearched(shelf)
    }


    return (
        <>
            {
                isLoading && <Loading />
            }
            <div className="manage-container">
                <ModalCreateClass
                    isOpen={isShowModalCreateShelf}
                    toggle={toggleModalCreateShelf}
                    className={'modal-user-container'}
                    setKeyRefToNewShelf={setKeyRefToNewShelf}
                />
                <ModalUpdateClass
                    isOpen={isShowModalUpdateShelf}
                    toggle={toggleModalUpdateShelf}
                    className={'modal-user-container'}
                    setKeyRefToNewShelf={setKeyRefToNewShelf}
                    data={dataUpdate}
                />
                <Modal title={language === languages.EN ? textEN.manage.confirm : textVI.manage.confirm} open={isOpenModalCheck} onOk={handleDeleteModalCheck} onCancel={handleCancelModalCheck}>
                    <p><FormatedText id="manage.checkDelete" /></p>
                </Modal>
                <div className="title text-center"><FormatedText id="manage.titleShelf" /></div>
                <div className="mt-4 mx-3">
                    <div className="btn-container">
                        <button className="btn-create" onClick={() => handleCreateNewShelf()}><FormatedText id="manage.btnCreate" /></button>
                    </div>
                    <div className="col-12 row search-container">
                        <div className="col-12 form-group search-fix-design" ref={searchRef}>
                            <label><FormatedText id="manage.search" /></label>
                            <Select
                                value={selectedShelf}
                                className='col-4'
                                onChange={handleSearchShelf}
                                options={optionSearch}
                            />
                        </div>
                    </div>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th><FormatedText id="table.name" /></th>
                                <th><FormatedText id="table.description" /></th>
                                <th><FormatedText id="table.dateCreate" /></th>
                                <th><FormatedText id="table.level" /></th>
                                <th><FormatedText id="table.teacher" /></th>
                                <th><FormatedText id="table.action" /></th>
                            </tr>

                            {
                                listClass && listClass.length > 0 &&
                                listClass.map(item => {
                                    return (
                                        <tr key={item.id} ref={el => shelfsRef.current[item.name] = el}>
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td>{item.dateCreate}</td>
                                            <td>{item.level}</td>
                                            <td>{language === languages.EN ? `${item.teacherOfClassData?.firstName} ${item.teacherOfClassData?.lastName}` : `${item.teacherOfClassData?.firstName} ${item.teacherOfClassData?.firstName}`} - {item.teacherOfClassData?.email}</td>
                                            <td>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleUpdateShelf(item)}
                                                >
                                                    <BsPencilSquare />
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => { setIsOpenModalCheck(true); idDelete.current = item.id }}
                                                >
                                                    <TbTrashFilled />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            {
                                listClass && listClass.length === 0 &&
                                <tr colSpan={4}>
                                    <FormatedText id="table.noData" />
                                </tr>
                            }

                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}
