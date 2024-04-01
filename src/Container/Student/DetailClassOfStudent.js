import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useState, useRef } from "react";
import { environment, exam_statusId, languages, path, processId, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import { MdAssignment } from "react-icons/md";
import "./DetailClassOfStudent.scss";
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
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from 'react-toastify';
import { CiSettings } from "react-icons/ci";
import teacherService from "../../service/teacherService";

function DetailClassOfStudent() {
    const navigate = useNavigate()
    const params = useParams()
    const language = useSelector(state => state.app.language)

    const [isModalInforClassOpen, setIsModalInforClassOpen] = useState(false)
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false)

    const [listDocuments, setListDocuments] = useState([])
    const [listStudentOfClass, setListStudentOfClass] = useState([])
    const listStudent = useRef()
    const [listAssignment, setListAssignment] = useState([])
    const [listExams, setListExams] = useState([])
    const [textSearchListStudent, setTextSearchListStudent] = useState("")
    const [inforClass, setInforClass] = useState({
        name: "",
        description: "",
        level: ""
    })

    const handleChangeTextSearchListStudent = (value) => {
        setTextSearchListStudent(value)
        if (value === "") {
            setListStudentOfClass(listStudent.current)
        }
        setListStudentOfClass(listStudent.current.filter(student => {
            return student.studentClassData?.firstName.includes(value) || student.studentClassData?.lastName.includes(value)
        }))
    }
    const getAssignmentOfClass = async () => {
        let response = await userService.getAssignmentsByClassId({ classId: params.id })
        if (response && response.result === true) {
            setListAssignment(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const getExamsOfClass = async () => {
        let response = await userService.getExamsByClassId({ classId: params.id })
        if (response && response.result === true) {
            setListExams(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const getInforClass = async () => {
        let response = await userService.getInforClassByClassId({ classId: params.id })
        if (response && response.result === true) {
            setInforClass({
                name: response.data.name,
                description: response.data.description,
                level: response.data.level
            })

        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const getListStudentOfClass = async () => {
        let response = await userService.getListStudentOfClass({ classId: params.id })
        if (response && response.result === true) {
            listStudent.current = response.data
            setListStudentOfClass(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const getListDocumentsOfClass = async () => {
        let response = await userService.getListDocumentsByClass({ classId: params.id })
        if (response && response.result === true) {
            setListDocuments(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const handleOutClass = async () => {
        let response = await userService.outOfClassByStudent({ classId: params.id })
        if (response && response.result === true) {
            toast.success(language === languages.EN ? response.messageEN : response.messageVI)
            return navigate(path.ROOT_PATH_NORMAL + path.STUDENT.MY_CLASS)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    useEffect(() => {
        getAssignmentOfClass()
        getListDocumentsOfClass()
        getInforClass()
        getExamsOfClass()
    }, [])

    return (
        <>
            <Modal title={language === languages.EN ? "Information class" : "Thông tin lớp"}
                width={800}
                open={isModalInforClassOpen}
                onOk={() => setIsModalInforClassOpen(false)}
                onCancel={() => setIsModalInforClassOpen(false)}
            >
                <div className="row">
                    <div className="col-3">
                        <p>Số lượng {listStudent.current?.length} học sinh</p>
                    </div>
                    <div className="col-12 my-2">
                        <label>Tìm kiếm</label>
                        <input type="text" className="form-control" value={textSearchListStudent} onChange={e => handleChangeTextSearchListStudent(e.target.value)} />
                    </div>
                    {
                        listStudentOfClass.length > 0 &&
                        listStudentOfClass.map(item => {
                            return (
                                <div className="col-12 my-1" key={item.id}>
                                    <div className="each-infor-student">
                                        <span>{language === languages.EN ? item.studentClassData?.firstName + " " + item.studentClassData?.lastName : item.studentClassData?.lastName + " " + item.studentClassData?.firstName}</span>
                                        <span>tên phụ huynh</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Modal>

            <Modal title={language === languages.EN ? "Confirm" : "Xác nhận"}
                width={400}
                open={isModalConfirmOpen}
                onOk={() => handleOutClass()}
                onCancel={() => setIsModalConfirmOpen(false)}
            >
                <p>Bạn có chắc chắn với hành động này</p>
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
                    <div className="col-6"></div>
                    <div className="col-6" >
                        <div className="icon-setting-container">
                            <CiSettings className="icon-setting" />
                            <div className="menu-container">
                                <span onClick={async () => { await getListStudentOfClass(); setIsModalInforClassOpen(true) }}>Thông tin lớp</span>
                                <span onClick={() => { setIsModalConfirmOpen(true); }}>Rời lớp</span>
                            </div>
                        </div>
                    </div>

                    {/* assignment */}
                    <div className="col-12 mt-5">
                        <div className="asigment-title">
                            <p>Bài tập</p>
                            <p>Số lượng: {listAssignment.length}</p>
                            <p>Sắp xếp</p>
                        </div>
                    </div>
                    {
                        listAssignment.length > 0 &&
                        listAssignment.map(item => {
                            return (
                                <div className="col-6 mt-3">
                                    <div className={item.statusId === exam_statusId.CLOSE ? "each-assignment status-close" : "each-assignment "} key={item.id}
                                        onClick={() => { if (item.statusId === exam_statusId.OPEN) { navigate(path.ROOT_PATH_NORMAL + path.STUDENT.DETAIL_ASSIGNMENT + "/" + item.id) } }}
                                    >
                                        <div className="icon-container">
                                            <MdAssignment className="icon-assignment" />
                                        </div>
                                        <div className="infor-assignment">
                                            <span>Tên bài: {item.name}</span> <br />
                                            <span>Trang thái: </span><span className={item.statusId === exam_statusId.CLOSE ? "status-assignment closed" : "status-assignment open"}>{item.statusId}</span><br />
                                            <span>Ngày đăng: {item.dateUpload}</span>
                                            <span className="mx-4">{item.dateFinish}</span>
                                            {
                                                item.point !== -1 &&
                                                <div className={item.point < 4 ? "point lower" : item.point > 4 && item.point < 8 ? "point medium" : "point higher"}>
                                                    <span>{item.point} điểm</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }


                    {/* exam */}
                    <div className="col-12 mt-5">
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
                                <div className="col-6 mt-3">
                                    <div className={item.statusId === exam_statusId.CLOSE ? "each-assignment status-close" : "each-assignment "} key={item.id}
                                        onClick={() => { if (item.statusId === exam_statusId.OPEN) { navigate(path.ROOT_PATH_NORMAL + path.STUDENT.DETAIL_EXAM + "/" + item.id) } }}
                                    >
                                        <div className="icon-container">
                                            <MdAssignment className="icon-assignment" />
                                        </div>
                                        <div className="infor-assignment">
                                            <span>Tên bài: {item.name}</span> <br />
                                            <span>Trang thái: </span><span className={item.statusId === exam_statusId.CLOSE ? "status-assignment closed" : "status-assignment open"}>{item.statusId}</span><br />
                                            <span>Ngày đăng: {item.dateUpload}</span>
                                            <span className="mx-4">{item.dateFinish}</span>
                                            {
                                                item.point !== -1 &&
                                                <div className={item.point < 4 ? "point lower" : item.point > 4 && item.point < 8 ? "point medium" : "point higher"}>
                                                    <span>{item.point} điểm</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }


                    {/* document */}
                    <div className="col-12 mt-4">
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

export default DetailClassOfStudent;
