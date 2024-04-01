
import "./HomePage.scss";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";

import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { path, roleId } from "../../utils/constant";
import { useEffect } from "react";

function HomePage() {
    const location = useLocation();
    const navigate = useNavigate()
    const userInfor = useSelector(state => state.auth.userInfor)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    useEffect(() => {
        if (!isAuthenticated) {
            return navigate(path.LOGIN)
        }
        if (isAuthenticated && userInfor.roleId === roleId.ADMIN) {
            return navigate(path.ROOT_ADMIN + path.ADMIN.MANAGE_USER)
        }
        if (isAuthenticated && userInfor.roleId === roleId.TEACHER) {
            return navigate(path.TEACHER.MY_CLASS)
        }
        if (isAuthenticated && userInfor.roleId === roleId.STUDENT) {
            return navigate(path.STUDENT.MY_CLASS)
        }
        if (isAuthenticated && userInfor.roleId === roleId.PARENTS) {
            return navigate(path.PARENTS.MY_CLASS)
        }
    }, [isAuthenticated, userInfor])

    const isSubsequence = (str, arr) => {
        return arr.some(sub => str.includes(sub));
    }

    return (
        <>
            <div className="homepage-container">
                {
                    !isSubsequence(location.pathname, [path.STUDENT.WORK_FORM, path.EXAM, path.TEACHER.FORM_MONITOR, path.STUDENT.FORM_EXAM]) &&
                    <HomeHeader />
                }
                <Outlet />
                {
                    !isSubsequence(location.pathname, [path.STUDENT.WORK_FORM, path.EXAM, path.TEACHER.FORM_MONITOR, path.STUDENT.FORM_EXAM]) &&
                    <HomeFooter />
                }
            </div>
        </>
    );
}

export default HomePage;
