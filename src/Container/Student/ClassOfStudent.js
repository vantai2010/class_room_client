import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useState, useRef } from "react";
import { environment, languages, notify_typeId, path, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import "./ClassOfStudent.scss"
import Avatar from "../../components/Avatar";
import userService from "../../service/userService";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router";
import { values } from "lodash";

function ClassOfStudent() {
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)
    const socketNotify = useSelector(state => state.auth.socketNotify)
    const [listClass, setListClass] = useState([])
    const [textSearch, setTextSearch] = useState("")
    const [dataSearched, setDataSearched] = useState([])
    const idTimeOut = useRef()
    const getListClass = async () => {
        let response = await userService.getListClass()
        if (response && response.result === true) {
            setListClass(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    const handleChangeTextSearch = (value) => {
        setTextSearch(value)
        if (idTimeOut.current) {
            clearTimeout(idTimeOut.current)
        }
        idTimeOut.current = setTimeout(async () => {
            let response = await userService.searchClassByName({ search: value === "" ? " " : value })
            if (response && response.result === true) {
                setDataSearched(response.data)
            }
        }, 500)
    }

    useEffect(() => {
        getListClass()
    }, [])

    const handleJoinClass = async ({ classData, teacherId }) => {
        let response = await userService.postNewNotify({
            receiverId: teacherId,
            contentEN: `Student ${userInfor.lastName} ${userInfor.firstName} wants to join your ${classData.name} class`,
            contentVI: `Học sinh ${userInfor.lastName} ${userInfor.firstName} muốn tham gia vào lớp ${classData.name} của bạn`,
            typeId: notify_typeId.STUDENT_REQ_JOIN_CLASS,
            params: classData.id
        })
        if (response && response.result === true) {
            toast.success(language === languages.EN ? "Request to join class has been sent" : "Yêu cầu tham gia lớp đã được gửi đi")
            socketNotify?.emit("send-request-join-class-to-teacher", { teacherId })

        } else {
            toast.error(language === languages.EN ? "Submitting your request to join the class failed, please try again" : "Gửi yêu cầu tham gia lớp thất bại, vui lòng thử lại")
        }
    }


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <p className="title">Danh sách lớp</p>
                    </div>
                    <div className="col-4 input-search">
                        <input type="text" className="form-control" placeholder={language === languages.EN ? "Enter the name class" : "Nhập tên lớp"}
                            value={textSearch} onChange={(e) => handleChangeTextSearch(e.target.value)}
                        />
                    </div>
                    {
                        textSearch.length > 0 &&
                        <div className="col-12">
                            <div className="data-search-container">
                                {
                                    dataSearched.length > 0 ?
                                        dataSearched.map(item => {
                                            return (
                                                <div className="col-3" key={item.id}>
                                                    <div className="each-class-student">
                                                        <img src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.teacherOfClassData?.image} />

                                                        <div className="group-infor">
                                                            <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                            <p>Giáo viên: {language === languages.EN ? item.teacherOfClassData?.firstName + " " + item.teacherOfClassData?.lastName : item.teacherOfClassData?.lastName + " " + item.teacherOfClassData?.firstName} </p>
                                                            <p>Tên lớp: {item.name}</p>
                                                            <p>Trình độ: lớp {item.level}</p>
                                                            <button className="btn btn-primary" onClick={() => handleJoinClass({ teacherId: item.teacherOfClassData?.id, classData: item })}>Tham gia</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }) :
                                        <p className="title">Không có lớp nào</p>
                                }
                            </div>
                        </div>
                    }
                    <div className="col-8 mb-5">
                        <span>Xắp sếp</span>
                    </div>

                    {
                        listClass.length > 0 ?
                            listClass.map(item => {
                                return (
                                    <div className="col-3" key={item.id} onClick={() => navigate(path.ROOT_PATH_NORMAL + path.STUDENT.DETAIL_CLASS + "/" + item.id)}>
                                        <div className="each-class-student">
                                            <img src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.teacherOfClassData?.image} />

                                            <div className="group-infor">
                                                <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                <p>Giáo viên: {language === languages.EN ? item.teacherOfClassData?.firstName + " " + item.teacherOfClassData?.lastName : item.teacherOfClassData?.lastName + " " + item.teacherOfClassData?.firstName} </p>
                                                <p>Tên lớp: {item.name}</p>
                                                <p>Trình độ: lớp {item.level}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) :
                            <p className="title">Không có lớp nào</p>
                    }

                </div>
            </div>
        </>
    );
}

export default ClassOfStudent;
