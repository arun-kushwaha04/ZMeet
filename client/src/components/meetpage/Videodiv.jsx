import React, { useRef, useEffect, useState } from 'react';
import { Checkbox, Segment, Icon, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import {
 changeAudioStatus,
 changeVideoStatus,
 initializePeerConnection,
 initializePeersEvents,
 initializeSocketEvents,
 reInitializeStream,
} from './peerService';

import './video.css';

export default function Videodiv({ visible, setVisiblity, meetUrl }) {
 const usersVideo = useRef();
 let peer = initializePeerConnection();
 const [userid, setUserId] = useState('');
 const [videoStatus, setVideoStatus] = useState(true);
 const [audioStatus, setAudioStatus] = useState(true);

 useEffect(() => {
  if (!videoStatus && !audioStatus) {
   usersVideo.current.srcObject = null;
  } else {
   navigator.mediaDevices
    .getUserMedia({ video: videoStatus, audio: audioStatus })
    .then((stream) => {
     usersVideo.current.srcObject = stream;
    });
  }
  if (userid) reInitializeStream(videoStatus, audioStatus);
 }, [audioStatus, userid, videoStatus]);

 useEffect(() => {
  if (userid.length === 0) {
   initializePeersEvents(peer, meetUrl, setUserId, videoStatus, audioStatus);
   initializeSocketEvents();
  }
 }, [userid, peer, videoStatus, audioStatus]);

 return (
  <Maindiv>
   <Segmentdiv>
    <Segment basic>
     <Grid
      className='randomvideogrid'
      columns={3}
      verticalAlign='middle'
      centered
      container
     >
      <Grid.Column>
       <Supervideodiv>
        <Video ref={usersVideo} playsInline autoPlay muted />
        <h4>You</h4>
       </Supervideodiv>
      </Grid.Column>
      {/* {peers.map((obj) => {
       console.log(obj);
       return (
        <Grid.Column>
         <Supervideodiv>
          <Video playsInline autoPlay muted src={new MediaSource(obj.stream)} />
          <h4>{obj.userId}</h4>
         </Supervideodiv>
        </Grid.Column>
       );
      })} */}
     </Grid>
    </Segment>
   </Segmentdiv>

   <Animateddiv>
    <Controldiv>
     {videoStatus ? (
      <Icon
       circular
       inverted
       color='green'
       name='video'
       size='large'
       onClick={() => changeVideoStatus(setVideoStatus)}
      />
     ) : (
      <Icon
       circular
       name='video'
       size='large'
       onClick={() => changeVideoStatus(setVideoStatus)}
      />
     )}

     {audioStatus ? (
      <Icon
       circular
       inverted
       color='green'
       name='unmute'
       size='large'
       onClick={() => changeAudioStatus(setAudioStatus)}
      />
     ) : (
      <Icon
       circular
       name='unmute'
       size='large'
       onClick={() => changeAudioStatus(setAudioStatus)}
      />
     )}
     {/* <Checkbox
      checked={visible}
      label={{ children: <code>Show Chats</code> }}
      onChange={(e, data) => setVisiblity(data.checked)}
     /> */}
    </Controldiv>
   </Animateddiv>
  </Maindiv>
 );
}
const Maindiv = styled.div`
 height: 100%;
 width: 100%;
`;

const Segmentdiv = styled.div`
 height: 100%;
 .ui.basic.segment {
  height: 90%;
 }
`;

const Animateddiv = styled.div`
 width: 100%;
 position: fixed;
 bottom: 0rem;
 i {
  cursor: pointer;
 }
`;

const Supervideodiv = styled.div`
 position: relative;
 background-color: #838282;
 :hover {
  h4 {
   display: block;
  }
 }
 h4 {
  position: absolute;
  text-align: center;
  width: 100%;
  top: 50%;
  left: 50%;
  display: none;
  transform: translate(-50%, -150%);
 }
`;

const Video = styled.video`
 width: 100%;
 height: auto;
`;

const Controldiv = styled.div`
 background-color: white;
 width: 100%;
 height: 5rem;
 padding: 1rem 0;
 display: flex;
 gap: 2rem;
 justify-content: center;
 align-items: center;
`;
