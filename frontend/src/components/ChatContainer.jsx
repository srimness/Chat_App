import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/useChatStore.js'
import MessageInput from './MessageInput.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessageSkeleton from './skeletons/MessageSkeleton.jsx';
import { useAuthStore } from '../../store/useAuthStore.js';
import { formatMessageTime } from '../lib/utils.js';

const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser, loadLatestMessages, unloadLatestMessages } = useChatStore();
  const {authUser} = useAuthStore();
  const firstLoad = useRef(true)


  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    loadLatestMessages();

    return () => unloadLatestMessages();
  }, [selectedUser._id, getMessages, loadLatestMessages, unloadLatestMessages])

  useEffect(() =>{

    if(firstLoad.current){
      firstLoad.current =false;
      return;
    }

    if(messages && messageEndRef.current){
      messageEndRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [messages])



  if(isMessagesLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>

  )


  return (

    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader /> 
      <div className='flex-1 overflow-auto p-4 space-y-4'>
        
        {messages.map((messages) => (
          <div key={messages._id}

          className={`chat ${messages.senderID === authUser._id ? 'chat-end': 'chat-start'}`}  ref={messageEndRef}  >
            
            <div className="size-10 rounded-full border">
                <img
                  src={
                    messages.senderID === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
              <div className='chat-header mb-1'>
                <time className='text-xs opacity-50 ml-1'>{formatMessageTime(messages.createdAt)}</time>

              </div>
              <div className="chat-bubble flex flex-col">
              {messages.image && (
                <img
                  src={messages.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {messages.text && <p>{messages.text}</p>}
            </div>
          </div>
        ))}

      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer
