// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import { fetchListGenderThunk, fetchListRoleThunk } from '../../../store/slice/appSlice';
// import { languages } from '../../../utils/constant';
// import { toast } from 'react-toastify';
// import FormatedText from '../../../components/FormatedText/FormatedText';
// import CommonUtils from '../../../utils/CommonUtils'
// import { handleUpdateAuthorService } from '../../../service/appService';
// import './Modal.scss';
// import { textEN } from '../../../translations/en';
// import { textVI } from '../../../translations/vi';
// import Select from 'react-select';
// import _ from 'lodash'
// import moment from 'moment';
// import Loading from "../../../components/Loading"

// export default function ModalUpdateAuthor({ isOpen, toggle, className, setKeyRefToNewUser, author, listGenders }) {
//     const language = useSelector(state => state.app.language)
//     let selectedObtionGender = {}
//     if (language === languages.EN) {
//         selectedObtionGender = {
//             value: author.genderId,
//             label: !_.isEmpty(author.genderAuthorData) && author.genderAuthorData.valueEn
//         }
//     }
//     if (language === languages.VI) {
//         selectedObtionGender = {
//             value: author.genderId,
//             label: !_.isEmpty(author.genderAuthorData) && author.genderAuthorData.valueVi
//         }
//     }
//     const [inputForm, setInputForm] = useState({
//         name: author.name,
//         birthDay: author.birthDay,
//         description: author.description
//     })
//     const [image, setImage] = useState(author.image)
//     const [obtionGender, setObtionGender] = useState([])
//     const [selectedGender, setSelectedGender] = useState(selectedObtionGender)
//     const [errMessage, setErrMessage] = useState({
//         name: '',
//         birthDay: '',
//         description: '',
//         genderId: '',
//         image: ''
//     })
//     const [isLoading, setIsLoading] = useState(false)
//     useEffect(() => {
//         let gender = []
//         if (listGenders && listGenders.length > 0) {
//             if (language === languages.EN) {
//                 listGenders.forEach(author => {
//                     let obtions = {}
//                     obtions.value = author.keyMap
//                     obtions.label = author.valueEn
//                     gender.push(obtions)
//                 })
//             }
//             if (language === languages.VI) {
//                 listGenders.forEach(author => {
//                     let obtions = {}
//                     obtions.value = author.keyMap
//                     obtions.label = author.valueVi
//                     gender.push(obtions)
//                 })
//             }
//         }
//         setObtionGender(gender)
//     }, [listGenders, language])



//     useEffect(() => {
//         setInputForm({
//             name: author.name,
//             birthDay: author.birthDay,
//             description: author.description,
//         })
//         setImage(author.image)
//         setSelectedGender(selectedObtionGender)
//     }, [author])

//     const handleOnchange = (type, even) => {
//         setInputForm({ ...inputForm, [type]: even.target.value })
//     }

//     const handleClose = () => {
//         setInputForm({
//             name: author.name,
//             birthDay: author.birthDay,
//             description: author.description
//         })
//         setImage(author.image)
//         setErrMessage({
//             name: '',
//             birthDay: '',
//             description: '',
//             image: ''
//         })
//         setSelectedGender(selectedObtionGender)
//         toggle()
//     }

//     const handleOnchangeImage = async (e) => {
//         let data = e.target.files
//         let file = data[0]
//         if (file) {
//             let base64 = await CommonUtils.getBase64(file)
//             // let objectUrl = URL.createObjectURL(file)
//             setImage(base64)
//             // setPreviewImgUrl(objectUrl)

//         }

//     }

//     const handleUpdateAuthor = async () => {
//         let { name, birthDay, description } = inputForm
//         if (!name) {
//             setErrMessage({
//                 name: '',
//                 birthDay: '',
//                 description: '',
//                 genderId: '',
//                 image: '',
//                 name: language === languages.EN ? 'Missing' : 'Còn thiếu'
//             })
//             return
//         }
//         if (!birthDay) {
//             setErrMessage({
//                 name: '',
//                 birthDay: '',
//                 description: '',
//                 genderId: '',
//                 image: '',
//                 birthDay: language === languages.EN ? 'Missing' : 'Còn thiếu'
//             })
//             return
//         }
//         if (!description) {
//             setErrMessage({
//                 name: '',
//                 birthDay: '',
//                 description: '',
//                 genderId: '',
//                 image: '',
//                 description: language === languages.EN ? 'Missing' : 'Còn thiếu'
//             })
//             return
//         }
//         if (!selectedGender.value) {
//             setErrMessage({
//                 name: '',
//                 birthDay: '',
//                 description: '',
//                 genderId: '',
//                 image: '',
//                 genderId: language === languages.EN ? 'Missing' : 'Còn thiếu'
//             })
//             return
//         }
//         if (!image) {
//             setErrMessage({
//                 name: '',
//                 birthDay: '',
//                 description: '',
//                 genderId: '',
//                 image: '',
//                 image: language === languages.EN ? 'Missing' : 'Còn thiếu'
//             })
//             return
//         }
//         if (!isNaN(name)) {
//             setErrMessage({
//                 name: '',
//                 birthDay: '',
//                 description: '',
//                 genderId: '',
//                 image: '',
//                 name: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
//             })
//             return
//         }
//         if (!moment(birthDay, 'DD-MM-YYYY', true).isValid()) {

//             setErrMessage({
//                 name: '',
//                 birthDay: '',
//                 description: '',
//                 genderId: '',
//                 image: '',
//                 birthDay: language === languages.EN ? 'This field should look like 03-12-2022' : "Trường này phải có dạng như 03-12-2022"
//             })
//             return
//         }
//         try {
//             setIsLoading(true)
//             let response = await handleUpdateAuthorService({
//                 ...inputForm,
//                 id: author.id,
//                 genderId: selectedGender.value,
//                 image
//             })
//             setIsLoading(false)
//             if (response && response.result === true) {
//                 toast.success(language === languages.EN ? response.messsageEN : response.messsageVI)
//                 setKeyRefToNewUser(inputForm.name + inputForm.birthDay)
//                 handleClose()
//             } else {
//                 toast.error(language === languages.EN ? response.messsageEN : response.messsageVI)
//             }
//         } catch (error) {
//             console.log(error)
//         }


//     }


//     const handleChangeGender = (obtionSelect) => {
//         setSelectedGender(obtionSelect)
//     }


//     return (
//         <>
//         {
//             isLoading && <Loading />
//         }
//         <Modal
//             isOpen={isOpen}
//             toggle={handleClose}
//             className={className}
//             size={'lg'}
//         >
//             <ModalHeader toggle={handleClose}><FormatedText id="modal.titleUpdateAuthor" /></ModalHeader>
//             <ModalBody>

//                 <div className="container">
//                     <div className="row">
//                         <div className="col-12 mb-3"><FormatedText id="manage.addAuthor" /></div>
//                         <div className="col-6">
//                             <label><FormatedText id="manage.name" /></label>
//                             <input value={inputForm.name} onChange={(e) => handleOnchange('name', e)} className="form-control" type="text" />
//                             <p style={{ color: 'red' }}>{errMessage.name}</p>
//                         </div>
//                         <div className="col-6">
//                             <label><FormatedText id="manage.birthDay" /></label>
//                             <input value={inputForm.birthDay} onChange={(e) => handleOnchange('birthDay', e)} className="form-control" type="text"
//                                 placeholder={language === languages.EN ? textEN.manage.placeHoderBirthDay : textVI.manage.placeHoderBirthDay}
//                             />
//                             <p style={{ color: 'red' }}>{errMessage.birthDay}</p>

//                         </div>
//                         <div className="col-6">
//                             <label><FormatedText id="manage.description" /></label>
//                             <textarea value={inputForm.description} onChange={(e) => handleOnchange('description', e)} className="form-control" />
//                             <p style={{ color: 'red' }}>{errMessage.description}</p>

//                         </div>
//                         <div className="col-3">
//                             <label><FormatedText id="manage.gender" /></label>
//                             <Select
//                                 value={selectedGender}
//                                 onChange={handleChangeGender}
//                                 options={obtionGender}
//                             />
//                             <p style={{ color: 'red' }}>{errMessage.genderId}</p>

//                         </div>
//                         <div className="col-3">
//                             <label><FormatedText id="manage.image" /></label>
//                             <p style={{ color: 'red' }}>{errMessage.image}</p>

//                             <div className="preview-img-container">
//                                 <input id="choise-image" className="form-control" type="file" hidden
//                                     onChange={(e) => handleOnchangeImage(e)}
//                                 />
//                                 <label htmlFor="choise-image" className="btn-choise-image"><FormatedText id="manage.choise" /><i className="fas fa-upload"></i></label>
//                                 <div className="preview-image" style={{ backgroundImage: `url(${image})` }}>
//                                     {/* <img className="preview-image" src={`${this.state.previewImgUrl}`}/> */}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </ModalBody>
//             <ModalFooter>
//                 <Button className='btn-close' onClick={handleClose}><FormatedText id="modal.close" /></Button>
//                 <Button color="primary" className='btn-create' onClick={() => handleUpdateAuthor()}><FormatedText id="modal.update" /></Button>
//             </ModalFooter>
//         </Modal>
//         </>
//     )
// }
