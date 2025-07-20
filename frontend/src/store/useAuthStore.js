// import {create} from "zustand"
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { LogOut } from "lucide-react";
// import React from "react";
// import { io } from "socket.io-client";

// const BASE_URL="http://localhost:5001"

// export const useAuthStore= create((set,get)=>({
//     authUser: null,
//     isSigningUp: false,
//     isLogginIng: false,
//     isUpdatingProfile: false,
//     isCheckingAuth: true,
//     onlineUsers: [],
//     socket: null,

//     checkAuth: async()=>{
//         try {
//             const res=await axiosInstance.get("/auth/check");

//             set({authUser: res.data});
//             get().connectSocket();
//         } catch (error) {
//             console.log("error in checkAuth: ", error);
//             set({authUser: null});
//         }
//      finally{
//         set({isCheckingAuth: false});
//         }
//     },

//     signup: async(data)=>{
//         set({isSigningUp: true});
//         try {
//             const res=await axiosInstance.post("/auth/signup",data);
//             set({authUser: res.data});
//             toast.success("account created sucessfully")
//             get().connectSocket();

//         } catch (error) {
//             toast.error(error.response.data.message) 
//         } finally{
//             set({isSigningUp: false});
//         }

//     },

//     logout: async()=>{
//         try {
//             await axiosInstance.post("auth/logout");
//             set({authUser: null});
//             toast.success("loggedOut successfully");
//             get().disconnectSocket();
//         } catch (error) {
//             toast.error(error.response.data.message)            
//         }
//     },

//     login: async(data)=>{
//         set({isLogginIng: true});
//         try {
//             const res=await axiosInstance.post("/auth/login",data);
//             set({authUser: res.data});
//             toast.success("logged in successfully");
//             get().connectSocket();
//         } catch (error) {
//             toast.error(error.response.data.message);
//         } finally {
//             set({isLogginIng: false});
//         }
//     },

//     updateProfile: async(data)=>{
//         set({isUpdatingProfile: true});
//         try {
//             const res=await axiosInstance.put("/auth/update-profile",data);
//             set({authUser: res.data});
//             toast.success("profile uplad successfully");
//         } catch (error) {
//             console.log("error in update profile: ", error);
//             toast.error(error.response.data.message);
//         } finally{
//             set({isUpdatingProfile: false});
//         }
//     },

//     connectSocket: ()=>{
//         const {authUser}=get()
//         if(!authUser || get().socket?.connected)
//         {
//             return;
//         }

//         const socket=io(BASE_URL,{
//             query: {
//                 userId: authUser._id,
//             },
//         });
//         socket.connect()
//         set({socket:socket});

//         socket.on("getOnlineUsers", (userIds)=>{
//             set({onlineUsers: userIds});
//         });

//     },
//     disconnectSocket: ()=>{
//         if(get().socket?.connected)
//         {
//             get().socket.disconnect();
//         }
//     },

// }));

import {create} from "zustand"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import React from "react";
import { io } from "socket.io-client";

const BASE_URL=import.meta.env.MODE==="development"?"http://localhost:5000/api":"/";
export const useAuthStore= create((set,get)=>({
    authUser: null,
    isSigningUp: false,
    isLogginIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async()=>{
        try {
            const res=await axiosInstance.get("/auth/check");

            set({authUser: res.data});
            get().connectSocket();
        } catch (error) {
            console.log("error in checkAuth: ", error);
            set({authUser: null});
        }
     finally{
        set({isCheckingAuth: false});
        }
    },

    signup: async(data)=>{
        set({isSigningUp: true});
        try {
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser: res.data});
            toast.success("account created sucessfully")
            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message) 
        } finally{
            set({isSigningUp: false});
        }

    },

    logout: async()=>{
        try {
            await axiosInstance.post("auth/logout");
            set({authUser: null});
            toast.success("loggedOut successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message)            
        }
    },

    login: async(data)=>{
        set({isLogginIng: true});
        try {
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser: res.data});
            toast.success("logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLogginIng: false});
        }
    },

    updateProfile: async(data)=>{
        set({isUpdatingProfile: true});
        try {
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser: res.data});
            toast.success("profile uplad successfully");
        } catch (error) {
            console.log("error in update profile: ", error);
            toast.error(error.response.data.message);
        } finally{
            set({isUpdatingProfile: false});
        }
    },

    connectSocket: ()=>{
        const {authUser, socket}=get()
        if(!authUser || socket?.connected) {
            return;
        }

        const newSocket=io(BASE_URL,{
            query: {
                userId: authUser._id,
            },
        });
        
        set({socket: newSocket});

        newSocket.on("getOnlineUsers", (userIds)=>{
            set({onlineUsers: userIds})
        });

        newSocket.on("connect", ()=>{
            console.log("Connected to server");
        });

        newSocket.on("disconnect", ()=>{
            console.log("Disconnected from server");
        });

        newSocket.on("connect_error", (error)=>{
            console.log("Connection error:", error);
        });

    },
    
    disconnectSocket: ()=>{
        const socket = get().socket;
        if(socket?.connected) {
            socket.disconnect();
        }
        set({socket: null, onlineUsers: []});
    },

}));