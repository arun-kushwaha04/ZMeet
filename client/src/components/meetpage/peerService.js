import { Peer } from 'peerjs';
import socket from '../../socket.config';

const initializePeerConnection = () => {
 return new Peer(undefined, {
  host: '192.168.64.110',
  port: 8000,
  path: '/webRTC/myapp',
 });
};
const peers = {};
setInterval(() => {
 console.log(peers);
}, 5000);

let globalStream;

const initializePeersEvents = (myPeer, setUserId, videoStatus, audioStatus) => {
 myPeer.on('open', (id) => {
  setUserId(id);
  const roomID = 'Hello';
  const userData = {
   userID: id,
   roomID,
  };
  console.log('peers established and joined room', userData);
  socket.emit('join-room', userData);
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
 myPeer.on('call', async (call) => {
  globalStream = await getVideoAndAudioStream(videoStatus, audioStatus);
  call.answer(globalStream);
  const id = call.metadata.id;
  call.on('stream', (userVideoStream) => {
   console.log('user stream data', userVideoStream);
   const div = document.getElementById(id);
   if (!div) {
    addNewUsersVideo(id, userVideoStream);
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

const newUserConnection = (peer, myuserID, peers, videoStatus, audioStatus) => {
 socket.on('user-connected', async (userID) => {
  console.log('New User Connected', userID);
  setTimeout(connectToNewUser, 2000, peer, userID, myuserID, peers);
  // connectToNewUser(peer, userID, myuserID, updatePeers);
 });
};

const connectToNewUser = async (myPeer, othersuserID, myuserID, peers) => {
 console.log('stream ka check kaar raha hu', globalStream);
 const call = myPeer.call(othersuserID, globalStream, {
  metadata: { id: myuserID },
 });
 call.on('stream', (userVideoStream) => {
  const div = document.getElementById(othersuserID);
  if (!div) {
   addNewUsersVideo(othersuserID, userVideoStream);
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

const addNewUsersVideo = (id, userVideoStream) => {
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
 h4.textContent = `mai-phela-hu-${id}`;

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
 console.log(videoStatus, audioStatus);
 return new Promise((resolve, reject) => {
  if (!videoStatus && !audioStatus) {
   console.log('requestin this');
   const audioTrack = createEmptyAudioTrack();
   const videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
   const mediaStream = new MediaStream([audioTrack, videoTrack]);
   globalStream = mediaStream;
   resolve(mediaStream);
  } else if (videoStatus && !audioStatus) {
   navigator.mediaDevices
    .getUserMedia({
     video: true,
     audio: false,
    })
    .then((stream) => {
     globalStream = stream;
     resolve(stream);
    })
    .catch((err) => {
     //  const audioTrack = createEmptyAudioTrack();
     const videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
     const mediaStream = new MediaStream([videoTrack]);
     globalStream = mediaStream;
     resolve(mediaStream);
    });
  } else if (!videoStatus && audioStatus) {
   navigator.mediaDevices
    .getUserMedia({
     video: false,
     audio: true,
    })
    .then((stream) => {
     globalStream = stream;
     resolve(stream);
    })
    .catch((err) => {
     //  const audioTrack = createEmptyAudioTrack();
     const videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
     const mediaStream = new MediaStream([videoTrack]);
     globalStream = mediaStream;
     resolve(mediaStream);
    });
  } else {
   navigator.mediaDevices
    .getUserMedia({
     video: videoStatus,
     audio: audioStatus,
    })
    .then((stream) => {
     globalStream = stream;
     resolve(stream);
    })
    .catch((err) => {
     const audioTrack = createEmptyAudioTrack();
     const videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
     const mediaStream = new MediaStream([audioTrack, videoTrack]);
     globalStream = mediaStream;
     resolve(mediaStream);
    });
  }
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
 console.log('Reintalizing the stream');
 await getVideoAndAudioStream(videoStatus, audioStatus);
 replaceStream(globalStream);
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
