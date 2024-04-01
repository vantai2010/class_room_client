import FormatedText from "../../components/FormatedText/FormatedText";
import { useState } from "react";
import { languages, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import "./AccountLinkOfStudent.scss"
import Avatar from "../../components/Avatar";
import { CiSquarePlus } from "react-icons/ci";
import { Modal } from 'antd';

function AccountLinkOfStudent() {
    const language = useSelector(state => state.app.language)
    const [isModalCreateAccLinkOpen, setIsModalCreateAccLinkOpen] = useState(false);


    return (
        <>
            <Modal title={language === languages.EN ? "Create new assignment" : "Tạo mới bài tập"}
                width={800}
                open={isModalCreateAccLinkOpen}
                onOk={() => setIsModalCreateAccLinkOpen(false)}
                onCancel={() => setIsModalCreateAccLinkOpen(false)}
            >
                <div className="row">
                    <div className="col-6">
                        <label>Tên người dùng hoặc email: </label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="col-12">
                        <div className="container">
                            <div className="list-person-search row">
                                <div className="col-4">
                                    <div className="each-person-search">
                                        <Avatar />
                                        <span>tên người</span>
                                        <CiSquarePlus className="btn-plus-teacher" />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="each-person-search">
                                        <Avatar />
                                        <span>tên người</span>
                                        <CiSquarePlus className="btn-plus-teacher" />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="each-person-search">
                                        <Avatar />
                                        <span>tên người</span>
                                        <CiSquarePlus className="btn-plus-teacher" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Modal>

            <div className="container account-link">
                <div className="row">
                    <div className="col-12">
                        <p className="title">Liên kết tài khoản</p>
                    </div>
                    <div className="col-12 mt-3">
                        <button className="btn btn-primary" onClick={() => setIsModalCreateAccLinkOpen(true)}>Thêm liên kết</button>
                    </div>
                    <div className="col-12">
                        <div className="asigment-title">
                            <p>Tài khoản đã liên kết</p>
                            <p>Số lượng: 100</p>
                        </div>
                    </div>
                    <div className="col-4 mt-3">
                        <div className="each-account-link">
                            <Avatar />
                            <p className="ml-3">Tên phụ huynh</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AccountLinkOfStudent;
