import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useState } from "react";
import { environment, exam_statusId, languages, path, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import "./ClassOfTeacher.scss"
import teacherService from "../../service/teacherService";
import { toast } from "react-toastify";
import { Modal } from 'antd';
import Loading from "../../components/Loading"
import { useNavigate, useParams } from "react-router-dom";
import { MdAssignment } from "react-icons/md";
import apiRTC from "../../utils/apiWebRTC";

function MonitorTheExam() {
    const params = useParams()
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const [isLoading, setIsLoading] = useState(false)

    const [listExams, setListExams] = useState([])
    let getListExamsOfInvigilatorByTeacherId = async () => {
        let response = await teacherService.getListExamsOfInvigilatorByTeacherId()
        if (response && response.result === true) {
            setListExams(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }


    useEffect(() => {
        getListExamsOfInvigilatorByTeacherId()
    }, [])

    const handleOpenExam = async (examId) => {
        let response = await teacherService.openExamByTeacher({ examId })
        if (response && response.result === true) {
            navigate(path.ROOT_PATH_NORMAL + path.EXAM + "/" + examId)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }

        // await apiRTC.setRestToken()
        // const room = await apiRTC.createRoom();
        // const { roomId } = room;
        // const roomToken = await apiRTC.getRoomToken(roomId);

        // console.log(roomToken, roomId);
    }

    return (
        <>
            {
                isLoading && <Loading />
            }

            <div className="container" style={{ minHeight: "500px" }}>
                <div className="row">
                    <div className="col-12 mt-4">
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
                                <div className="col-6 mt-3" key={item.id}>
                                    <div className="each-assignment">
                                        <div className="icon-container">
                                            <MdAssignment className="icon-assignment" />
                                        </div>
                                        <div className="infor-assignment">
                                            <span>{item.examOfInvigilatorData?.name}</span> <br />
                                            <span>Trang thái: </span><span className={item.examOfInvigilatorData?.statusId === exam_statusId.CLOSE ? "status-assignment closed" : "status-assignment open"}>{item.examOfInvigilatorData?.statusId}</span><br />
                                            <span>Ngày đăng: {item.examOfInvigilatorData?.dateUpload}</span>
                                            <span className="mx-4">Hạn: {item.examOfInvigilatorData?.dateFinish}</span>
                                        </div>
                                        <div className="function-container">
                                            {
                                                item.examOfInvigilatorData?.statusId === exam_statusId.CLOSE ?
                                                    <button type="button" className="btn btn-primary" onClick={() => handleOpenExam(item.examOfInvigilatorData?.id)}>Bắt đầu</button>
                                                    :
                                                    <button type="button" className="btn btn-warning" onClick={() => navigate(path.ROOT_PATH_NORMAL + path.EXAM + "/" + item.examOfInvigilatorData?.id)}>Vào</button>
                                            }
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

export default MonitorTheExam;
