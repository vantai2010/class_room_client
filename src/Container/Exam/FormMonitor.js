import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useRef, useState } from "react";
import { environment, exam_statusId, languages, path, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import "./FormMonitor.scss"
import teacherService from "../../service/teacherService";
import { toast } from "react-toastify";
import { Modal } from 'antd';
import Loading from "../../components/Loading"
import { useNavigate } from "react-router-dom";
import { MdAssignment } from "react-icons/md";
import { CiClock1 } from "react-icons/ci";

function FormMonitor({ myVideoRef, examId }) {
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

    // peerjs ------------------------------------------



    return (
        <>
            {
                isLoading && <Loading />
            }

            {/* <div>
                <h1>Zoom Clone</h1>
                <p>My Peer ID: {peerId}</p>
                <div>
                    <h2>Connected Peers</h2>
                    <ul>
                        {connectedPeers.map((peerId) => (
                            <li key={peerId}>{peerId}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2>Local Video</h2>
                    <video ref={myVideoRef} autoPlay muted playsInline />
                </div>
                <div>
                    <h2>Remote Videos</h2>
                    <div ref={remoteVideosRef}></div>
                </div>
                <div>
                    <h2>Call Peers</h2>
                    <input type="text" placeholder="Enter peer ID" />
                    <button onClick={() => callPeer(peerId)}>Call</button>
                </div>
            </div>


 */}

            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <p className="title">Tên bài thi</p>
                    </div>
                    <div className="col-12 mb-2">
                        <div className="group-function-time">
                            <span><CiClock1 className="icon-clock" /> 100 phút</span>
                            <button className="btn btn-danger mx-3">Kết thúc</button>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="group-video-container">
                            <div className="row">
                                <div className="col-4">
                                    <div className="each-video-student">

                                        <span className="infor-video-student">ten hs</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="group-function-monitor">
                            <div className="group-video-monitor">
                                <div className="each-video-monitor">
                                    <div className="video-of-monitor-container">
                                        <video ref={myVideoRef} autoPlay muted playsInline />
                                    </div>

                                    <span className="infor-video-monitor">ten hs</span>
                                </div>

                                <div className="each-video-monitor">
                                    <span className="infor-video-monitor">ten hs</span>
                                </div>
                            </div>
                            <div className="group-infor-student">
                                <div className="group-btn-nav">
                                    <span className="btn-select-infor selected">Trong phòng</span>
                                    <span className="btn-select-infor">Chưa vào</span>
                                </div>
                                <div className="each-student">
                                    <span>Name</span>
                                    <span>thong tin phụ huynh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FormMonitor;
