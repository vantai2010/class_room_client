import './App.scss';
import { Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import HomePage from './HomePage/HomePage';
import Home from '../Routers/Home'
import Register from './Auth/Register'
import Login from './Auth/Login'
import EnterInforUser from './Auth/EnterInforUser';
import HandleForgotPassword from './Auth/HandleForgotPassword';
import Authenticate from '../Container/Auth/Authenticate'
import System from '../Routers/System';
import ManageUser from './System/ManageUser';
import NotFound from './NotFound';
import ClassOfTeacher from './Teacher/ClassOfTeacher';
import QuestionDictionary from './Teacher/QuestionDictionary';
import DetailClassOfTeacher from './Teacher/DetailClassOfTeacher';
import Contact from './Contact';
import ClassOfStudent from './Student/ClassOfStudent';
import DetailClassOfStudent from './Student/DetailClassOfStudent';
import MissionStudent from './Student/MissionStudent';
import DetailAssignment from './Student/DetailAssignment';
import ClassOfParents from './Parents/ClassOfParents';
import DetailClassOfParents from './Parents/DetailClassOfParents';
import MissionParents from './Parents/MissionParents';
import AccountLinkOfParents from './Parents/AccountLinkOfParents';
import AccountLinkOfStudent from './Student/AccountLinkOfStudent';

import { path } from '../utils/constant';
import WorkForm from './Student/WorkForm'
import ManageClass from './System/ManageClass';
import DetailExam from './Student/DetailExam';
import MonitorTheExam from './Teacher/MonitorTheExam';
import Exam from './Exam/Exam';
import FormExam from './Exam/FormExam';


function App() {

  return (
    <>
      <Authenticate>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.REGISTER} element={<Register />} />
          <Route path={path.HOMEPAGE} element={<HomePage />}>
            <Route path={path.TEACHER.MY_CLASS} element={<ClassOfTeacher />} />
            <Route path={path.TEACHER.DETAIL_CLASS + "/:id/:level"} element={<DetailClassOfTeacher />} />
            <Route path={path.TEACHER.QUESTION_DICTIONARY} element={<QuestionDictionary />} />
            <Route path={path.TEACHER.MONITOR_THE_EXAM} element={<MonitorTheExam />} />

            <Route path={path.STUDENT.MY_CLASS} element={<ClassOfStudent />} />
            <Route path={path.STUDENT.DETAIL_CLASS + "/:id"} element={<DetailClassOfStudent />} />
            <Route path={path.STUDENT.DETAIL_ASSIGNMENT + "/:id"} element={<DetailAssignment />} />
            <Route path={path.STUDENT.DETAIL_EXAM + "/:id"} element={<DetailExam />} />
            <Route path={path.STUDENT.WORK_FORM + "/:id"} element={<WorkForm />} />
            <Route path={path.STUDENT.FORM_EXAM + "/:id"} element={<FormExam />} />
            <Route path={path.STUDENT.MISSION} element={<MissionStudent />} />
            <Route path={path.STUDENT.ACCOUNT_LINK} element={<AccountLinkOfStudent />} />

            <Route path={path.PARENTS.MY_CLASS} element={<ClassOfParents />} />
            <Route path={path.PARENTS.DETAIL_CLASS + "/:id"} element={<DetailClassOfParents />} />
            <Route path={path.PARENTS.MISSION} element={<MissionParents />} />
            <Route path={path.PARENTS.ACCOUNT_LINK} element={<AccountLinkOfParents />} />


            <Route path={path.CONTACT} element={<Contact />} />
            <Route path={path.EXAM + "/:id"} element={<Exam />} />
          </Route>
          <Route path="/auth/forgot-password/:email/:phoneNumber/:language" element={<HandleForgotPassword />} />
          <Route path="/register/extra-infor/:email/:language" element={<EnterInforUser />} />
          <Route path={path.SYSTEM} element={<System />} >
            <Route path={path.ADMIN.MANAGE_USER} element={<ManageUser />} />
            <Route path={path.ADMIN.MANAGE_CLASS} element={<ManageClass />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Authenticate>
    </>
  )
}

export default App;
