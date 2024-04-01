import React, { useEffect, useState } from 'react'
import HomeHeader from '../../HomePage/HomeHeader'
import HomeFooter from '../../HomePage/HomeFooter'
import { getCartByStatusIdService } from '../../../service/appService'
import { status_cart, languages, NAME_BACK_LOCATION, SCROLL_BACK_LOCATION } from '../../../utils/constant'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import FormatedText from '../../../components/FormatedText/FormatedText'
import { useLocation, useNavigate } from 'react-router'
import { textEN } from '../../../translations/en'
import { textVI } from '../../../translations/vi'
import { Modal } from 'antd';
import moment from "moment";
import _ from "lodash"



// import '../../HomePage/HomePage.scss'

export default function HistoryTransaction() {
    const language = useSelector(state => state.app.language)
    const socketNotify = useSelector(state => state.auth.socketNotify)
    const userInfor = useSelector(state => state.auth.userInfor)
    const location = useLocation()
    const navigate = useNavigate()
    const [listBorrowing, setListBorrowing] = useState([])
    const [listBookProcessing, setListBookProcessing] = useState([])
    const [showModalExtendTime, setShowModalExtendTime] = useState(false)
    const [returnDate, setReturnDate] = useState('')
    const [errMessage, setErrMessage] = useState("")

    const getListCart = async () => {
        let resBorrowing = await getCartByStatusIdService(status_cart.BORROWING)
        let resProcessing = await getCartByStatusIdService(status_cart.WAITING)

        if (resProcessing && resProcessing.data && resProcessing.data.errCode === 0) {
            setListBookProcessing(resProcessing.data.data)
        } else {
            toast.error(language === languages.EN ? resProcessing.data.messageEN : resProcessing.data.messageVI)
        }
        if (resBorrowing && resBorrowing.data && resBorrowing.data.errCode === 0) {
            setListBorrowing(resBorrowing.data.data)
        } else {
            toast.error(language === languages.EN ? resBorrowing.data.messageEN : resBorrowing.data.messageVI)
        }

    }

    useEffect(() => {
        getListCart()
    }, [])

    useEffect(() => {
        if (location && location.state && location.state.scroll_Y) {
            window.scrollTo(0, location.state.scroll_Y)
        }
    }, [])

    const handleRedirect = (id) => {
        localStorage.setItem(SCROLL_BACK_LOCATION, window.scrollY)
        localStorage.setItem(NAME_BACK_LOCATION, '/history-transaction')
        navigate(`/infor-book/${id}`)
    }

    const handleExtendTime = (event, item) => {
        event.stopPropagation()
        setShowModalExtendTime(true)
    }

    // const handleSubmitExtendTime =  (event, item) => {
    //     event.stopPropagation()
    //     if (_.isEmpty(userInfor)) {
    //         return toast(language === languages.EN ? 'You must be logged in to use this function' : 'Bạn phải đăng nhập mới có thể dùng chức năng này')
    //     }
    //     if (!returnDate) {
    //         setErrMessage(language === languages.EN ? 'Missing' : "Còn thiếu")
    //         return
    //     }

    //     if (!moment(returnDate, 'DD-MM-YYYY', true).isValid()) {
    //         setErrMessage(language === languages.EN ? 'This field should look like 03-12-2022' : "Trường này phải có dạng như 03-12-2022")
    //         return
    //     }
    //     // let nowTime = moment(Date.now()).format('HH:mm-DD-MM-YYYY')
    //     // let res = await handleBorrowListBooksService({
    //     //     listBooks: listBook,
    //     //     time: nowTime,
    //     //     returnDateListBooks: returnDateListBooks
    //     // })
    //     // if (res && res.data && res.data.errCode === 0) {
    //     //     toast.success(language === languages.EN ? res.data.messageEN : res.data.messageVI)
    //     //     setShowModalBorrowListBooks(false)
    //     //     dispatch(fetchListCartsThunk())
    //     //     setReturnDate('')
    //     //     setErrMessage('')
    //     socketNotify?.emit('send-request-extend-time', { senderId: userInfor.id, cartId: item.id })
    //     socketNotify?.on("response-extend-time", () => {

    //     })
    //     // } else {
    //     //     toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
    //     // }
    // }

    return (
        <>
            {/* <Modal title={language === languages.EN ? textEN.bookInfor.checkTitle : textVI.bookInfor.checkTitle}
                open={showModalExtendTime}
                onOk={handleSubmitExtendTime}
                onCancel={() => setShowModalExtendTime(false)}
                width={600}
            >
                <div className="form-group">
                    <label><FormatedText id="bookInfor.enterReturnDate" /></label>
                    <input className="form-control" type="text"
                        value={returnDate}
                        onChange={e => setReturnDate(e.target.value)}
                    />
                    <p style={{ color: 'red' }}>{errMessage}</p>
                </div>
            </Modal> */}
            <HomeHeader />
            <div className="homepage-container">
                <div className="product-container">
                    <div className="product-content container">
                        <div className="product-content-up">
                            <h2 className=""><FormatedText id="extraInforUser.listBookInProcessing" /></h2>
                        </div>
                        <div className="product-content-down mt-5 container">
                            <div className="book-content row">
                                {
                                    listBookProcessing && listBookProcessing.length >= 4 &&
                                    listBookProcessing.map(item => {
                                        return (
                                            <div className="col-md-4 col-6 col-sm-6 col-lg-3" onClick={() => handleRedirect(item.bookId)} key={item.id}>
                                                <div className="book-image">
                                                    <img src={item.bookCartData?.image} />
                                                    <p className='book-name'>{item.bookCartData?.name}</p>
                                                    <p><FormatedText id="bookInfor.author" />: {item.bookCartData?.authorData?.name}</p>
                                                    <p><FormatedText id="bookInfor.borrowed" /> {item.bookCartData?.borrowed} <FormatedText id="bookInfor.times" /></p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="book-content list-short row">
                                {
                                    listBookProcessing && listBookProcessing.length < 4 && listBookProcessing.length > 0 &&
                                    listBookProcessing.map(item => {
                                        return (
                                            <div onClick={() => handleRedirect(item.bookId)} key={item.id}>
                                                <div className="book-image">
                                                    <img src={item.bookCartData?.image} />
                                                    <p className='book-name'>{item.bookCartData?.name}</p>
                                                    <p><FormatedText id="bookInfor.author" />: {item.bookCartData?.authorData?.name}</p>
                                                    <p><FormatedText id="bookInfor.borrowed" /> {item.bookCartData?.borrowed} <FormatedText id="bookInfor.times" /></p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            {
                                listBookProcessing && listBookProcessing.length === 0 &&
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <p style={{ textAlign: 'center', color: 'blue', fontSize: '15px' }}><FormatedText id="extraInforUser.noData" /></p>
                                </div>
                            }
                        </div>

                        <div className="product-content-up">
                            <h2 className=""><FormatedText id="extraInforUser.listBookBorrowing" /></h2>
                        </div>
                        <div className="product-content-down mt-5 container">
                            <div className="book-content row">
                                {
                                    listBorrowing && listBorrowing.length >= 4 &&
                                    listBorrowing.map(item => {
                                        return (
                                            <div className="col-md-4 col-6 col-sm-6 col-lg-3" onClick={() => handleRedirect(item.bookId)} key={item.id}>
                                                <div className="book-image">
                                                    <img src={item.bookCartData?.image} />
                                                    <p className='book-name'>{item.bookCartData?.name}</p>
                                                    <p><FormatedText id="bookInfor.author" />: {item.bookCartData?.authorData?.name}</p>
                                                    <p><FormatedText id="manage.returnDate" />: {item.returnDate} </p>
                                                    {/* <button className='btn-extend-time' onClick={(e) => handleExtendTime(e, item)}><FormatedText id="bookInfor.extend" /></button> */}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className="book-content list-short row">
                                {
                                    listBorrowing && listBorrowing.length < 4 && listBorrowing.length > 0 &&
                                    listBorrowing.map(item => {
                                        return (
                                            <div className="col-md-4 col-6 col-sm-6 col-lg-3" onClick={() => handleRedirect(item.bookId)} key={item.id}>
                                                <div className="book-image">
                                                    <img src={item.bookCartData?.image} />
                                                    <p className='book-name'>{item.bookCartData?.name}</p>
                                                    <p><FormatedText id="bookInfor.author" />: {item.bookCartData?.authorData?.name}</p>
                                                    <p><FormatedText id="manage.returnDate" />: {item.returnDate}</p>
                                                    {/* <button className='btn-extend-time' onClick={(e) => handleExtendTime(e, item)}><FormatedText id="bookInfor.extend" /></button> */}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {
                                listBorrowing && listBorrowing.length === 0 &&
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <p style={{ textAlign: 'center', color: 'blue', fontSize: '15px' }}><FormatedText id="extraInforUser.noData" /></p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div >
            <HomeFooter />
        </>
    )
}
