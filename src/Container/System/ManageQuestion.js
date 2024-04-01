import React, { useEffect, useState, useRef } from 'react'
import FormatedText from '../../components/FormatedText/FormatedText'
import { useSelector } from 'react-redux'
import { languages } from '../../utils/constant'
import { handleGetAllShelfService, handleDeleteShelfService } from '../../service/appService2'
import { TbTrashFilled } from "react-icons/tb";
import { BsPencilSquare } from "react-icons/bs";
import { toast } from 'react-toastify'
import './Manage.scss'
import ModalCreateQuestion from './Modal/ModalCreateQuestion'
import ModalUpdateQuestion from './Modal/ModalUpdateQuestion'
import _ from "lodash"
import { Modal } from 'antd'
import { textEN } from '../../translations/en'
import { textVI } from '../../translations/vi'
import { BiDetail } from "react-icons/bi";
import Select from 'react-select';
import Loading from "../../components/Loading"
import adminService from '../../service/addminService';

export default function ManageQuestion() {
    const question_typeId_map ={
        EASY: {
            valueEN: "Easy", valueVI: "Dễ"
        },
        MEDIUM:{
            valueEN: "Medium", valueVI: "Trung bình"
        },
        HARD: {
            valueEN: "Hard", valueVI: "Khó"
        }
    }
    
    const language = useSelector(state => state.app.language)
    const [listAllQuestion, setListAllQuestion] = useState([])
    const [showDetail, setShowDetail] = useState({})
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

    const getAllQuestions = async () => {
        try {
            setIsLoading(true)
            let response = await adminService.getAllQuestion()
            setIsLoading(false)
            if (response && response.result === true) {
                setListAllQuestion(response.data)
            } else {
                toast.error(language === languages.EN ? response.messsageEN : response.messsageVI)
            }

        } catch (error) {
            
        }
    }

    useEffect(() => {
        getAllQuestions()
    }, [])

    useEffect(() => {
        let options = []
        if (listAllQuestion && listAllQuestion.length > 0) {
            listAllQuestion.map(item => {
                let optionItem = {}
                if (language === languages.EN) {
                    optionItem.value = item.questionPrompt
                    optionItem.label = `Question: ${item.questionPrompt}, level: class ${item.level}`

                }
                if (language === languages.VI) {

                    optionItem.value = item.questionPrompt
                    optionItem.label = `Câu hỏi: ${item.questionPrompt}, Trình độ: lớp ${item.level}`

                }
                options.push(optionItem)
            })
            setOptionSearch(options)
        }
    }, [listAllQuestion, language])

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
        setIsShowModalUpdateShelf(true);
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
            const response = await adminService.deleteQuestionById({ questionId: idDelete.current })
            if (response && response.result === true) {
                toast.success(language === languages.EN ? response.messsageEN : response.messsageVI)
                getAllQuestions()
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

    const setCssQuestionSearched = (object) => {
        if (object) {
            object.classList.add('active')
            object.scrollIntoView({ block: "center" })
            setTimeout(() => {
                object.classList.remove('active')
            }, 3000)
        }
    }

    const handleSearchQuestion = (optionSelect) => {
        let shelf = shelfsRef.current[optionSelect.value]
        setSelectedShelf(optionSelect)
        setCssQuestionSearched(shelf)
    }

    const setKeyRefToNewShelf = async (key) => {
        await getAllQuestions()
        let shelf = shelfsRef.current[key]
        setCssQuestionSearched(shelf)
    }

    const count_question_map = {
        0: "A. ", 1: "B. ", 2: "C. ", 3: "D. "
    }

    return (
        <>
            {
                isLoading && <Loading />
            }
            <div className="manage-container">
                
                <ModalCreateQuestion
                    isOpen={isShowModalUpdateShelf}
                    toggle={toggleModalUpdateShelf}
                    className={'modal-user-container'}
                    setKeyRefToNewShelf={setKeyRefToNewShelf}
                    data={dataUpdate}
                />
                <ModalUpdateQuestion
                    isOpen={isShowModalUpdateShelf}
                    toggle={toggleModalUpdateShelf}
                    className={'modal-user-container'}
                    setKeyRefToNewShelf={setKeyRefToNewShelf}
                    data={dataUpdate}
                 />
                <Modal title={language === languages.EN ? textEN.manage.confirm : textVI.manage.confirm} 
                            open={isOpenModalCheck} 
                            onOk={handleDeleteModalCheck} 
                            onCancel={handleCancelModalCheck}
                >
                    <p><FormatedText id="manage.checkDelete" /></p>
                </Modal>
                <div className="title text-center">Quản lý câu hỏi</div>
                <div className="mt-4 mx-3">
                    <div className="btn-container">
                        <button className="btn-create" 
                            onClick={() => handleCreateNewShelf()}>
                                <FormatedText id="manage.btnCreate" /></button>
                    </div>
                    <div className="col-12 row search-container">
                        <div className="col-12 form-group search-fix-design" ref={searchRef}>
                            <label><FormatedText id="manage.search" /></label>
                            <Select
                                value={selectedShelf}
                                className='col-4'
                                onChange={handleSearchQuestion}
                                options={optionSearch}
                            />
                        </div>
                    </div>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Teacher Id</th>
                                <th>Question Prompt</th>
                                <th>Options</th>
                                <th>Answer</th>
                                <th>Type</th>
                                <th>Level</th>
                                <th>Hành Động</th>
                            </tr>

                            {
                                listAllQuestion && listAllQuestion.length > 0 &&
                                listAllQuestion.map((item, index) => {
                                    return (
                                       <>
                                            <tr key={item.id} ref={el => shelfsRef.current[item.questionPrompt] = el}>
                                            <td>{item?.teacherId}</td>
                                            <td>{item?.questionPrompt}</td>
                                            <td>{
                                                item?.options?.map((element, index) => {
                                                    return <span className="mx-1">{count_question_map[index]}{element} </span>
                                                })
                                            }</td>
                                            <td>{item?.answer}</td>
                                            <td>{language === languages.EN ? question_typeId_map[item?.typeId]?.valueEN : question_typeId_map[item?.typeId]?.valueVI}</td>
                                            <td>{language === languages.EN ? `Class ${item?.level}` : `Lớp ${item?.level}` }</td>
                                            <td>
                                                <button onClick={() => setShowDetail({ ...showDetail, [item?.teacherId + item?.id + index]: !showDetail[item?.teacherId +  item?.id + index]  })}>
                                                    <BiDetail />
                                                </button>
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
                                        {
                                            showDetail[item?.teacherId + item?.id + index]  &&
                                            <tr >
                                                <td className='extra-infor-container' colSpan={7}>
                                                    <div className="extra-infor-body">
                                                        <div className='extra-infor-image' >
                                                            image                                                         {/* {
                                                                user.image ?
                                                                    <img src={environment.REACT_APP_URL_BACK_END + "/Images/" + user.image} /> :
                                                                    (
                                                                        user.genderId === gender.MALE ?
                                                                            <img src={linkAvatarDefault.MALE} /> :
                                                                            user.genderId === gender.FEMALE ?
                                                                                <img src={linkAvatarDefault.FEMALE} /> :
                                                                                <img src={linkAvatarDefault.OTHER} />
                                                                    )
                                                            } */}
                                                        </div>
                                                        <div className='extra-infor row'>
                                                            <div className='col-6 my-3'><FormatedText id='manage.email' />: {item?.teacherOfQuestionData?.email}</div>
                                                            <div className='col-6 my-3'><FormatedText id='manage.firstName' />: {item?.teacherOfQuestionData?.firstName}</div>
                                                            <div className='col-6 my-3'><FormatedText id='manage.phoneNumber' />: {item?.teacherOfQuestionData?.phoneNumber}</div>
                                                            <div className='col-6 my-3'><FormatedText id='manage.lastName' />: {item?.teacherOfQuestionData?.lastName}</div>
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
                                listAllQuestion && listAllQuestion.length === 0 &&
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
