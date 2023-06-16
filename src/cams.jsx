import React,{useState,useRef,useMemo,useCallback,useEffect} from 'react'
import Webcam from "react-webcam";
import { io, Socket } from "socket.io-client";
import {BsMic} from "react-icons/bs"
import {BiWebcam} from "react-icons/bi"
import {MdCallEnd} from "react-icons/md"
import {TbScreenShare} from "react-icons/tb"
import "./video.css"
import "./index.css"


export default function CamLivepeer({url,streamKey,streamName}) {

    const webcamRef = useRef(null);
    const socket = useRef();
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    useEffect(()=>{
      socket.current = io("ws://localhost:5002");
    },[])
    const senders = useRef([]);

  const handleStartCaptureClick = useCallback(() => {
            setCapturing(true);
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm",
            });
            mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
            );
            mediaRecorderRef.current.start();
        }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
        ({ data }) => {
        if (data.size > 0) {
            setRecordedChunks((prev) => prev.concat(data));
        }
        },
        [setRecordedChunks]
    );

  const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current?.stop();
        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
   
     
        const blob = new Blob(recordedChunks, {
            type: 'video/webm;codecs=h264',
        });
        console.log(blob);
    
        if (socket.current.connected) {
          console.log('Connected to the server');
          socket.current.emit("livestream",blob);
        } else {
          console.log('Not connected to the server');
         const newSocket = io("ws://localhost:5002");
         newSocket.emit("livestream",blob);
        }
       

        socket.current.on('disconnect', () => {
          console.log('disconnect disconnected');
         
        });

        socket.current.on('reconnect', () => {
          console.log('Reconnected to the server');
        });
       }
  }, [recordedChunks]);

  useEffect(() => {
        setTimeout(() => {
        handleStartCaptureClick();
        }, 5000);

        setInterval(() => {
        handleStopCaptureClick();
        handleDownload();
        handleStartCaptureClick();
        }, 5000);
    });




     
 const shareScreen=() =>{

      
      navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
          const screenTrack = stream.getTracks()[0];
          senders.current.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
          screenTrack.onended = function() {
              senders.current.find(sender => sender.track.kind === "video").replaceTrack(userStream.current.getTracks()[1]);
          }
      })
    }

  return (
    <div>
        <Webcam audio={true} ref={webcamRef} />
        <button onClick={shareScreen}>Share screen</button>

    </div>
  )
}
