import {Server} from 'socket.io';
import http from 'http';
import express from 'express'

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: ['http://localhost:5173'],
    },
});

export function getReceiverSocketID(userID){
    return userSocketMap[userID];
}


//to store the online users from db...
const userSocketMap = {} //key value is [userId: socket.id]

io.on('connection',(socket) => {
    console.log('A user has connected', socket.id)
    const userID = socket.handshake.query.userID;   //userID because that's what we gave under connectSocket fn
    if(userID) userSocketMap[userID] = socket.id


    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () =>{
        console.log('A user has disconnected', socket.id)
        delete userSocketMap[userID];
        io.emit('onlineUsers', Object.keys(userSocketMap));
    })
})



export {io, server, app};
