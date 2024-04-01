import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import Header from '../Container/System/Header';
import { useSelector } from 'react-redux';
import { path, roleId } from '../utils/constant';
import { Navigate } from 'react-router';
export default function System() {
    const navigate = useNavigate()
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const userInfor = useSelector(state => state.auth.userInfor)
    useEffect(() => {
        if (isAuthenticated && userInfor.roleId === roleId.ADMIN) {
            return navigate(path.ROOT_ADMIN + path.ADMIN.MANAGE_USER)
        }
        if (isAuthenticated && userInfor.roleId !== roleId.ADMIN) {
            return navigate('/')
        }
        if (isAuthenticated === false) {
            return navigate('/')
        }
    }, [isAuthenticated, userInfor])

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
