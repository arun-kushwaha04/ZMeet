import io from 'socket.io-client';

let socket = io('http://localhost:8000/');

console.log(socket);

export default socket;