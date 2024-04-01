import { MdOutlineNotificationsNone } from 'react-icons/md'
import { ImPointRight } from 'react-icons/im'
import React, { useEffect, useRef, useState } from 'react'
import FormatedText from '../components/FormatedText/FormatedText';
import { useSelector } from 'react-redux';
import { languages, notify_typeId, path } from '../utils/constant';
import { toast } from 'react-toastify';
import { deleteOneNotificationService } from '../service/appService';
import { useNavigate } from 'react-router-dom';
import userService from '../service/userService';
import teacherService from '../service/teacherService';

export default function Notifycation() {
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const socketNotify = useSelector(state => state.auth.socketNotify)
    const userInfor = useSelector(state => state.auth.userInfor)
    const [listNotifycation, setListNotifycation] = useState([])
    const getAllNotifications = async () => {
        let res = await userService.getListNotify()
        if (res && res.result === true) {
            setListNotifycation(res.data)
        }
    }

    useEffect(() => {
        getAllNotifications()
        socketNotify?.on('update-notification', () => {
            toast(language === languages.EN ? 'You have new notification' : "Bạn có một thông báo mới")
            getAllNotifications()
        })
    }, [])

    const handleDeleteNotifycation = async (id) => {
        let res = await userService.deleteOneNotify({ notifyId: id })
        if (res && res.result === true) {
            getAllNotifications()
        } else {
            toast.error(language === languages.EN ? res.messageEN : res.messageVI)
        }
    }

    // const handleRedirect = (item) => {
    //     // console.log(navigate)
    //     navigate(item.location)
    //     handleDeleteNotifycation(item.id)
    // }

    const handleAgree = async ({ notifyId, typeId, params, senderData, receiverData }) => {
        if (typeId === notify_typeId.STUDENT_REQ_JOIN_CLASS) {
            let resAddStudentToClass = await teacherService.addOneStudentToClass({ studentId: senderData.id, classId: params })
            if (resAddStudentToClass && resAddStudentToClass.result === true) {
                await userService.postNewNotify({
                    receiverId: senderData.id,
                    contentEN: `Your request to join class has been approved by ${receiverData.firstName} ${receiverData.lastName} teacher`,
                    contentVI: `Yêu cầu tham gia lớp của bạn đã được giáo viên ${receiverData.lastName} ${receiverData.firstName} đồng ý`,
                    typeId: notify_typeId.NOTIFY,
                })
                socketNotify?.emit("response-request", { targetUserId: senderData.id })
                let resDelNotify = await userService.deleteOneNotify({ notifyId: notifyId })
                if (resDelNotify && resDelNotify.result === true) {
                    getAllNotifications()
                }
            }
        }
        if (typeId === notify_typeId.TEACHER_REQ_JOIN_CLASS) {
            let resAddStudentToClass = await teacherService.addOneStudentToClass({ studentId: userInfor.id, classId: params })
            if (resAddStudentToClass && resAddStudentToClass.result === true) {
                await userService.postNewNotify({
                    receiverId: senderData.id,
                    contentEN: `Your request to join the class has been accepted by student ${receiverData.lastName} ${receiverData.firstName}`,
                    contentVI: `Yêu cầu tham gia lớp của bạn đã được học sinh ${receiverData.lastName} ${receiverData.firstName} đồng ý`,
                    typeId: notify_typeId.NOTIFY,
                })
                socketNotify?.emit("response-request", { targetUserId: senderData.id })
                let resDelNotify = await userService.deleteOneNotify({ notifyId: notifyId })
                if (resDelNotify && resDelNotify.result === true) {
                    getAllNotifications()
                    navigate(path.ROOT_PATH_NORMAL + path.STUDENT.MY_CLASS)
                }
            }
        }
        if (typeId === notify_typeId.PARENT_REQ_LINK_ACCOUNT) {
            let resCreateRelationship = await userService.createRelationshipAccount({ studentId: receiverData.id, parentsId: senderData.id })
            console.log(resCreateRelationship)
            if (resCreateRelationship && resCreateRelationship.result === true) {
                await userService.postNewNotify({
                    receiverId: senderData.id,
                    contentEN: `Your request to establish a relationship has been accepted by student ${receiverData.lastName} ${receiverData.firstName}`,
                    contentVI: `Yêu cầu thiết lập quan hệ của bạn đã được học sinh ${receiverData.lastName} ${receiverData.firstName} đồng ý`,
                    typeId: notify_typeId.NOTIFY,
                })
                socketNotify?.emit("response-request", { targetUserId: senderData.id })
                let resDelNotify = await userService.deleteOneNotify({ notifyId: notifyId })
                if (resDelNotify && resDelNotify.result === true) {
                    getAllNotifications()
                }
            } else if (resCreateRelationship && resCreateRelationship.errCode === true) {
                toast.error(language === languages.EN ? "Your account is already linked to another account and cannot proceed" : "Tài khoản của bạn đã được liên kết với tài khoản khác lên không thể thực hiện")
                await userService.postNewNotify({
                    receiverId: senderData.id,
                    contentEN: `Student account ${receiverData.lastName} ${receiverData.firstName} is already linked to another account`,
                    contentVI: `Tài khoản của học sinh ${receiverData.lastName} ${receiverData.firstName} đã được liên kết với tài khoản khác`,
                    typeId: notify_typeId.NOTIFY,
                })
                socketNotify?.emit("response-request", { targetUserId: senderData.id })
                let resDelNotify = await userService.deleteOneNotify({ notifyId: notifyId })
                if (resDelNotify && resDelNotify.result === true) {
                    getAllNotifications()
                }
            }
        }
    }

    const handleRefuse = async ({ notifyId, typeId, senderData, receiverData }) => {
        if (typeId === notify_typeId.STUDENT_REQ_JOIN_CLASS) {
            await userService.postNewNotify({
                receiverId: senderData.id,
                contentEN: `Your request to join class was rejected by teacher ${receiverData.lastName} ${receiverData.firstName}`,
                contentVI: `Yêu cầu tham gia lớp của bạn đã bị giáo viên ${receiverData.lastName} ${receiverData.firstName} từ chối`,
                typeId: notify_typeId.NOTIFY,
            })
            socketNotify?.emit("response-request", { targetUserId: senderData.id })
            let resDelNotify = await userService.deleteOneNotify({ notifyId: notifyId })
            if (resDelNotify && resDelNotify.result === true) {
                getAllNotifications()
            }
        }
        if (typeId === notify_typeId.TEACHER_REQ_JOIN_CLASS) {
            await userService.postNewNotify({
                receiverId: senderData.id,
                contentEN: `Your request to join class was rejected by student ${receiverData.lastName} ${receiverData.firstName}`,
                contentVI: `Yêu cầu tham gia lớp của bạn đã bị học sinh ${receiverData.lastName} ${receiverData.firstName} từ chối`,
                typeId: notify_typeId.NOTIFY,
            })
            socketNotify?.emit("response-request", { targetUserId: senderData.id })
            let resDelNotify = await userService.deleteOneNotify({ notifyId: notifyId })
            if (resDelNotify && resDelNotify.result === true) {
                getAllNotifications()
            }
        }
        if (typeId === notify_typeId.PARENT_REQ_LINK_ACCOUNT) {
            await userService.postNewNotify({
                receiverId: senderData.id,
                contentEN: `Your request to establish a relationship has been refused by student ${receiverData.lastName} ${receiverData.firstName}`,
                contentVI: `Yêu cầu thiết lập quan hệ của bạn đã được học sinh ${receiverData.lastName} ${receiverData.firstName} từ chối`,
                typeId: notify_typeId.NOTIFY,
            })
            socketNotify?.emit("response-request", { targetUserId: senderData.id })
            let resDelNotify = await userService.deleteOneNotify({ notifyId: notifyId })
            if (resDelNotify && resDelNotify.result === true) {
                getAllNotifications()
            }
        }
    }

    return (
        <li className='notifycation-parent'><MdOutlineNotificationsNone className='notification-icon' /><FormatedText id="header.notification" />

            {
                listNotifycation && listNotifycation.length > 0 &&
                <div className='notification-quantity'>{listNotifycation.length}</div>
            }
            <div className='box-notifycation-container'>
                {
                    listNotifycation && listNotifycation.length > 0 &&
                    listNotifycation.map(item => {
                        return (
                            <div className="box-notifycation-content" key={item.id}>
                                <div className="box-notifycation-title">
                                    <p>{language === languages.EN ? item.contentEN : item.contentVI}</p>
                                    {/* {
                                    item.location && <div className='notifycation-naviagte' onClick={() => handleRedirect(item)}><ImPointRight /><FormatedText id="header.check" /></div>
                                } */}
                                    <div className="btn-close-notifycation" onClick={() => handleDeleteNotifycation(item.id)}>x</div>
                                </div>
                                <div className="box-notifycation-message">
                                    {language === languages.EN ? item.messageEn : item.messageVi}
                                </div>
                                {
                                    item.typeId !== notify_typeId.NOTIFY &&
                                    <div className='btn-function-container'>
                                        <button onClick={() => handleAgree({ notifyId: item.id, typeId: item.typeId, params: item.params, senderData: item.inforSenderData, receiverData: item.inforReceiverData })}>Đồng ý</button>
                                        <button onClick={() => { handleRefuse({ notifyId: item.id, typeId: item.typeId, senderData: item.inforSenderData, receiverData: item.inforReceiverData }) }}>Từ chối</button>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
                {
                    listNotifycation && listNotifycation.length === 0 &&
                    <div className='box-message-notifycation'>
                        <FormatedText id="header.notifycationMess" />
                    </div>
                }


            </div>
        </li>
    )
}
