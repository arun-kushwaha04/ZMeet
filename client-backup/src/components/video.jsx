import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peer';
import socket from '../socket.config';

import './video.css';

const peer = new Peer('someid', {
 host: 'localhost',
 port: 8000,
 path: '/webRTC',
});

const Video = () => {
 const usersVideo = useRef();
 const callVideo = useRef();
 const [stream, setStream] = useState();
 const [otherUserStream, setOtherUserStream] = useState();

 useEffect(() => {
  peer.on('open', (id) => {
   socket.emit('join-room', 'my meet', id);
  });
  navigator.mediaDevices
   .getUserMedia({ video: true, audio: true })
   .then((stream) => {
    usersVideo.current.srcObject = stream;
    setStream(stream);
   });
  socket.on('meet-url', (data) => {
   console.log(data);
  });
  peer.on('call', (call) => {
   call.answer(stream);
   call.on('stream', (userVideoStream) => {
    callVideo.current.srcObject = userVideoStream;
   });
  });

  socket.on('user-connected', (userId) => {
   const call = peer.call(userId, stream);
   call.on('stream', (userVideoStream) => {
    // addVideoStream(video, userVideoStream);
   });
  });
 }, []);

 return (
  <>
   <h1>Meet</h1>
   <video
    playsInline
    muted
    autoPlay
    style={{ width: '300px' }}
    ref={callVideo}
   ></video>
   <video
    ref={usersVideo}
    playsInline
    muted
    autoPlay
    style={{ width: '300px' }}
   />
  </>
 );
};

export default Video;
