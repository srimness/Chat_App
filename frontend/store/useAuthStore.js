import { create } from "zustand";
import { axiosIn } from "../src/lib/axios.js";
import toast from 'react-hot-toast';
import { io } from 'socket.io-client'

const BASE_URL  = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"


export const useAuthStore = create((set, get) =>({
    authUser:null,
    isSigningup: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],


    isCheckingAuth:true,

    checkAuth: async () => {
        try {
            set({ isCheckingAuth:true }) //to set it as true initially to check auth 
            
            const res = await axiosIn.get('/auth/check')
            set({authUser: res.data})
            get().connectSocket();


        } catch (error) {
            console.log('Error in checkAuth', error)
            set({authUser:null})
            toast.error("Authentication failed, please login again.");  // why this is getting called twice??  maybe it's because in development phase.. it'll be 
            //called twice? something about the strict mode in index.css file or main.jsx file.. look into it tomorrow. yeah? gg good job so far...

        }
        finally{
            set({isCheckingAuth:false})
        }
    },

    signup : async (data) => {
        set({isSigningup: true})
        try {
            const res = await axiosIn.post('/auth/signup', data);
            set({authUser: res.data})  // to authenticate as sooon as signed up.
            toast.success("Account created successfully!")

            get().connectSocket();

        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred during signup. Please try again.");
            }
            console.log('Error in signup', error);
        }

        finally {
            set({isSigningup: false})
        }

    },

    login : async (data) => {
    set({isLoggingIn:true} )
    try {
        const res = await axiosIn.post('/auth/login', data);
        set({authUser: res.data});
        toast.success('Logged In Successfully');

        get().connectSocket();
    } catch (error) {
        if (error.response && error.response.data) {
            toast.error(error.response.data.message);
        } else {
            toast.error("An error occurred during Login. Please try again.");
        }
        console.log('Error in Login', error);
    }
    finally{
        set({isLoggingIn: false});
    }
    },

    logout : async () =>{
        try {
            await axiosIn.post('/auth/logout')
            set({authUser: null})
            toast.success('Logged Out Successfully!')
            get().disconnectSocket();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred during logout. Please try again.");
            }
            
        }
    },

    updateProfile: async (data) =>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosIn.put('/auth/update-profile', data);
            set({authUser: res.data});
            toast.success('Image uploaded Successfully');
            
        } catch (error) {
            console.log('Error in updateProfile', error)
            toast.error(error.response.data.message)
        } finally{
            set({isUpdatingProfile: false})
        }

    },

    connectSocket: () =>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return

        const socket = io(BASE_URL,{
            query: {
                userID: authUser._id,
            }
        });
        socket.connect()
        set({socket: socket});

        socket.on('getOnlineUsers', (userIds) => {
            set({onlineUsers: userIds});
        });
    },

    disconnectSocket: () =>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}));