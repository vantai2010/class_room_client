import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useState, useRef, useCallback } from "react";
import { environment, languages, path, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import "./FormExam.scss"
import teacherService from "../../service/teacherService";
import { toast } from "react-toastify";
import { Modal } from 'antd';
import Loading from "../../components/Loading"
import { CiClock1 } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import { CiViewList } from "react-icons/ci";
import userService from "../../service/userService";
import Webcam from 'react-webcam';
import React from 'react';

function FormExam() {
    const params = useParams()
    const optionsQuestionMap = { 0: "A. ", 1: "B. ", 2: "C. ", 3: "D. " }
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)
    const [isLoading, setIsLoading] = useState(false)

    const [listQuestions, setListQuestions] = useState([])
    const [nameExam, setNameExam] = useState("")
    const [timeLimit, setTimeLimit] = useState()

    const results = useRef([])
    const choise = useRef([])
    const grade = useRef(0)
    const toalTimeLimit = useRef()
    const idTimeOut = useRef()
    const listQuestionsRef = useRef({})
    const [countChoise, setCountChoise] = useState(0)
    const isCheckAlert = useRef(false)

    const handleChoise = (questionId, result) => {
        choise.current.forEach((child, index) => {
            if (child.questionId === questionId) {
                choise.current[index] = { ...choise.current[index], result: result }
            }
        })

    }

    const getContentAssignmentOfClassById = async () => {
        let response = await userService.getContentAssignmentsByExamId({ examId: params.id })
        if (response && response.result === true) {
            console.log(response.data)
            let data = response.data.question
            setNameExam(response.data.name)
            let arrQuestion = [...data.EASY, ...data.MEDIUM, ...data.HARD]
            // arrQuestion.forEach((child, index) => {
            //     choise.current[index] = { questionId: child.id, result: '' }
            //     results.current[index] = { questionId: child.id, result: child.answer }
            // })
            arrQuestion = arrQuestion.map(item => {
                return {
                    ...item,
                    answerSelected: ""
                }
            })
            setListQuestions(arrQuestion)
            setTimeLimit(response.data.timeLimit)
            toalTimeLimit.current = response.data.timeLimit
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    useEffect(() => {
        getContentAssignmentOfClassById()
    }, [])

    useEffect(() => {
        idTimeOut.current = setInterval(() => {
            if (timeLimit === 0) {
                clearInterval(idTimeOut.current);
            } else {
                setTimeLimit(timeLimit - 1);
            }

        }, 60000);

        // Xóa bộ đếm khi component unmount
        return () => clearInterval(idTimeOut.current);
    }, [timeLimit]);

    const handleChoiseAnswer = (value, questionId) => {
        setCountChoise(countChoise + 1)
        let arrData = [...listQuestions]
        arrData = arrData.map(item => {
            if (item.id === questionId) {
                return {
                    ...item,
                    answerSelected: value
                }
            } else {
                return item
            }
        })
        setListQuestions(arrData)
    }

    const handleRemoveToQuestion = (questionId) => {
        listQuestionsRef.current[questionId].scrollIntoView({ block: "center" })
    }

    const handleSubmit = async () => {
        let trueChoiseCount = 0
        listQuestions.forEach(item => {
            if (item.answerSelected === item.answer) {
                trueChoiseCount = trueChoiseCount + 1
            }
        })
        let point = Math.round((trueChoiseCount / results.current.length) * 10)
        let dataChoise = listQuestions.map(item => {
            return {
                examId: params.id,
                studentId: userInfor.id,
                questionId: item.id,
                selected: item.answerSelected
            }
        })
        let responseSaveChoise = await userService.saveResultChoiseQuestion({ dataChoise })
        if (responseSaveChoise && responseSaveChoise.result === true) {
            let responseSaveResult = await userService.saveResultExamOrAssignmentToHistory({ examId: params.id, studentId: userInfor.id, result: point, time: (toalTimeLimit.current - timeLimit) === 0 ? 1 : toalTimeLimit.current - timeLimit })
            if (responseSaveResult && responseSaveResult.result === true) {
                alert(language === languages.EN ? "Your point is: " + point : 'Kết quả của bạn là: ' + point)
                navigate(path.ROOT_PATH_NORMAL + path.STUDENT.DETAIL_ASSIGNMENT + "/" + params.id)
            } else {
                toast.error(language === languages.EN ? responseSaveResult.messageEN : responseSaveResult.messageVI)
            }
        } else {
            toast.error(language === languages.EN ? responseSaveChoise.messageEN : responseSaveChoise.messageVI)
        }
    }

    if (timeLimit > 0 && timeLimit < (Math.ceil((toalTimeLimit.current * 0.1)) + 2) && isCheckAlert.current === false) {
        isCheckAlert.current = true
        alert(language === languages.EN ? "Your time is running out, please complete it on time" : "Thời gian của bạn sắp hết vui lòng hoàn thành đúng hạn")
    }
    if (timeLimit === 0) {
        if (countChoise < listQuestions.length) {
            return alert(language === languages.EN ? "You haven't finished the assignment yet!!!" : "Bạn chưa hoàn thành xong bài !!!")
        } else {
            handleSubmit()
        }
    }

    const webcamRef = useRef(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        // Xử lý hình ảnh ở đây (ví dụ: lưu vào state hoặc gửi lên server)
        console.log('Captured image:', imageSrc);
    };

    useEffect(() => {
        // Chụp ảnh mỗi 3 giây
        const intervalId = setInterval(capture, 3000);

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            {
                isLoading && <Loading />
            }
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <p className="title">{nameExam}</p>
                    </div>
                    <div className="col-4 content-left-form">
                        <div className="video-container">
                            {/* <div className="video-invigilator">
                                <div className="each-video-invigilator">

                                </div>
                                <div className="each-video-invigilator">

                                </div>
                            </div> */}
                            <div className="my-video">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width={"100%"}
                                    height={"100%"}
                                    videoConstraints={{
                                        width: 1280,
                                        height: 720,
                                        facingMode: 'user', // Chọn camera trước (user) hoặc sau (environment)
                                    }}
                                />
                                <button onClick={capture}>Chụp ảnh</button>
                            </div>

                        </div>

                        <div className="list-question-icon-container">
                            <div className="infor-exam">
                                <span><CiClock1 className="icon-clock" /> {timeLimit} phút</span>
                                <span><CiViewList className="icon-list" /> {listQuestions.length} câu</span>
                            </div>
                            <div className="list-question">
                                {
                                    listQuestions.map((item, index) => {
                                        return (
                                            <span className={item.answerSelected === "" ? "each-question-icon" : "each-question-icon selected"} onClick={() => handleRemoveToQuestion(item.id)}>{index + 1}</span>
                                        )
                                    })
                                }
                            </div>
                            <button className={countChoise < listQuestions.length ? "btn-submit disabled" : "btn-submit"} disabled={countChoise < listQuestions.length} onClick={() => { handleSubmit() }}>Nộp bài</button>
                        </div>
                    </div>

                    <div className="col-8">
                        <div className='question-exam-container'>
                            <div className='exam-content'>
                                {
                                    listQuestions.map((child, index) => {
                                        return (
                                            <>
                                                {/* className={state[index] === true ? 'exam-child' : 'exam-child fail'} */}
                                                <div className='exam-child' key={child.id} ref={el => listQuestionsRef.current[child.id] = el}>
                                                    <p>{index + 1}.  {child.questionPrompt}</p>
                                                    <div className='exam-choise'>
                                                        {
                                                            child.options.map((item, indexQues) => {
                                                                return (
                                                                    <div key={indexQues}>
                                                                        <input type='radio' name={index} value={item} checked={child.answerSelected === item} onChange={(e) => handleChoiseAnswer(e.target.value, child.id)} />
                                                                        <span>{optionsQuestionMap[index]} {item}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FormExam;
