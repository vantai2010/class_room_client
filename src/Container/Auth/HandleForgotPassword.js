import React, { useEffect } from 'react'
import './HandleForgotPassword.scss'
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { languages } from '../../utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { handleChangePasswordThunk } from '../../store/slice/authSlice';
import Loading from '../../components/Loading';
import FormatedText from '../../components/FormatedText/FormatedText';
import { IoIosEye } from 'react-icons/io'
import { IoIosEyeOff } from 'react-icons/io'
import { changeLanguage } from '../../store/slice/appSlice';
import { useLocation } from 'react-router-dom';

export default function HandleForgotPassword() {
    const dispatch = useDispatch()
    const language = useSelector(state => state.app.language)
    const isLoading = useSelector(state => state.auth.isLoading)
    const navigate = useNavigate()
    const location = useLocation()
    const question = new URLSearchParams(location.search)
    const params = useParams()
    const handleOnchaneState = () => {
        document.getElementsByClassName("hand-dog-left")[0].style.top = "80px";
        document.getElementsByClassName("hand-dog-left")[0].style.transform =
            "rotate(200deg)";
        document.getElementsByClassName("eye-dog-left")[0].style.backgroundColor =
            "#3befe6";
        document.getElementsByClassName(
            "eye-dog-left-up"
        )[0].style.backgroundColor = "#3befe6";

        document.getElementsByClassName("hand-dog-right")[0].style.top = "80px";
        document.getElementsByClassName("hand-dog-right")[0].style.transform =
            "rotate(170deg)";
        document.getElementsByClassName("eye-dog-right")[0].style.backgroundColor =
            "#26e8ed";
        document.getElementsByClassName(
            "eye-dog-right-up"
        )[0].style.backgroundColor = "#26e8ed";
    };

    useEffect(() => {
        dispatch(changeLanguage(params.language))
    }, [])

    const [inputForm, setInputForm] = useState({
        newPassword: '',
        reNewPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)

    const handleOnchaneFormInput = (event, key) => {
        setInputForm({
            ...inputForm,
            [key]: event.target.value
        })
    }

    const handleConfirm = async () => {
        let { newPassword, reNewPassword } = inputForm
        if (!newPassword) {
            return toast.info(language === languages.EN ? "Please enter new password" : "Vui lòng nhập mật khẩu mới")
        }
        if (!reNewPassword) {
            return toast.info(language === languages.EN ? "Please enter re-password" : "Vui lòng nhập lại mật khẩu")
        }
        if (newPassword !== reNewPassword) {
            return toast.info(language === languages.EN ? "Re-entered password is incorrect" : "Mật khẩu nhập lại không đúng")
        }
        let response = await dispatch(handleChangePasswordThunk({
            email: params.email,
            phoneNumber: params.phoneNumber,
            newPassword: inputForm.newPassword,
        }))
        let data = unwrapResult(response)
        if (data && data.result === true) {
            toast.success(language === languages.EN ? data.messageEN : data.messageVI)
            return navigate('/login')
        } else {
            toast.error(language === languages.EN ? data.messageEN : data.messageVI)
        }
    }


    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleConfirm()
        }
    }


    return (
        <>
            {
                isLoading ? <Loading /> :
                    <div className="dog-container">
                        <div className="dog-content">
                            {/* Tai */}
                            <div className="ears-dog-left"></div>
                            <div className="ears-dog-right"></div>
                            {/* Mắt */}
                            <div className="eye-dog-left">
                                <div className="eye-dog-left-up"></div>
                            </div>
                            <div className="eye-dog-right">
                                <div className="eye-dog-right-up"></div>
                            </div>
                            {/* Mũi */}
                            <div className="nose-dog">
                                <div></div>
                            </div>
                            {/* Miệng */}
                            <div className="mouth-dog">
                                <div></div>
                            </div>
                            {/* Tay */}
                            <div className="hand-dog-container">
                                <div className="hand-dog-content">
                                    <div className="hand-dog-left">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <div className="hand-dog-right">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                            <div className="dog-input-container">
                                <div className="dog-input-content">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={language === languages.EN ? 'Enter new password' : 'Nhập mật khẩu mới'}
                                        value={inputForm.newPassword}
                                        onChange={(e) => { handleOnchaneState(); handleOnchaneFormInput(e, 'newPassword') }}
                                    />
                                    {
                                        showPassword ?
                                            <IoIosEye className='icon-for-enter-password' onClick={() => setShowPassword(false)} /> :
                                            <IoIosEyeOff className='icon-for-enter-password' onClick={() => { setShowPassword(true) }} />
                                    }
                                </div>
                                <div className="dog-input-up">
                                    <input
                                        type={showRePassword ? 'text' : 'password'}
                                        placeholder={language === languages.EN ? 'Re enter new password' : 'Nhập lại mật khẩu mới'}
                                        value={inputForm.reNewPassword}
                                        onChange={(e) => { handleOnchaneState(); handleOnchaneFormInput(e, 'reNewPassword') }}
                                        onKeyDown={(e) => handleEnter(e)}
                                    />
                                    {
                                        showRePassword ?
                                            <IoIosEye className='icon-for-enter-re-password' onClick={() => setShowRePassword(false)} /> :
                                            <IoIosEyeOff className='icon-for-enter-re-password' onClick={() => { setShowRePassword(true) }} />
                                    }
                                </div>
                                <div className="dog-input-down">
                                    <button onClick={handleConfirm}><FormatedText id="login.confirm" /></button>
                                </div>
                            </div>
                        </div>
                    </div>

            }
        </>
    )
}
