import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useState } from "react";
import { environment, languages, path, typeQuestionId } from "../../utils/constant";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import "./ClassOfParents.scss"
import { toast } from 'react-toastify';
import userService from "../../service/userService";
import { useNavigate } from "react-router";

function ClassOfParents() {
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)

    const [listData, setListData] = useState([])

    const getListClasOfStudentByParentsId = async () => {
        let response = await userService.getListClasOfStudentByParentsId({ parentsId: userInfor.id })
        if (response && response.result === true) {
            console.log(response.data)
            setListData(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    useEffect(() => {
        getListClasOfStudentByParentsId()
    }, [])

    return (
        <>
            <div className="container class-parents">
                <div className="row">
                    <div className="col-12">
                        <p className="title">Danh sách lớp của con</p>
                    </div>
                    {
                        listData.length > 0 ?
                            listData.map(item => {
                                return (
                                    <>
                                        <div className="col-12">
                                            <div className="asigment-title">
                                                <span>{language === languages.EN ? `${item.studentOfParentData?.firstName} ${item.studentOfParentData?.lastName}` : `${item.studentOfParentData?.lastName} ${item.studentOfParentData?.firstName}`} <FaCaretDown /></span>
                                            </div>
                                        </div>
                                        {
                                            item.classIdOfStudentData && item.classIdOfStudentData.length > 0 &&
                                            item.classIdOfStudentData.map(eachClass => {
                                                return (
                                                    <div className="col-3 mt-2" key={eachClass.id} onClick={() => navigate(path.ROOT_PATH_NORMAL + path.PARENTS.DETAIL_CLASS + "/" + eachClass.classId)}>
                                                        <div className="each-class " >
                                                            <img src={environment.REACT_APP_URL_BACK_END + "/Images/" + eachClass.classOfstudentData?.image} />
                                                            <div className="group-infor">
                                                                <p>Tên lớp: {eachClass.classOfstudentData?.name}</p>
                                                                <p>Giáo viên: {language === languages.EN ? `${eachClass.classOfstudentData?.teacherOfClassData?.firs} ${eachClass.classOfstudentData?.teacherOfClassData?.last}` : `${eachClass.classOfstudentData?.teacherOfClassData?.last} ${eachClass.classOfstudentData?.teacherOfClassData?.firs}`}</p>
                                                                <p>Liên hệ:  ({eachClass.classOfstudentData?.teacherOfClassData?.phon})</p>
                                                                <p>Ngày tạo: {eachClass.classOfstudentData?.teacherOfClassData?.dateCreate}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                )
                            })
                            :
                            <p className="title">Không có dữ liệu</p>

                    }

                </div>
            </div>
        </>
    );
}

export default ClassOfParents;
