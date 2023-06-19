
import React,{useState,useRef,useMemo,useCallback,useEffect} from 'react'
import {BsMic,BsCameraVideo} from "react-icons/bs"
import {BiWebcam} from "react-icons/bi"
import {MdCallEnd} from "react-icons/md"
import {TbScreenShare} from "react-icons/tb"
import { io } from "socket.io-client";
import "./video.css"


export default function CamLivepeer({url}) {
   console.log(url,"url")
    const [active,setActive]=useState("")
   
    let on = false
     
    const [chunks, setchunks] = useState([])
    const [cameraOn, setcameraOn] = useState(true)
    const [muted, setmuted] = useState(false)
    const [elapsedSeconds, setelapsedSeconds] = useState(0)
    const [streamFinished, setstreamFinished] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [userFacing, setuserFacing] = useState(true)


  const CAPTURE_OPTIONS_USER_FACING = {
      audio: true,
      video: {
        height: { min: 720, max: 1280 },
        width: { min: 1080, max: 1920 },
        frameRate: { min: 15, ideal: 24, max: 30 },
        facingMode: 'user',
      },
    }

    const CAPTURE_OPTIONS_RECORD_SCREEN = {
        audio: true,
        video: {
          height: 1080,
          width: 1920,
          frameRate: { ideal: 24, max: 30 },
        },
      }

      const startTimer = () => {
        console.log("init1")
        if (on) return
        timer.current = accurateTimer(() => {
          setelapsedSeconds((elapsedSeconds) => elapsedSeconds + 1)
          on = true
          let seconds = elapsedSeconds % 60
          seconds = seconds > 9 ? seconds : `0${seconds}`
          // console.log(`${elapsedSeconds} seconds have passed.`)
        })
      }
    
      const stopTimer = () => {
        console.log("init2")
        if (on) console.log('Timer Stopped')
        on = false
        timer.current.cancel()
      }
      


     
    let timer = useRef(null)
    const socket = useRef();
    const videoRef = useRef()
    const mediaRecorder = useRef()
    let stream = useRef(null)
    let liveStream
    let tempStream = new MediaStream()

    useEffect(() => {
        camera()
       
      }, [])

      async function screen() {
        // stream.current = await navigator.mediaDevices.getDisplayMedia(
        //   CAPTURE_OPTIONS_RECORD_SCREEN
        // )
        // stream.current.replaceVideoTrack(stream.current.getVideoTracks()[0])

        navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
          const screenTrack = stream.getTracks()[0]
          // senders.current.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
          // screenTrack.onended = function() {
          //     senders.current.find(sender => sender.track.kind === "video").replaceTrack(userStream.current.getTracks()[1]);
          // }
          const mediaStream = new MediaStream([screenTrack]);
          // var socket =new WebSocket("wss://docker.freetyl.io/rtmp://rtmp.livepeer.com/live/d40f-3nc3-sl74-ja7t")
          var socket =new WebSocket(url)
       
          mediaRecorder.current = new MediaRecorder(mediaStream, {
            mimeType: 'video/webm;codecs=h264',
            // mimeType: 'video/webm;codecs=vp8,opus',
            videoBitsPerSecond: 3 * 1024 * 1024,
          })
          mediaRecorder.current.ondataavailable = (e) => {
            socket.onopen=(event)=>{
        
        
  
              if ( socket?.readyState === 3 ) {
               console.log("Websocket closed")
               socket.close()
               
               var newSocket =new WebSocket(url)
               
              
              
                newSocket.send(e.data);
                console.log('send data', e.data)
                
              }else{
               console.log(socket.readyState,"else")
               socket.send(e.data);
               console.log('send data', e.data)
              }
             }
            // socket.current.send(e.data)
            // chunks.push(e.data)
            console.log('send data', e.data)
          }
          // Start recording, and dump data every second
          mediaRecorder.current.start(5000)
      })
      }

      const toggleCamera = () => {
        console.log("inithh")
        setcameraOn(!cameraOn)
        // stream.current.getVideoTracks()[0].enabled =
        //   !stream.current.getVideoTracks()[0].enabled
      }
    
      const toggleMicrophone = () => {
        setmuted(!muted)
        stream.current.getAudioTracks()[0].enabled =
          !stream.current.getAudioTracks()[0].enabled
      }
      
      const getDeviceMedia=(theStream)=>{
        stream =theStream;
        
        // videoEl.current.srcObject= stream;
         videoRef.current.srcObject = theStream
      //   console.log(theStream.addTrack())
      //  stream.current.replaceVideoTrack(theStream.getAudioTracks()[0])
      //  stream.current.replaceAudioTrack(theStream.getAudioTracks()[0])
       
        // videoRef.current.srcObject = theStream
      }

      async function camera() {
        // stream.current = await navigator.mediaDevices.getUserMedia(
        //   CAPTURE_OPTIONS_USER_FACING
        // )
        const constraints = { video: true, audio: true,};
        navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS_USER_FACING)
        .then(getDeviceMedia)
        .catch(e => { console.error('getUserMedia() failed: ' + e); });
      }

      const startRecording = () => {
   
       
        toggleActive()
        recorderInit()
        startTimer()
       
      }

      const stopRecording = () => {
        toggleActive()
        mediaRecorder.current.stop()
        socket.current.close()
        setstreamFinished(true)
        stopTimer()
    

      }    
    
      const toggleActive = () => {
        setIsActive(!isActive)
      }
    
      const toggleRecording = () => {
        !isActive ? startRecording() : stopRecording()
      }

      const toggleScreenSharing = () => {
        userFacing ? screen() : camera()
        setuserFacing(!userFacing)
      }
      const recorderInit = () => {
        console.log("init")
        var socket = new WebSocket(url)
        liveStream = videoRef.current.captureStream(30) // 30 FPS
        mediaRecorder.current = new MediaRecorder(liveStream, {
          mimeType: 'video/webm;codecs=h264',
          // mimeType: 'video/webm;codecs=vp8,opus',
          videoBitsPerSecond: 3 * 1024 * 1024,
        })
        mediaRecorder.current.ondataavailable = (e) => {
          socket =new WebSocket(url)
          socket.onopen=(event)=>{
      
           console.log(event,"socket event")
           wss://docker.freetyl.io/
            if ( socket?.readyState === 3 ) {
             console.log("Websocket closed")
             socket.close()
             
             var newSocket =new WebSocket(url)
             sleep(30000)
             
       
            
              newSocket.send(e.data);
              console.log('send data', e.data)
              
            }else{
             console.log(socket.readyState,"else")
             socket.send(e.data);
             console.log('send data', e.data)
            }
           }
          // socket.current.send(e.data)
          // chunks.push(e.data)
          console.log('send data', e.data)
        }
        // Start recording, and dump data every second
        mediaRecorder.current.start(5000)
      }


  return (

    
    <div className='video-container ' style={{diplay:"flex"}}>
              <video
                 
                
                style={{width:"100%"}}
                ref={videoRef}
                autoPlay
                muted={true}
              />
             
            
             <div className='control-container' >
                 <h5  className={`${active=="mic"? "active" :"btn" }`}  onClick={()=>setActive("mic")}>
                    <BsMic 
                     style={{fontSize:"20px"}}
                     onClick={toggleMicrophone}
                    />
                 </h5>
                 <h5 className={`${active=="cam"? "active" :"btn" }`} onClick={()=>setActive("cam")}>
                    <BsCameraVideo 
                      style={{fontSize:"20px"}}
                      onClick={startRecording}
                    />
                 </h5>
                 <h5 className={`${active=="end"? "active" :"btn" }`} onClick={()=>setActive("end")}>
                    <MdCallEnd style={{fontSize:"20px",color:"red"}}
                    />
                 </h5>
                 <h5 className={`${active=="share"? "active" :"btn" }`} onClick={()=>setActive("share")}>
                    <TbScreenShare 
                       style={{fontSize:"20px"}}
                       onClick={toggleScreenSharing}
                       
                       />
                 </h5>
                

             </div>
    </div>
  )
}
