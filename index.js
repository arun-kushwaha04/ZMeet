const express = require('express');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');
const { v4: uuidV4 } = require('uuid');

const app = express();
const httpServer = require('http').createServer(app);

app.use(cors());
app.use(express.json());

const io = require('socket.io')(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
const port = process.env.PORT || 8000;

const peerServer = ExpressPeerServer(httpServer, {
    debug: true,
    path: '/myapp',
});

app.use('/webRTC', peerServer);

app.get('/', (_, res) => {
    res.status(200).json({
        status: 200,
        payload: null,
        message: `Server up and running on port ${port}`,
    });
});
httpServer.listen(8000, (err) => {
    if (err) throw err;
    console.log(`server running and listening on port ${port}`);
});

io.on('connection', (socket) => {
    io.to(socket.id).emit('meet-url', uuidV4());
    socket.on('join-room', ({ roomID, userID }) => {
        socket.join(roomID);
        socket.to(roomID).emit('user-connected', userID);

        socket.on('disconnect', () => {
            socket.to(roomID).emit('user-disconnected', userID);
        });
    });

    // socket.on('currentUserStream', (stream) => {
    //     console.log('current user stream');
    //     socket.broadcast.emit('otherUserStream', stream);
    // });
});