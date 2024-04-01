import { useEffect, useRef, useState } from 'react';
import './WorkForm.scss';
import userService from '../../service/userService';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { languages, path } from '../../utils/constant';
import { useSelector } from 'react-redux';
// import { lythuyet } from './store/lythuyet';
import { useNavigate } from 'react-router-dom';


function WorkForm() {
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const params = useParams()
    const [update, setUpdate] = useState(true)
    const [listQuestions, setListQuestions] = useState([])
    // const [state, setState] = useState({})

    const [timeLimit, setTimeLimit] = useState()

    const results = useRef([])
    const choise = useRef([])
    const grade = useRef(0)

    const toalTimeLimit = useRef()
    const isCheckAlert = useRef(false)
    const idTimeOut = useRef()

    const handleSubmit = async () => {
        if (choise.current.some(item => item.result === "")) {
            return alert(language === languages.EN ? "Please answer all questions" : "Hãy trả lời hết tất cả các câu hỏi")
        }
        await handleCountPointAndSaveResult()
    }

    const handleCountPointAndSaveResult = async () => {
        results.current.forEach((child, index) => {
            if (child.result === choise.current[index].result) {
                grade.current = grade.current + 1
            }
        })
        let point = Math.round((grade.current / results.current.length) * 10)
        let dataChoise = choise.current.map(item => {
            return {
                examId: params.id,
                studentId: userInfor.id,
                questionId: item.questionId,
                selected: item.result
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
            let data = response.data.question
            let arrQuestion = [...data.EASY, ...data.MEDIUM, ...data.HARD]
            arrQuestion.forEach((child, index) => {
                choise.current[index] = { questionId: child.id, result: '' }
                results.current[index] = { questionId: child.id, result: child.answer }
            })
            setListQuestions(arrQuestion)
            setTimeLimit(response.data.timeLimit)
            toalTimeLimit.current = response.data.timeLimit
        } else {
            toast.error(language === languages.EN ? response.messageEN : response.messageVI)
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            return navigate(path.LOGIN)
        }
    }, [isAuthenticated])

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

    if (timeLimit > 0 && timeLimit < (Math.ceil((toalTimeLimit.current * 0.1)) + 2) && isCheckAlert.current === false) {
        isCheckAlert.current = true
        alert(language === languages.EN ? "Your time is running out, please complete it on time" : "Thời gian của bạn sắp hết vui lòng hoàn thành đúng hạn")
    }
    if (timeLimit === 0) {
        if (choise.current.some(item => item.result === "")) {
            return alert(language === languages.EN ? "You haven't finished the assignment yet!!!" : "Bạn chưa hoàn thành xong bài !!!")
        } else {
            handleCountPointAndSaveResult()
        }
    }

    // useEffect(() => {
    //     let object = {}
    //     for (let i = 0; i < exams.current.length; i++) {
    //         object = { ...object, [i]: true }
    //     }
    //     setState(object)
    // }, [listQuestions])

    const optionsQuestionMap = { 0: "A. ", 1: "B. ", 2: "C. ", 3: "D. " }
    return (
        <>
            <div className='exam-container'>
                <div className='exam-content'>
                    {
                        listQuestions.map((child, index) => {
                            return (
                                <>
                                    {/* className={state[index] === true ? 'exam-child' : 'exam-child fail'} */}
                                    <div className='exam-child' key={child.id}>
                                        <p>{index}.  {child.questionPrompt}</p>
                                        <div className='exam-choise'>
                                            {
                                                child.options.map((item, indexQues) => {
                                                    return (
                                                        <div key={indexQues}>
                                                            <input type='radio' name={index} onChange={() => handleChoise(child.id, item)} />
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
            <div className='button-container'>
                <button className='button' onClick={() => { handleSubmit() }}>gửi</button>
            </div>
            {
                timeLimit &&
                <div className='time-limit-container'>
                    <span className='time-limit'>Thời gian còn {timeLimit} phút</span>
                </div>
            }
        </>
    );
}

export default WorkForm;
