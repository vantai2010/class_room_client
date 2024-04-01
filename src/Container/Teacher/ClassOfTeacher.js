import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useState } from "react";
import { environment, languages, path, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import "./ClassOfTeacher.scss"
import teacherService from "../../service/teacherService";
import { toast } from "react-toastify";
import { Modal } from 'antd';
import Loading from "../../components/Loading"
import { useNavigate } from "react-router-dom";

function ClassOfTeacher() {
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const [isLoading, setIsLoading] = useState(false)
    const [isModalCreateClassOpen, setIsModalCreateClassOpen] = useState(false);
    const [inputForm, setInputForm] = useState({
        name: "",
        description: "",
        image: "",
        level: ""
    })
    const [errMess, setErrMess] = useState({
        name: "",
        description: "",
        image: "",
        level: ""
    })

    const handleCloseModal = () => {
        setIsModalCreateClassOpen(false)
        setInputForm({
            name: "",
            description: "",
            image: "",
            level: ""
        })
        setErrMess({
            name: "",
            description: "",
            image: "",
            level: ""
        })
    }
    const handleChangeInput = (type, value) => {
        setInputForm({
            ...inputForm,
            [type]: value
        })
    }

    const [listClass, setListClass] = useState([])
    let getListClassByTeacher = async () => {
        let response = await teacherService.getMyClass()
        if (response && response.result === true) {
            setListClass(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    let createNewClass = async () => {
        let { name, description, image, level } = inputForm
        if (!name.trim()) {
            setErrMess({
                name: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                description: "",
                image: "",
                level: ""
            })
            return
        }
        if (!level) {
            setErrMess({
                name: "",
                description: "",
                image: "",
                level: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này"
            })
            return
        }
        if (!description.trim()) {
            setErrMess({
                name: "",
                description: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                image: "",
                level: ""
            })
            return
        }
        if (!image) {
            setErrMess({
                name: "",
                description: "",
                image: language === languages.EN ? "Please select a photo" : "Vui lòng chọn ảnh",
                level: ""
            })
            return
        }
        if (!isNaN(name)) {
            setErrMess({
                name: language === languages.EN ? "This field must be text" : "Trường này phải là chữ",
                description: "",
                image: "",
                level: ""
            })
            return
        }
        if (!isNaN(description)) {
            setErrMess({
                name: "",
                description: language === languages.EN ? "This field must be text" : "Trường này phải là chữ",
                image: "",
                level: ""
            })
            return
        }
        setIsLoading(true)
        let response = await teacherService.createNewClass({
            name: inputForm.name,
            description: inputForm.description,
            image: inputForm.image,
            level: inputForm.level
        })
        if (response && response.result === true) {
            setIsLoading(false)
            toast.success(language === languages.EN ? response.messageEN : response.messageVI)
            handleCloseModal()
            getListClassByTeacher()
        } else {
            setIsLoading(false)
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    useEffect(() => {
        getListClassByTeacher()
    }, [])

    const handleChangePage = (page) => {
        return navigate(page)
    }

    return (
        <>
            {
                isLoading && <Loading />
            }
            <Modal title={language === languages.EN ? "Create a new class" : "Tạo lớp"}
                width={800}
                open={isModalCreateClassOpen}
                onOk={() => createNewClass()}
                onCancel={() => handleCloseModal()}
            >
                <div className="row">
                    <div className="col-6">
                        <label>Tên lớp</label>
                        <input type="text" className="form-control" value={inputForm.name} onChange={e => handleChangeInput("name", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.name}</p>
                    </div>
                    <div className="col-6">
                        <label>Cấp độ</label>
                        <select className="form-control" value={inputForm.level} onChange={e => handleChangeInput("level", e.target.value)}>
                            <option></option>
                            <option value="1">{language === languages.EN ? "Class 1" : "Lớp 1"}</option>
                            <option value="2">{language === languages.EN ? "Class 2" : "Lớp 2"}</option>
                            <option value="3">{language === languages.EN ? "Class 3" : "Lớp 3"}</option>
                            <option value="4">{language === languages.EN ? "Class 4" : "Lớp 4"}</option>
                            <option value="5">{language === languages.EN ? "Class 5" : "Lớp 5"}</option>
                        </select>
                        <p style={{ color: "red" }}>{errMess.level}</p>
                    </div>
                    <div className="col-12">
                        <label>Mô tả</label>
                        <textarea className="form-control" value={inputForm.description} onChange={e => handleChangeInput("description", e.target.value)}></textarea>
                        <p style={{ color: "red" }}>{errMess.description}</p>
                    </div>
                    <div className="col-6 mt-2">
                        <label for="fileInput">Chọn ảnh</label>
                        <input type="file" id="fileInput" onChange={e => handleChangeInput("image", e.target.files[0])} />
                        <p style={{ color: "red" }}>{errMess.image}</p>
                    </div>
                </div>
            </Modal>

            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <p className="title">Danh sách lớp</p>
                    </div>
                    <div className="col-4">
                        <input type="text" className="form-control" placeholder={language === languages.EN ? "Enter the name class" : "Nhập tên lớp"} />

                    </div>
                    <div className="col-8">
                        <span>Xắp sếp</span>
                    </div>
                    <div className="col-12 my-3">
                        <button className="btn btn-primary" onClick={() => setIsModalCreateClassOpen(true)}>Tạo lớp</button>
                    </div>

                    {
                        listClass && listClass.length > 0 ?
                            listClass.map(item => {
                                return (
                                    <div className="col-3" onClick={() => handleChangePage(path.ROOT_PATH_NORMAL + path.TEACHER.DETAIL_CLASS + "/" + item.id + "/" + item.level)}>
                                        <div className="each-class">
                                            <img src={environment.REACT_APP_URL_BACK_END + "/Images/" + item.image} />
                                            <div className="group-infor">
                                                <p>Tên lớp: {item.name}</p>
                                                <p>Trình độ: Lớp {item.level}</p>
                                                <p>Ngày tạo: {item.dateCreate}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) :
                            <p className="title" style={{ color: "" }}>Chưa có lớp nào</p>
                    }

                </div>
            </div>
        </>
    );
}

export default ClassOfTeacher;
