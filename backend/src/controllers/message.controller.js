import User from "../models/user.model.js";
import Message from "../models/messages.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketID, io } from "../lib/socket.js";
export const getUsersforSidebar = async (req, res) =>{
    try {
        const loggedInUser = req.user._id;
        const filteredUser = await User.find({_id: { $ne:loggedInUser }}).select('-password');
        res.status(200).json(filteredUser);

    } catch (error) {
        console.log('Error in getUserforSidebar/Messagecontroller', error.message);
        res.status(500).json({message:'Internal Server Error'});
    }
}

export const getMessages = async(req, res) =>{
    try {
        const { _id: oppID} = req.params;
        const myID = req.user._id;
        const messages = await Message.find({
            $or:[
                {senderID:oppID, receiverID:myID},
                {senderID:myID, receiverID:oppID}
            ]
        })

        res.status(200).json(messages);

    } catch (error) {
        console.log('Error in GetMessages Controller', error.message);
        res.status(500).json({message:"Internal server Error"});
    }
}

export const sendMessages = async (req, res)=>{

    try {
        const {text, image} = req.body;
    const senderID = req.user._id;
    const {id:receiverID} = req.params; // getting id as reciever id from req.params as 'id' is a variable here..

    let imageURL;
    if (image) {
        //uploading the image to cloudinary if there is img in the sent text message
        const uploadedResponse = (await cloudinary.uploader.upload(image)).secure_url;
        imageURL = uploadedResponse;
    }

    const newMessage = new Message({
        senderID,
        receiverID,
        text,
        image: imageURL,
    });

    await newMessage.save(); //to save in db

    //todo - later we'll be adding a real time functionality here with help of socket.io
    const receiversocketID = getReceiverSocketID(receiverID);
    if(receiversocketID){   //to check if ReceiverId user is online... 
        io.to(receiversocketID).emit('newMessage', newMessage); //to in the middle to send it only to the reciever..
    }

    res.status(201).json(newMessage)

        
    } catch (error) {
        console.log('Errror in sendMessage controller', error.message);
        res.status(500).json({message:'Internal server Error'})
        
    }
    

}