import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useRef, useState } from "react";
import { exam_typeId, languages, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import "./MissionParents.scss"
import { MdEdit } from "react-icons/md";
import { TbTrashFilled } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { MdOutlineAssignment } from "react-icons/md";
import { toast } from 'react-toastify';
import userService from "../../service/userService";

function MissionParents() {
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)

    const [listAssignment, setListAssignment] = useState([])
    const [listExam, setListExam] = useState([])

    const listIdOfStudent = useRef()
    const getListIdOfStudent = async () => {
        let response = await userService.getListStudentDataOfParents({ parentsId: userInfor.id })
        if (response && response.result === true) {
            listIdOfStudent.current = response.data.map(item => {
                return {
                    studentId: item.studentId,
                    firstName: item.studentOfParentData?.firstName,
                    lastName: item.studentOfParentData?.lastName
                }
            })
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const getMissionOfStudent = async () => {
        await getListIdOfStudent()
        listIdOfStudent.current.map(async item => {
            console.log("stydne", item)
            let response = await userService.getMissionOfStudent({ studentId: item.studentId })
            if (response && response.result === true) {
                console.log("second api", response)
                let arrAssignments = [...listAssignment]
                let arrExams = [...listExam]
                let newAssign = []
                response.data.forEach(eachData => {
                    if (eachData.typeId === exam_typeId.ASSIGNMENT) {
                        newAssign.push({
                            ...eachData,
                            studentData: item
                        })
                    }
                })
                let newExam = []
                response.data.forEach(eachData => {
                    if (eachData.typeId === exam_typeId.EXAM) {
                        newExam.push({
                            ...eachData,
                            studentData: item
                        })
                    }
                })
                setListAssignment(arrAssignments.concat(newAssign))
                setListExam(arrExams.concat(newExam))
            } else {
                toast.error(language === languages.EN ? response.messageEN : response.messageVI)
            }
        })

    }
    useEffect(() => {
        getMissionOfStudent()
    }, [])

    console.log("ass", listAssignment, "exam", listExam)
    return (
        <>
            <div className="container mission-parents">
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
                                <div className="col-6 mt-3" key={item.id}>
                                    <div className="each-assignment-mission-parents">
                                        <div className="icon-container-mission">
                                            <MdOutlineAssignment className="icon-assignment-mission" />
                                        </div>
                                        <div className="infor-assignment-mission">
                                            <span>{item.name}</span> <br />
                                            <span>Lớp: {item.classOfExamData?.name}</span>
                                            <span className="ml-3">- {language === languages.EN ? `${item.studentData?.firstName} ${item.studentData?.lastName}` : `${item.studentData?.lastName} ${item.studentData?.firstName}`} - </span><br />
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
                                <div className="col-6 mt-3" key={item.id}>
                                    <div className="each-assignment-mission-parents">
                                        <div className="icon-container-mission">
                                            <MdOutlineAssignment className="icon-assignment-mission" />
                                        </div>
                                        <div className="infor-assignment-mission">
                                            <span>{item.name}</span> <br />
                                            <span>Lớp: {item.classOfExamData?.name}</span>
                                            <span className="ml-3">- {language === languages.EN ? `${item.studentData?.firstName} ${item.studentData?.lastName}` : `${item.studentData?.lastName} ${item.studentData?.firstName}`} - </span><br />
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

export default MissionParents;
