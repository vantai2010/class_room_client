import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { handleLogoutAccount } from '../../store/slice/authSlice'
import { languages, path } from '../../utils/constant'
import { changeLanguage } from '../../store/slice/appSlice'
import _ from 'lodash'
import { AiOutlineHome, AiOutlineLogout } from "react-icons/ai";
import './Header.scss'
import { useNavigate } from 'react-router'
import FormatedText from '../../components/FormatedText/FormatedText'
import Notifycation from '../Notifycation'

export default function Header() {
    const language = useSelector(state => state.app.language)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleRedirect = (location) => {
        return navigate(location)
    }

    return (
        <div className="header-system-container">

            <div className="header-tabs-container">
                <AiOutlineHome className='btn-home-icon' onClick={() => handleRedirect('/')} />
                <div className='nav-system'>
                    <div className="nav-system-link" onClick={() => handleRedirect(path.ROOT_ADMIN + path.ADMIN.MANAGE_USER)}>Quản lý người dùng</div>
                    <div className="nav-system-link" onClick={() => handleRedirect(path.ROOT_ADMIN + path.ADMIN.MANAGE_CLASS)}>Quản lý lớp</div>
                    <div className="nav-system-link" onClick={() => handleRedirect('/system/manage-book')}>Quản lý câu hỏi</div>
                    <div className="nav-system-link" onClick={() => handleRedirect('/system/manage-author')}>Quản lý điểm số</div>
                </div>
            </div>

            <div className="languages-system">
                {/* <Notifycation /> */}
                <span className={language === languages.VI ? "language-vi active" : "language-vi"} onClick={() => dispatch(changeLanguage(languages.VI))}>VI</span>
                <span className={language === languages.EN ? "language-en active" : "language-en"} onClick={() => dispatch(changeLanguage(languages.EN))}>EN</span>

                <div className="btn btn-logout" onClick={() => dispatch(handleLogoutAccount())}>
                    <AiOutlineLogout className='btn-logout-content' title="logout" onClick={() => { dispatch(handleLogoutAccount()); handleRedirect('/'); }} />
                </div>
            </div>

        </div>
    )
}
