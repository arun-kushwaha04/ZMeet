require('dotenv').config();
process.env.PWD = process.cwd();
const express = require('express');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');
const { v4: uuidV4 } = require('uuid');
const authRoute = require('./routes/auth.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const httpServer = require('http').createServer(app);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URL, (err) => {
 if (err) {
  console.log('Error caused in connection to database', err);
 } else {
  console.log('Connected to database ☺');
 }
});

const io = require('socket.io')(httpServer, {
 cors: {
  origin: '*',
  methods: ['GET', 'POST'],
 },
});
const port = process.env.PORT || 8000;

const peerServer = ExpressPeerServer(httpServer, {
 debug: true,
 path: '/myapp',
});

app.use('/webRTC', peerServer);
app.use('/auth', authRoute);
app.use(express.static(path.join(__dirname, '/public')));

// app.get('/', (_, res) => {
//  res.sendFile(path.join(process.env.PWD, 'client/build', 'index.html'));
//  return;
// });

app.post('/getToken', (req, res) => {
 const { username } = req.body;
 const token = jwt.sign(
  {
   username,
  },
  process.env.SECRET_KEY,
  { expiresIn: '1d' },
 );
 res.status(200).json({
  status: 200,
  payload: token,
  message: 'Logged In Successfully',
 });
 return;
});

app.post('/verifyToken', (req, res) => {
 const { token } = req.body;

 jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
  if (err) {
   console.log(err);
   res.status(400).json({
    status: 400,
    payload: token,
    message: 'Invalid Token',
   });
   return;
  }
  res.status(200).json({
   status: 200,
   payload: token,
   message: 'Valid Token',
  });
  return;
 });
});

app.post('/getMeetUrl', (req, res) => {
 const { username, timestamp } = req.body;
 console.log(username, timestamp);
 const token = jwt.sign(
  {
   username,
   timestamp,
  },
  process.env.SECRET_KEY,
  { expiresIn: '100m' },
 );
 res.status(200).json({
  status: 200,
  payload: `${username}-${token}`,
  message: 'Meet Url Generated',
 });
 return;
});

app.post('/verifyMeetUrl', (req, res) => {
 //username-jwttoken
 const { meetUrl } = req.body;
 const [username, token] = meetUrl.split('-');
 //  console.log(process.env.SECRET_KEY);
 jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
  if (err) {
   console.log(err);
   res.status(400).json({
    status: 400,
    payload: null,
    message: 'Invalid meet url',
   });
   return;
  }
  if (result && result.username == username) {
   res.status(200).json({
    status: 200,
    payload: null,
    message: 'Valid url',
   });
   return;
  }
  res.status(400).json({
   status: 400,
   payload: null,
   message: 'Invalid meet url',
  });
 });
});

httpServer.listen(port, (err) => {
 if (err) throw err;
 console.log(`server running and listening on port ${port}`);
});

io.on('connection', (socket) => {
 io.to(socket.id).emit('meet-url', uuidV4());
 socket.on('join-room', ({ roomID, userID, username }) => {
  socket.join(roomID);
  socket.to(roomID).emit('user-connected', userID, username);

  socket.on('disconnect', () => {
   socket.to(roomID).emit('user-disconnected', userID);
  });

  socket.on('video-changed-client', (userID, status) => {
   socket.to(roomID).emit('video-changed', userID, status);
  });
  socket.on('audio-changed-client', (userID, status) => {
   socket.to(roomID).emit('audio-changed', userID, status);
  });
 });

 // socket.on('currentUserStream', (stream) => {
 //     console.log('current user stream');
 //     socket.broadcast.emit('otherUserStream', stream);
 // });
});
