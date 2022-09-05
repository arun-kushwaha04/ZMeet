import { Peer } from 'peerjs';
import socket from '../../socket.config';
import { HOSTNAME } from '../../urls';

const initializePeerConnection = () => {
 return new Peer(undefined, {
  host: HOSTNAME,
  port: 8000,
  path: '/webRTC/myapp',
 });
};
const peers = {};

let globalStream;

const initializePeersEvents = (
 myPeer,
 meetUrl,
 setUserId,
 videoStatus,
 audioStatus,
) => {
 myPeer.on('open', async (id) => {
  setUserId(id);
  const roomID = meetUrl;
  const userData = {
   userID: id,
   roomID,
   username: localStorage.getItem('username'),
  };
  console.log('peers established and joined room', userData);
  socket.emit('join-room', userData);
  globalStream = await getVideoAndAudioStream(videoStatus, audioStatus);
  setNavigatorToStream(myPeer, id, peers, videoStatus, audioStatus);
 });
 myPeer.on('error', (err) => {
  console.log('peer connection error', err);
  myPeer.reconnect();
 });
};

const initializeSocketEvents = () => {
 console.log('intalizing socket events');
 socket.on('connect', () => {
  console.log('socket connected');
 });
 socket.on('user-disconnected', (userID) => {
  console.log('user disconnected-- closing peers', userID);
  peers[userID] && peers[userID].close();
 });
 socket.on('disconnect', () => {
  console.log('socket disconnected --');
 });
};

const setPeersListeners = (myPeer, peers, videoStatus, audioStatus) => {
 myPeer.on('call', (call) => {
  call.answer(globalStream);
  const id = call.metadata.id;
  const username = call.metadata.username;
  call.on('stream', (userVideoStream) => {
   console.log('user stream data', username);
   const div = document.getElementById(id);
   if (!div) {
    addNewUsersVideo(id, username, userVideoStream);
   }
  });
  call.on('close', () => {
   console.log('closing peers listeners', call.metadata.id);
   const div = document.getElementById(id);
   div.remove();
   delete peers[id];
  });
  call.on('error', () => {
   console.log('peer error ------');
   const div = document.getElementById(id);
   div.remove();
   delete peers[id];
  });
  peers[id] = call;
 });
};

const newUserConnection = (peer, myuserID, peers) => {
 socket.on('user-connected', async (userID, othersUsername) => {
  console.log('New User Connected', userID, othersUsername);
  setTimeout(
   connectToNewUser,
   2000,
   peer,
   userID,
   myuserID,
   peers,
   othersUsername,
  );
  // connectToNewUser(peer, userID, myuserID, updatePeers);
 });
};

const connectToNewUser = async (
 myPeer,
 othersuserID,
 myuserID,
 peers,
 othersUsername,
) => {
 console.log('stream ka check kaar raha hu', globalStream);
 const call = myPeer.call(othersuserID, globalStream, {
  metadata: { id: myuserID, username: localStorage.getItem('username') },
 });
 call.on('stream', (userVideoStream) => {
  const div = document.getElementById(othersuserID);
  if (!div) {
   addNewUsersVideo(othersuserID, othersUsername, userVideoStream);
  }
 });
 call.on('close', () => {
  console.log('closing new user', othersuserID);
  const div = document.getElementById(othersuserID);
  div.remove();
  delete peers[othersuserID];
 });
 call.on('error', () => {
  console.log('peer error ------');
  const div = document.getElementById(othersuserID);
  div.remove();
  delete peers[othersuserID];
 });
 peers[othersuserID] = call;
};

const addNewUsersVideo = (id, username, userVideoStream) => {
 const Maindiv = document.createElement('div');
 Maindiv.classList.add('column');
 Maindiv.setAttribute('id', id);

 const Secdiv = document.createElement('div');
 Secdiv.classList.add('sec-col');

 const video = document.createElement('video');
 video.srcObject = userVideoStream;
 video.autoplay = true;
 video.playsInline = true;
 video.mute = true;
 video.classList.add('video');

 const h4 = document.createElement('h4');
 h4.textContent = username;

 const grid = document.querySelector('.randomvideogrid');

 Secdiv.appendChild(video);
 Secdiv.appendChild(h4);
 Maindiv.appendChild(Secdiv);
 console.log(Maindiv, grid);
 grid.appendChild(Maindiv);
};

export const createEmptyAudioTrack = () => {
 const ctx = new AudioContext();
 const oscillator = ctx.createOscillator();
 const dst = oscillator.connect(ctx.createMediaStreamDestination());
 oscillator.start();
 const track = dst.stream.getAudioTracks()[0];
 return Object.assign(track, { enabled: false });
};

export const createEmptyVideoTrack = ({ width, height }) => {
 const canvas = Object.assign(document.createElement('canvas'), {
  width,
  height,
 });
 canvas.getContext('2d').fillStyle = `rgb(131, 130, 130)`;
 canvas.getContext('2d').fillRect(0, 0, width, height);

 const stream = canvas.captureStream();
 const track = stream.getVideoTracks()[0];

 return Object.assign(track, { enabled: false });
};

const getVideoAndAudioStream = (videoStatus, audioStatus) => {
 console.log('Mai video audio stream bana raha hu');
 return new Promise((resolve, reject) => {
  navigator.mediaDevices
   .getUserMedia({
    video: true,
    audio: true,
   })
   .then((stream) => {
    globalStream = stream;
    console.log(globalStream);
    resolve(stream);
   });
  // if (!videoStatus && !audioStatus) {
  //  const audioTrack = createEmptyAudioTrack();
  //  const videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
  //  const mediaStream = new MediaStream([audioTrack, videoTrack]);
  //  globalStream = mediaStream;
  //  resolve(mediaStream);
  // } else {
  //  navigator.mediaDevices
  //   .getUserMedia({
  //    video: videoStatus,
  //    audio: audioStatus,
  //   })
  //   .then((stream) => {
  //    globalStream = stream;
  //    resolve(stream);
  //   })
  //   .catch((err) => {
  //    const audioTrack = createEmptyAudioTrack();
  //    const videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
  //    const mediaStream = new MediaStream([audioTrack, videoTrack]);
  //    globalStream = mediaStream;
  //    resolve(mediaStream);
  //   });
  // }
 });
};

const setNavigatorToStream = async (myPeer, id, peers) => {
 setPeersListeners(myPeer, peers);
 newUserConnection(myPeer, id, peers);
};

const replaceStream = (mediaStream) => {
 Object.values(peers).map((peer) => {
  peer.peerConnection?.getSenders().map((sender) => {
   console.log(sender, sender.track.kind);
   if (sender.track.kind === 'audio') {
    if (mediaStream.getAudioTracks().length > 0) {
     sender.replaceTrack(mediaStream.getAudioTracks()[0]);
    }
   }
   if (sender.track.kind === 'video') {
    if (mediaStream.getVideoTracks().length > 0) {
     sender.replaceTrack(mediaStream.getVideoTracks()[0]);
    }
   }
   //  sender.replaceTrack(new MediaStream(mediaStream));
  });
 });
};

const reInitializeStream = async (videoStatus, audioStatus) => {
 // console.log('Reintalizing the stream');
 // await getVideoAndAudioStream(videoStatus, audioStatus);
 // replaceStream(globalStream);

 if (globalStream) {
  globalStream.getAudioTracks() &&
   globalStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = audioStatus));
  globalStream.getVideoTracks() &&
   globalStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = videoStatus));
 }
};

const changeVideoStatus = (setStatus) => {
 setStatus((data) => !data);
};

const changeAudioStatus = (setStatus) => {
 setStatus((data) => !data);
};

export {
 initializePeerConnection,
 initializePeersEvents,
 initializeSocketEvents,
 changeAudioStatus,
 changeVideoStatus,
 reInitializeStream,
};
