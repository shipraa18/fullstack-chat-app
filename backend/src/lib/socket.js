// import {Server} from "socket.io";
// import http from "http";
// import express from "express"

// const app=express();
// const server=http.createServer(app);

// const io=new Server(server,{
//     cors: {
//         origin: ["http://localhost:5173"],
//     },
// });


// //used to store online users
// const userSocketMap={}; //{userId: socket}



// io.on("connection",(socket)=>{
//     console.log("a user connected",socket.id);
    
    
//     const userId=socket.handshake.query.userId
//     if(userId) userSocketMap[userId]=socket.id


//     //io.emit() is used to send events to all the connected clients
//     io.emit("getOnlineUsers",Object.keys(userSocketMap));


//     socket.on("disconnect",()=>{
//         console.log("a user disconnected",socket.id);
//         delete userSocketMap[userId];
//         io.emit("getOnlineUsers",Object.keys(userSocketMap));
//     });
// });

// export {io,app,server};

import {Server} from "socket.io";
import http from "http";
import express from "express"

const app=express();
const server=http.createServer(app);

const io=new Server(server,{
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
    },
});


export function getRecieverSocketId(userId){
    return userSocketMap[userId]
}

//used to store online users
const userSocketMap={}; //{userId: socketId}

io.on("connection",(socket)=>{
    console.log("a user connected", socket.id);
    
    const userId = socket.handshake.query.userId;
    
    if(userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log("User mapped:", userId, "->", socket.id);
    }

    //io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("a user disconnected", socket.id);
        
        // Find and remove user from map
        for (const [uid, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[uid];
                console.log("User removed from map:", uid);
                break;
            }
        }
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export {io,app,server};