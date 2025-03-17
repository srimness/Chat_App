import { create } from "zustand";
import toast from 'react-hot-toast';
import { axiosIn } from "../src/lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";


export const useChatStore = create((set, get) =>({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () =>{
        set({isUsersLoading: true});
        try {
            const res = await axiosIn.get('/messages/users');
            set({users: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading: false})
        }
    },

    getMessages: async(_id) =>{
        set({isMessagesLoading: true});
        try {
           // console.log('hi')
            const res = await axiosIn.get(`/messages/${_id}`);
            set({messages: res.data})
            //console.log(res.data)
        } catch (error) {
            toast.error(error.response.data.nessage);

            
        }finally{
            set({isMessagesLoading: false})
        }
    },

    sentMessages: async(messageData) =>{
        const {selectedUser, messages} = get()
        try {
            const res = await axiosIn.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages: [...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message);
            
        }

    },

    loadLatestMessages: () =>{
        const {selectedUser} = get()
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;  //possible because of zustand.. 

        //to optimize still...
        socket.on('newMessage', (newMessage)=>{   //socket is not there in this file.. hence using zustand in above line, we're getting the state..
            const isMsgfromSelectedUser = newMessage.senderID === selectedUser._id
            if(!isMsgfromSelectedUser) return;
            
            set({
                messages: [...get().messages,newMessage
                ]});                                                            //get().messages is because we're also fetching all the previous messages & finally appending the latest one.
        });

    },

    unloadLatestMessages: () =>{
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
    },



    setSelectedUser: (selectedUser) => set({selectedUser}),  


}));

