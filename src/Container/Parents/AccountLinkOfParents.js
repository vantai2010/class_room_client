import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useRef, useState } from "react";
import { environment, languages, notify_typeId, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import "./AccountLinkOfParents.scss"
import Avatar from "../../components/Avatar";
import { CiSquarePlus } from "react-icons/ci";
import { toast } from 'react-toastify';
import { Modal } from 'antd';
import { TiDeleteOutline } from "react-icons/ti";
import userService from "../../service/userService";

function AccountLinkOfParents() {
    const language = useSelector(state => state.app.language)
    const socketNotify = useSelector(state => state.auth.socketNotify)
    const userInfor = useSelector(state => state.auth.userInfor)
    const [isModalCreateAccLinkOpen, setIsModalCreateAccLinkOpen] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

    const [textSearch, setTextSearch] = useState("")
    const [listUserSearched, setListUserSearched] = useState([])
    const [dataUser, setDataUser] = useState([])
    const idTimeOut = useRef()
    const idStudentSelected = useRef()

    const handleChangeTextSearchStudent = (value) => {
        setTextSearch(value)
        if (idTimeOut.current) {
            clearInterval(idTimeOut.current)
        }
        idTimeOut.current = setTimeout(async () => {
            let response = await userService.searchUser({ search: value })
            if (response && response.result === true) {
                console.log(response.data)
                setListUserSearched(response.data)
            }
        }, 500)
    }

    const handleSendRequestToStudent = async (studentId) => {
        let response = await userService.postNewNotify({
            receiverId: studentId,
            contentEN: `User ${userInfor.lastName} ${userInfor.firstName} wants to establish a student-parent relationship with your account`,
            contentVI: `Người dùng ${userInfor.lastName} ${userInfor.firstName} muốn thiết lập quan hệ học sinh - phụ huynh với tài khoản của bạn`,
            typeId: notify_typeId.PARENT_REQ_LINK_ACCOUNT,
        })
        if (response && response.result === true) {
            socketNotify?.emit("response-request", { targetUserId: studentId })
            toast.success(language === languages.EN ? "Link request sent successfully" : "Gửi yêu cầu liên kết thành công")
        } else {
            toast.error(language === languages.EN ? "Link request sent failed" : "Gửi yêu cầu liên kết thất bại")
        }
    }

    const getListDataOfRelationshipAccount = async () => {
        let response = await userService.getListDataOfRelationshipAccount()
        if (response && response.result === true) {
            setDataUser(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    const handleDeleteRelationship = async () => {
        let response = await userService.deleteOneRelationshipByRelationshipId({ relationshipId: idStudentSelected.current })
        if (response && response.result === true) {
            setIsModalConfirmOpen(false)
            getListDataOfRelationshipAccount()
            toast.success(language === languages.EN ? response.messageEN : response.messageVI)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    useEffect(() => {
        getListDataOfRelationshipAccount()
    }, [])

    return (
        <>
            <Modal title={language === languages.EN ? "Create new assignment" : "Tạo mới bài tập"}
                width={800}
                open={isModalCreateAccLinkOpen}
                onOk={() => setIsModalCreateAccLinkOpen(false)}
                onCancel={() => { setTextSearch(""); setListUserSearched([]); setIsModalCreateAccLinkOpen(false) }}
            >
                <div className="row">
                    <div className="col-6">
                        <label>Nhập tên hoặc email học sinh</label>
                        <input type="text" className="form-control" value={textSearch} onChange={(e) => { handleChangeTextSearchStudent(e.target.value) }} />
                    </div>
                    <div className="col-12">
                        <div className="container">
                            <div className="list-teacher-search row">
                                {
                                    listUserSearched.length > 0 ?
                                        listUserSearched.map(item => {
                                            return (
                                                <div className="col-6">
                                                    <div className="each-teacher-search">
                                                        <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                                        <span>{language === languages.EN ? item.firstName + " " + item.lastName : item.lastName + " " + item.firstName}</span>
                                                        <CiSquarePlus className="btn-plus-teacher" onClick={() => { handleSendRequestToStudent(item.id) }} />
                                                    </div>
                                                </div>
                                            )
                                        }) :
                                        <p>Không tìm thấy</p>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </Modal>


            <Modal title={language === languages.EN ? "Confirm" : "Xác nhận"}
                width={400}
                open={isModalConfirmOpen}
                onOk={() => handleDeleteRelationship()}
                onCancel={() => setIsModalConfirmOpen(false)}
            >
                <p>Bạn có chắc chắn với hành động này</p>
            </Modal>

            <div className="container account-link">
                <div className="row">
                    <div className="col-12">
                        <p className="title">Liên kết tài khoản</p>
                    </div>
                    <div className="col-12 mt-3">
                        <button className="btn btn-primary" onClick={() => setIsModalCreateAccLinkOpen(true)}>Thêm liên kết</button>
                    </div>
                    <div className="col-12">
                        <div className="asigment-title">
                            <p>Tài khoản đã liên kết</p>
                            <p>Số lượng: {dataUser.length}</p>
                        </div>
                    </div>
                    {
                        dataUser.length > 0 ?
                            dataUser.map(item => {
                                return (
                                    <div className="col-4 mt-3" key={item.id}>
                                        <div className="each-account-link">
                                            <Avatar src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.studentOfParentData?.image} />
                                            <p className="ml-3">{language === languages.EN ? `${item.studentOfParentData?.firstName} ${item.studentOfParentData?.lastName}` : `${item.studentOfParentData?.lastName} ${item.studentOfParentData?.firstName}`}</p>
                                            <div className="btn-close-container">
                                                <TiDeleteOutline className="btn-tag-name-close" onClick={() => { idStudentSelected.current = item.id; setIsModalConfirmOpen(true) }} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) :
                            <p className="title">Chưa có liên kết nào</p>
                    }
                </div>
            </div>
        </>
    );
}

export default AccountLinkOfParents;
