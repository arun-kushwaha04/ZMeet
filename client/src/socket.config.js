import io from 'socket.io-client';

let socket = io('http://192.168.64.110:8000/');

console.log(socket);

export default socket;
