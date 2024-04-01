import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useState } from "react";
import { languages, path, processId, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import { MdAssignment } from "react-icons/md";
import "./DetailAssignment.scss";
import { MdEdit } from "react-icons/md";
import { TbTrashFilled } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { TiDeleteOutline } from "react-icons/ti";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { Progress } from 'antd';
import Avatar from "../../components/Avatar";
import { MdOutlineAssignment } from "react-icons/md";
import { CiSquarePlus } from "react-icons/ci";
import userService from "../../service/userService";
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router";

function DetailExam() {
    const navigate = useNavigate()
    const params = useParams()
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)

    const [inforAssignment, setInforAssignment] = useState({
        firstNameTeacher: "",
        lastNameTeacher: "",
        name: "",
        description: "",
        dateUpload: "",
        dateFinish: "",
        dataInvigilator: "",
        isDone: false,
    })
    const [listChoiseExam, setListChoiseExam] = useState([])
    const [isModalReviewResultOpen, setIsModalReviewResultOpen] = useState(false)

    const getInforAssignment = async () => {
        let response = await userService.getInforAssignment({ examId: params.id })
        if (response && response.result === true) {
            setInforAssignment({
                firstNameTeacher: response.data.teacherExamData?.firstName,
                lastNameTeacher: response.data.teacherExamData?.lastName,
                name: response.data.name,
                description: response.data.description,
                dateUpload: response.data.dateUpload,
                dateFinish: response.data.dateFinish,
                dataInvigilator: response.dataInvigilator,
                isDone: response.isDone,
            })
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    useEffect(() => {
        getInforAssignment()
    }, [])

    const handleReviewChoiseExam = async () => {
        let response = await userService.getListChoiseQuestionOfExam({ studentId: userInfor.id, examId: params.id })
        if (response && response.result === true) {
            setListChoiseExam(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const optionsQuestionMap = { 0: "A. ", 1: "B. ", 2: "C. ", 3: "D. " }

    return (
        <>
            <Modal title={language === languages.EN ? "Review" : "Xem lại kết quả"}
                width={800}
                open={isModalReviewResultOpen}
                onOk={() => setIsModalReviewResultOpen(false)}
                onCancel={() => setIsModalReviewResultOpen(false)}
            >
                <div className="row">
                    <div className="col-12">
                        <div className="exam-choise-container">

                            <div className='exam-content'>
                                {
                                    listChoiseExam.map((child, index) => {
                                        return (
                                            <>
                                                {/* className={state[index] === true ? 'exam-child' : 'exam-child fail'} */}
                                                <div className='exam-child' key={child.id}>
                                                    <p>{index}.  {child.questionOfResultExamData?.questionPrompt}</p>
                                                    <div className='exam-choise'>
                                                        {
                                                            child.questionOfResultExamData?.options.map((item, indexQues) => {
                                                                return (
                                                                    <div key={indexQues}>
                                                                        <input type='radio' className={(item === child.questionOfResultExamData?.answer) ? "choise-true" : (item === child.selected && item !== child.questionOfResultExamData?.answer) ? "choise-false" : ""} checked={child.selected === item || item === child.questionOfResultExamData?.answer} />
                                                                        <span
                                                                            className={(item === child.questionOfResultExamData?.answer) ? "span-true" : (item === child.selected && item !== child.questionOfResultExamData?.answer) ? "span-false" : ""}
                                                                        >
                                                                            {optionsQuestionMap[index]} {item}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <div className="container detail-assignment mt-5">
                <div className="row">
                    <div className="col-1">
                        <div className="icon-container">
                            <MdAssignment className="icon-assignment" />
                        </div>
                    </div>
                    <div className="col-11">
                        <div className="infor-assignment">
                            <h3>{inforAssignment.name}</h3>
                            <div className="infor-date">
                                <div className="content-left">
                                    <span>{language === languages.EN ? `${inforAssignment.firstNameTeacher} ${inforAssignment.lastNameTeacher}` : `${inforAssignment.lastNameTeacher} ${inforAssignment.firstNameTeacher}`}</span>
                                    <span className="ml-3">{inforAssignment.dateUpload}</span>
                                </div>
                                <span>Hạn: {inforAssignment.dateFinish}</span>
                            </div>
                            <div className="">
                                <span>Giám thị: {language === languages.EN ? `${inforAssignment.dataInvigilator?.invigilatorOfExamData?.firstName} ${inforAssignment.dataInvigilator?.invigilatorOfExamData?.lastName}` : `${inforAssignment.dataInvigilator?.invigilatorOfExamData?.lastName} ${inforAssignment.dataInvigilator?.invigilatorOfExamData?.firstName}`} ({inforAssignment.dataInvigilator?.invigilatorOfExamData?.email} - {inforAssignment.dataInvigilator?.invigilatorOfExamData?.phoneNumber})</span>
                            </div>
                        </div>
                        <div className="description-assignment">
                            <span>{inforAssignment.description}</span>
                        </div>
                        <div className="function-group mt-3">
                            {
                                inforAssignment.isDone ?
                                    <button className="btn btn-warning" onClick={() => { handleReviewChoiseExam(); setIsModalReviewResultOpen(true) }}>Xem lại</button> :
                                    <button className="btn btn-primary" onClick={() => navigate(path.ROOT_PATH_NORMAL + path.STUDENT.FORM_EXAM + "/" + params.id)}>Làm bài</button>
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default DetailExam;
