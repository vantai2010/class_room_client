import './HomeHeader.scss';
import { BiSearch, BiBook, BiStar } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './HomeHeader.scss';
import Avatar from '../../components/Avatar';
import { NAME_BACK_LOCATION, SCROLL_BACK_LOCATION, languages, path, roleId } from '../../utils/constant';
import { changeLanguage } from '../../store/slice/appSlice';
import FormatedText from '../../components/FormatedText/FormatedText'
import { textEN } from '../../translations/en';
import { textVI } from '../../translations/vi';
import _ from 'lodash'
import { TfiWorld } from 'react-icons/tfi'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import Notifycation from '../Notifycation';
import Search from '../../components/Search';

function HomeHeader({ id }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const userInfor = useSelector(state => state.auth.userInfor)
    const locationBack = useSelector(state => state.app.locationBack)
    const language = useSelector(state => state.app.language)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleRedirectToLogin = () => {
        navigate('/login')
    }

    const handleRedirectToRegister = () => {
        navigate('/register')
    }

    const handleChangeLanguage = (language) => {
        dispatch(changeLanguage(language))
    }

    const handleRedirectBackToRoute = () => {
        if (localStorage[NAME_BACK_LOCATION]) {
            navigate(localStorage[NAME_BACK_LOCATION], { state: { scroll_Y: localStorage[SCROLL_BACK_LOCATION] } })
            localStorage.removeItem(NAME_BACK_LOCATION)
            localStorage.removeItem(SCROLL_BACK_LOCATION)
        } else {
            navigate('/')
        }

    }

    const handleNavigate = (location) => {

        navigate(location)
    }

    return (
        <>
            <div className="header-container">
                <div className="header-content container">
                    <div className="header-content-up row">
                        {
                            isAuthenticated && userInfor.roleId === roleId.TEACHER &&
                            <ul className='row'>
                                <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.TEACHER.MY_CLASS}><FormatedText id="header.class" /></Link>
                                </li>
                                <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.TEACHER.QUESTION_DICTIONARY}><FormatedText id="header.storeQuestion" /></Link>
                                </li>
                                <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.TEACHER.MONITOR_THE_EXAM}><FormatedText id="header.exam" /></Link>
                                </li>
                                {/* <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.CONTACT}><FormatedText id="header.contact" /></Link>
                                </li> */}
                            </ul>

                        }

                        {
                            isAuthenticated && userInfor.roleId === roleId.STUDENT &&
                            <ul className='row'>
                                <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.STUDENT.MY_CLASS}><FormatedText id="header.class" /></Link>
                                </li>
                                <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.STUDENT.MISSION}>Nhiệm vụ</Link>
                                </li>
                                {/* <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.STUDENT.ACCOUNT_LINK}>Liên kết tài khoản</Link>
                                </li> */}
                            </ul>
                        }

                        {
                            isAuthenticated && userInfor.roleId === roleId.PARENTS &&
                            <ul className='row'>
                                <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.PARENTS.MY_CLASS}>Lớp của con</Link>
                                </li>
                                <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.PARENTS.MISSION}>Nhiệm vụ</Link>
                                </li>
                                {/* <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.CONTACT}>Tương tác</Link>
                                </li> */}
                                <li className="mx-2">
                                    <Link to={path.ROOT_PATH_NORMAL + path.PARENTS.ACCOUNT_LINK}>Liên kết tài khoản</Link>
                                </li>
                            </ul>
                        }



                        <ul className="row" style={{ alignItems: 'inherit' }}>
                            {isAuthenticated && !_.isEmpty(userInfor) && userInfor.roleId === roleId.ADMIN && <li onClick={() => handleNavigate('/system')} className="mx-2"><FormatedText id="header.admin" /></li>}
                            {
                                isAuthenticated &&
                                <>
                                    <Notifycation />
                                </>
                            }
                            <li className="mx-2"><AiOutlineQuestionCircle /><FormatedText id="header.support" /></li>
                            <li className="mx-2 homepage-language"><TfiWorld className='mx-1' /><FormatedText id="header.language" />
                                <ul className="box-select-language">
                                    <li className={language === languages.VI ? "language-vi active" : "language-vi"} onClick={() => handleChangeLanguage(languages.VI)}>VI</li>
                                    <li className={language === languages.EN ? "language-en active" : "language-en"} onClick={() => handleChangeLanguage(languages.EN)}>EN</li>
                                </ul>
                            </li>
                            {
                                isAuthenticated ? <Avatar isShowObtion={true} /> : <>

                                    <li className="mx-2" onClick={() => handleRedirectToRegister()}><FormatedText id="header.register" /></li>
                                    <li className="mx-2" onClick={() => handleRedirectToLogin()}><FormatedText id="header.login" /></li>
                                </>
                            }
                        </ul>
                    </div>


                    {/* <div className="header-content-down row">
                        <div className="content-left col-2 " onClick={() => handleRedirectBackToRoute()} >
                            <BiBook className="left-icons" />
                        </div>


                        <Search />

                        <div className="content-right col-2">
                        </div>
                    </div> */}
                </div>
            </div>

        </>
    )
}

export default HomeHeader;
