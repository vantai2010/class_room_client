import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { TbTrashFilled } from "react-icons/tb";
import { Button, Modal } from 'antd';
import { languages, question_typeId, type_modalId } from "../../utils/constant";
import { useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import teacherService from "../../service/teacherService";
import { toast } from "react-toastify";

function QuestionDictionary() {
    const language = useSelector(state => state.app.language)
    const [isModalCreateQuestionOpen, setIsModalCreateQuestionOpen] = useState(false);
    const [isModalConfirmDeleteOpen, setIsModalConfirmDeleteOpen] = useState(false);
    const [listQuestion, setListQuestion] = useState([])
    const [typeSelected, setTypeSelected] = useState(question_typeId.EASY);
    const [currentLevel, setCurrentLevel] = useState(1)
    const questionSelected = useRef()
    const typeModal = useRef()

    const getListQuestion = async () => {
        let response = await teacherService.getQuestion({ typeId: typeSelected, level: currentLevel, search: "" })
        if (response && response.result === true) {
            setListQuestion(response.data)
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    useEffect(() => {
        getListQuestion()
    }, [typeSelected, currentLevel])

    const [inputForm, setInputForm] = useState({
        questionPrompt: "",
        optionsA: "",
        optionsB: "",
        optionsC: "",
        optionsD: "",
        answer: "",
        typeId: "",
        level: ""
    })
    const [errMess, setErrMess] = useState({
        questionPrompt: "",
        optionsA: "",
        optionsB: "",
        optionsC: "",
        optionsD: "",
        answer: "",
        typeId: "",
        level: ""
    })
    const handleChangeInput = (type, value) => {
        setInputForm({
            ...inputForm,
            [type]: value
        })
    }

    const handleCloseModalCreate = () => {
        setInputForm({
            questionPrompt: "",
            optionsA: "",
            optionsB: "",
            optionsC: "",
            optionsD: "",
            answer: "",
            typeId: "",
            level: ""
        })
        setErrMess({
            questionPrompt: "",
            optionsA: "",
            optionsB: "",
            optionsC: "",
            optionsD: "",
            answer: "",
            typeId: "",
            level: ""
        })
        setIsModalCreateQuestionOpen(false)
    }
    const createNewQuestion = async () => {
        let { questionPrompt, optionsA, optionsB, optionsC, optionsD, answer, typeId, level } = inputForm
        let response = await teacherService.createNewQuestion({
            questionPrompt,
            options: [optionsA, optionsB, optionsC, optionsD],
            answer,
            typeId,
            level
        })
        if (response && response.result === true) {
            handleCloseModalCreate()
            getListQuestion()
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const updateQuestion = async () => {
        let { questionPrompt, optionsA, optionsB, optionsC, optionsD, answer, typeId, level } = inputForm

        let response = await teacherService.updateOneQuestion({
            questionPrompt,
            options: [optionsA, optionsB, optionsC, optionsD],
            answer,
            typeId,
            level,
            questionSelectedId: questionSelected.current.id
        })
        if (response && response.result === true) {
            handleCloseModalCreate()
            getListQuestion()
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }
    const handleShowModalUpdate = () => {
        setInputForm({
            questionPrompt: questionSelected.current.questionPrompt,
            optionsA: questionSelected.current.options[0],
            optionsB: questionSelected.current.options[1],
            optionsC: questionSelected.current.options[2],
            optionsD: questionSelected.current.options[3],
            answer: questionSelected.current.answer,
            typeId: questionSelected.current.typeId,
            level: questionSelected.current.level
        })
        setIsModalCreateQuestionOpen(true)
    }

    const handleOkModal = () => {
        let { questionPrompt, optionsA, optionsB, optionsC, optionsD, answer, typeId, level } = inputForm
        if (!questionPrompt.trim()) {
            setErrMess({
                questionPrompt: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                optionsA: "",
                optionsB: "",
                optionsC: "",
                optionsD: "",
                answer: "",
                typeId: "",
                level: ""
            })
            return
        }
        if (!optionsA.trim()) {
            setErrMess({
                questionPrompt: "",
                optionsA: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                optionsB: "",
                optionsC: "",
                optionsD: "",
                answer: "",
                typeId: "",
                level: ""
            })
            return
        }
        if (!optionsB.trim()) {
            setErrMess({
                questionPrompt: "",
                optionsA: "",
                optionsB: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                optionsC: "",
                optionsD: "",
                answer: "",
                typeId: "",
                level: ""
            })
            return
        }
        if (!optionsC.trim()) {
            setErrMess({
                questionPrompt: "",
                optionsA: "",
                optionsB: "",
                optionsC: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                optionsD: "",
                answer: "",
                typeId: "",
                level: ""
            })
            return
        }
        if (!optionsD.trim()) {
            setErrMess({
                questionPrompt: "",
                optionsA: "",
                optionsB: "",
                optionsC: "",
                optionsD: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                answer: "",
                typeId: "",
                level: ""
            })
            return
        }
        if (!answer.trim()) {
            setErrMess({
                questionPrompt: "",
                optionsA: "",
                optionsB: "",
                optionsC: "",
                optionsD: "",
                answer: language === languages.EN ? "Please enter this field" : "Vui lòng nhập trường này",
                typeId: "",
                level: ""
            })
            return
        }
        if (!typeId) {
            setErrMess({
                questionPrompt: "",
                optionsA: "",
                optionsB: "",
                optionsC: "",
                optionsD: "",
                answer: "",
                typeId: language === languages.EN ? "Please select this field" : "Vui lòng chọn trường này",
                level: ""
            })
            return
        }
        if (!level) {
            setErrMess({
                questionPrompt: "",
                optionsA: "",
                optionsB: "",
                optionsC: "",
                optionsD: "",
                answer: "",
                typeId: "",
                level: language === languages.EN ? "Please select this field" : "Vui lòng chọn trường này"
            })
            return
        }
        if (!isNaN(questionPrompt)) {
            setErrMess({
                questionPrompt: language === languages.EN ? "This field must be text" : "Trường này phải là chữ",
                optionsA: "",
                optionsB: "",
                optionsC: "",
                optionsD: "",
                answer: "",
                typeId: "",
                level: ""
            })
            return
        }
        if (![optionsA, optionsB, optionsC, optionsD].some(item => item === answer)) {
            setErrMess({
                questionPrompt: "",
                optionsA: "",
                optionsB: "",
                optionsC: "",
                optionsD: "",
                answer: language === languages.EN ? "This answer does not match any other answers" : "Đáp án này không trùng với bất kỳ câu trả lời nào",
                typeId: "",
                level: ""
            })
            return
        }

        if (typeModal.current === type_modalId.CREATE) {
            createNewQuestion()
        } else if (typeModal.current === type_modalId.UPDATE) {
            updateQuestion()
        }
    }

    const handleDeleteQuestion = async () => {
        let response = await teacherService.deleteOneQuestion({ questionSelectedId: questionSelected.current.id })
        if (response && response.result === true) {
            toast.success(language === languages.EN ? response.messageEN : response.messageVI)
            setIsModalConfirmDeleteOpen(false)
            getListQuestion()
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    const optionsQuestionMap = { 0: "A. ", 1: "B. ", 2: "C. ", 3: "D. " }

    return (
        <>
            <Modal title={language === languages.EN ? "Question structure" : "Cấu trúc câu hỏi"}
                open={isModalCreateQuestionOpen}
                onOk={() => handleOkModal()}
                onCancel={() => handleCloseModalCreate()}
            >
                <div className="row">
                    <div className="col-12">
                        <label>Câu hỏi: </label>
                        <textarea className="form-control" value={inputForm.questionPrompt} onChange={e => handleChangeInput("questionPrompt", e.target.value)}></textarea>
                        <p style={{ color: "red" }}>{errMess.questionPrompt}</p>
                    </div>
                    <div className="col-12">
                        <label className="">Câu trả lời: </label>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" value={inputForm.optionsA} onChange={e => handleChangeInput("optionsA", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.optionsA}</p>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" value={inputForm.optionsB} onChange={e => handleChangeInput("optionsB", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.optionsB}</p>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" value={inputForm.optionsC} onChange={e => handleChangeInput("optionsC", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.optionsC}</p>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" value={inputForm.optionsD} onChange={e => handleChangeInput("optionsD", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.optionsD}</p>
                    </div>
                    <div className="col-6">
                        <label>Đáp án: </label>
                        <input type="text" className="form-control" value={inputForm.answer} onChange={e => handleChangeInput("answer", e.target.value)} />
                        <p style={{ color: "red" }}>{errMess.answer}</p>
                    </div>
                    <div className="col-6">
                        <label>Độ khó: </label>
                        <select className="form-control " value={inputForm.typeId} onChange={e => handleChangeInput("typeId", e.target.value)}>
                            <option></option>
                            <option value={question_typeId.EASY}>{language === languages.EN ? "Easy" : "Dễ"}</option>
                            <option value={question_typeId.MEDIUM}>{language === languages.EN ? "Medium" : "Trung bình"}</option>
                            <option value={question_typeId.HARD}>{language === languages.EN ? "Hard" : "Khó"}</option>
                        </select>
                        <p style={{ color: "red" }}>{errMess.typeId}</p>
                    </div>
                    <div className="col-6">
                        <label>Trình độ: </label>
                        <select className="form-control " value={inputForm.level} onChange={e => handleChangeInput("level", e.target.value)}>
                            <option></option>
                            <option value="1">{language === languages.EN ? "Class 1" : "Lớp 1"}</option>
                            <option value="2">{language === languages.EN ? "Class 2" : "Lớp 2"}</option>
                            <option value="3">{language === languages.EN ? "Class 3" : "Lớp 3"}</option>
                            <option value="4">{language === languages.EN ? "Class 4" : "Lớp 4"}</option>
                            <option value="5">{language === languages.EN ? "Class 5" : "Lớp 5"}</option>
                        </select>
                        <p style={{ color: "red" }}>{errMess.level}</p>
                    </div>
                </div>
            </Modal>

            <Modal title={language === languages.EN ? "Confirm" : "Xác nhận"}
                open={isModalConfirmDeleteOpen}
                onOk={() => handleDeleteQuestion()}
                onCancel={() => setIsModalConfirmDeleteOpen(false)}
            >
                <p>Bạn có chắc chắn muốn thực hiện hành động này</p>
            </Modal>

            <div className="container">
                <p className="title"><FormatedText id="header.storeQuestion" /></p>
                <label>Trình độ: </label>
                <select className="form-control " value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)}>
                    <option value="1">Lớp 1</option>
                    <option value="2">Lớp 2</option>
                    <option value="3">Lớp 3</option>
                    <option value="4">Lớp 4</option>
                    <option value="5">Lớp 5</option>
                </select>
                <button className="create-question-btn btn btn-primary" onClick={() => { typeModal.current = type_modalId.CREATE; setIsModalCreateQuestionOpen(true) }}>Tạo câu hỏi mới</button>
                <button className="create-btn">Sinh câu hỏi từ file</button>



                <div className="question-container mt-5">
                    <div className="list-btn-level container">
                        <div className="row">
                            <button className={typeSelected === question_typeId.EASY ? "btn-easy selected" : "btn-easy"} onClick={() => setTypeSelected(question_typeId.EASY)}>Dễ</button>
                            <button className={typeSelected === question_typeId.MEDIUM ? "btn-medium selected" : "btn-medium"} onClick={() => setTypeSelected(question_typeId.MEDIUM)}>Trung bình</button>
                            <button className={typeSelected === question_typeId.HARD ? "btn-hard selected" : "btn-hard"} onClick={() => setTypeSelected(question_typeId.HARD)}>Khó</button>
                        </div>
                    </div>
                    <div className="group-list-question">
                        <p>Tìm kiếm</p>
                        <input type="text" />
                        {
                            listQuestion.length > 0 &&
                            listQuestion.map(item => {
                                return (
                                    <div className="each-question" key={item.id}>
                                        <p className="title-question">{item.questionPrompt}</p>
                                        <div className="answer">
                                            <div className="row">
                                                {
                                                    item.options.map((option, index) => {
                                                        return (<div className="col-3"><p>{optionsQuestionMap[index]}{option}</p></div>)
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="btn-group">
                                            <MdEdit className="btn-edit" onClick={() => { typeModal.current = type_modalId.UPDATE; questionSelected.current = item; handleShowModalUpdate() }} />
                                            <TbTrashFilled className="btn-delete" onClick={() => { questionSelected.current = item; setIsModalConfirmDeleteOpen(true) }} />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default QuestionDictionary;
