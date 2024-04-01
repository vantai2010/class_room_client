import Avatar from "../components/Avatar";
import { TbSend } from "react-icons/tb";
import "./Contact.scss"


function Contact() {


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <p className="title">Tương tác</p>
                    </div>
                    <div className="col-4">
                        <div className="group-contact-container">
                            <div className="each-contact selected">
                                <Avatar />
                                <div className="infor-user ml-2">
                                    <span>Tên người</span> <br />
                                    <span>ko đùa đc đâu</span>
                                </div>
                            </div>

                            <div className="each-contact">
                                <div className="avatar-contact">
                                    <Avatar />
                                    <div className="status-user online"></div>
                                </div>
                                <div className="infor-user ml-2">
                                    <span>Tên người</span> <br />
                                    <span>ko đùa đc đâu</span>
                                </div>
                            </div>

                            <div className="each-contact ">
                                <Avatar />
                                <div className="infor-user ml-2">
                                    <span>Tên người</span> <br />
                                    <span>ko đùa đc đâu</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="group-contact-container">
                            <div className="content-top">
                                <Avatar />
                                <div className="infor-user ml-2">
                                    <span>Tên người</span>
                                </div>
                            </div>
                            <div className="content-center">
                                <div className="each-mess">
                                    <div className="avatar-mess">
                                        <Avatar />
                                    </div>
                                    <div className="content-mess">
                                        <span>span</span> <br />
                                        <span className="time">10:04</span>
                                    </div>
                                </div>

                                <div className="each-mess">
                                    <div className="avatar-mess">
                                        <Avatar />
                                    </div>
                                    <div className="content-mess">
                                        <span>span</span> <br />
                                        <span className="time">10:04</span>
                                    </div>
                                </div>

                                <div className="each-mess">
                                    <div className="avatar-mess">
                                        <Avatar />
                                    </div>
                                    <div className="content-mess">
                                        <span>span</span> <br />
                                        <span className="time">10:04</span>
                                    </div>
                                </div>
                                <div className="each-mess">
                                    <div className="avatar-mess">
                                        <Avatar />
                                    </div>
                                    <div className="content-mess">
                                        <span>span</span> <br />
                                        <span className="time">10:04</span>
                                    </div>
                                </div>
                                <div className="each-mess">
                                    <div className="avatar-mess">
                                        <Avatar />
                                    </div>
                                    <div className="content-mess">
                                        <span>span</span> <br />
                                        <span className="time">10:04</span>
                                    </div>
                                </div>
                                <div className="each-mess">
                                    <div className="avatar-mess">
                                        <Avatar />
                                    </div>
                                    <div className="content-mess">
                                        <span>span</span> <br />
                                        <span className="time">10:04</span>
                                    </div>
                                </div>
                                <div className="each-mess">
                                    <div className="avatar-mess">
                                        <Avatar />
                                    </div>
                                    <div className="content-mess">
                                        <span>span</span> <br />
                                        <span className="time">10:04</span>
                                    </div>
                                </div>
                                <div className="each-mess">
                                    <div className="avatar-mess">
                                        <Avatar />
                                    </div>
                                    <div className="content-mess">
                                        <span>span</span> <br />
                                        <span className="time">10:04</span>
                                    </div>
                                </div>

                                <div className="each-mess me">
                                    <div className="avatar-mess">
                                        <Avatar />
                                    </div>
                                    <div className="content-mess">
                                        <span>span</span> <br />
                                        <span className="time">10:04</span>
                                    </div>
                                </div>
                            </div>
                            <div className="content-bottom">
                                <input type="text" />
                                <div className="btn-send-mess">
                                    <TbSend />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;
