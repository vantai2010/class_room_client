import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useState } from "react";
import { exam_typeId, languages, path, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import "./MissionStudent.scss"
import { MdEdit } from "react-icons/md";
import { TbTrashFilled } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { MdOutlineAssignment } from "react-icons/md";
import { toast } from 'react-toastify';
import { MdAssignment } from "react-icons/md";
import userService from "../../service/userService";
import { useNavigate } from "react-router";

function MissionStudent() {
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)

    const [listAssignment, setListAssignment] = useState([])
    const [listExam, setListExam] = useState([])

    const getMissionOfStudent = async () => {
        let response = await userService.getMissionOfStudent({ studentId: userInfor.id })
        if (response && response.result === true) {
            console.log(response)
            setListAssignment(response.data.filter(item => item.typeId === exam_typeId.ASSIGNMENT))
            setListExam(response.data.filter(item => item.typeId === exam_typeId.EXAM))
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    useEffect(() => {
        getMissionOfStudent()
    }, [])

    return (
        <>
            <div className="container misson-of-student">
                <div className="row">
                    <div className="col-12">
                        <p className="title">Nhiệm vụ</p>
                    </div>
                    <div className="col-12 ">
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
                                <div className="col-6 mt-3" key={item.id} onClick={() => navigate(path.ROOT_PATH_NORMAL + path.STUDENT.DETAIL_ASSIGNMENT + "/" + item.id)}>
                                    <div className="each-assignment-mission">
                                        <div className="icon-container-mission">
                                            <MdOutlineAssignment className="icon-assignment-mission" />
                                        </div>
                                        <div className="infor-assignment-mission">
                                            <span>Tên bài {item.name}</span> <br />
                                            <span>Lớp: {item.classOfExamData?.name}</span><br />
                                            <span>Ngày đăng: {item.dateUpload}</span>
                                            <span className="mx-4">Hạn: {item.dateFinish}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                    <div className="col-12 mt-5">
                        <div className="asigment-title">
                            <p>Bài thi</p>
                            <p>Số lượng: {listExam.length}</p>
                            <p>Sắp xếp</p>
                        </div>
                    </div>
                    {
                        listExam.length > 0 &&
                        listExam.map(item => {
                            return (
                                <div className="col-6 mt-3" key={item.id} onClick={() => navigate(path.ROOT_PATH_NORMAL + path.STUDENT.DETAIL_ASSIGNMENT + "/" + item.id)}>
                                    <div className="each-assignment-mission">
                                        <div className="icon-container-mission">
                                            <MdAssignment className="icon-assignment" />
                                        </div>
                                        <div className="infor-assignment-mission">
                                            <span>Tên bài {item.name}</span> <br />
                                            <span>Lớp: {item.classOfExamData?.name}</span><br />
                                            <span>Ngày đăng: {item.dateUpload}</span>
                                            <span className="mx-4">Hạn: {item.dateFinish}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    );
}

export default MissionStudent;
