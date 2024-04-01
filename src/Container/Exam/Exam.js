import FormatedText from "../../components/FormatedText/FormatedText";
import { useEffect, useState, useRef } from "react";
import { environment, languages, path, roleId, typeQuestionId } from "../../utils/constant";
import { useSelector } from "react-redux";
import "./FormExam.scss"
import teacherService from "../../service/teacherService";
import { toast } from "react-toastify";
import { Modal } from 'antd';
import Loading from "../../components/Loading"
import { CiClock1 } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import { CiViewList } from "react-icons/ci";
import userService from "../../service/userService";
import FormMonitor from "./FormMonitor";
import { Peer } from "peerjs";
import FormExam from "./FormExam";

function Exam() {
    const params = useParams()
    const userInfor = useSelector(state => state.auth.userInfor)

    const [peerId, setPeerId] = useState('');
    const [connectedPeers, setConnectedPeers] = useState([]);
    const [myStream, setMyStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);

    const canvasRef = useRef();
    const ctxRef = useRef();
    const myVideoRef = useRef();

    const peer = useRef()
    const remoteVideosRef = useRef([]);

    useEffect(() => {
        // Initialize Peer object
        // const peer = new Peer(`${userInfor.id}_${userInfor.roleId}`);
        // // Listen for 'open' event to get peer ID
        // peer.on('open', (id) => {

        //     console.log('My peer ID is: ' + id);
        //     // setPeerId(id);
        // });
        // // Listen for 'error' event
        // peer.on('error', (error) => {
        //     console.error('Error:', error);
        // });

        // // Listen for 'connection' event
        // peer.on('connection', (connection) => {
        //     console.log('Connected to peer:', connection.peer);
        //     setConnectedPeers((prevState) => [...prevState, connection.peer]);
        //     handleDataConnection(connection);
        // });

        // Get user media
        // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        //     .then((stream) => {
        //         // setMyStream(stream);
        //         myVideoRef.current.srcObject = stream;
        //         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        //             .then((stream) => {
        //                 // setMyStream(stream);
        //                 myVideoRef.current.srcObject = stream;
        //                 myVideoRef.current.style.width = "100%";
        //                 myVideoRef.current.style.height = "100%";

        //                 // Answer incoming calls with our media stream
        //                 // peer.on('call', (call) => {
        //                 //     call.answer(stream);
        //                 //     handleCall(call);
        //                 // });
        //             })
        //             .catch((error) => {
        //                 console.error('Error accessing media devices:', error);
        //             });

        //         // Answer incoming calls with our media stream
        //         // peer.on('call', (call) => {
        //         //     call.answer(stream);
        //         //     handleCall(call);
        //         // });
        //     })
        //     .catch((error) => {
        //         console.error('Error accessing media devices:', error);
        //     });

        // ctxRef.current = canvasRef.current.getContext('2d');
        // return () => {
        //     // Disconnect from PeerJS server

        //     peer.disconnect();
        // };
    }, []);


    // const captureFrame = () => {
    //     const video = myVideoRef.current;
    //     const canvas = canvasRef.current;
    //     const ctx = ctxRef.current;

    //     if (video.paused || video.ended) return;

    //     const width = video.videoWidth;
    //     const height = video.videoHeight;

    //     canvas.width = width;
    //     canvas.height = height;
    //     ctx.drawImage(video, 0, 0, width, height);

    //     const imageData = ctx.getImageData(0, 0, width, height);
    //     // Bây giờ bạn có thể xử lý ảnh từ imageData tại đây

    //     requestAnimationFrame(captureFrame);
    // };

    // useEffect(() => {
    //     captureFrame();
    // }, []);




    const handleDataConnection = (connection) => {
        connection.on('data', (data) => {
            console.log('Received:', data);
            // Handle received data
        });
    };

    // Function to handle incoming call
    const handleCall = (call) => {
        call.on('stream', (remoteStream) => {
            console.log('Received remote stream:', remoteStream);
            setRemoteStreams((prevState) => [...prevState, remoteStream]);

            // Display remote stream
            const myVideoRef = document.createElement('video');
            myVideoRef.srcObject = remoteStream;
            myVideoRef.autoplay = true;
            myVideoRef.playsinline = true;
            remoteVideosRef.current.appendChild(myVideoRef);
        });
    };

    // Function to call a peer
    const callPeer = (peerId) => {
        if (!myStream) return;
        const call = peer.current.call(peerId, myStream);
        handleCall(call);
    };
    // ----------------------------------------------------------------

    return (
        <>
            {
                userInfor.roleId === roleId.TEACHER &&
                <FormMonitor myVideoRef={myVideoRef} examId={params.id} />
            }
            {/* {
                userInfor.roleId === roleId.STUDENT &&
                <FormExam myVideoRef={myVideoRef} examId={params.id} canvasRef={canvasRef} />
            } */}
        </>
    );
}

export default Exam;
