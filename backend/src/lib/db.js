import mongoose from 'mongoose';

export const connectDB = async () => {

    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,  // 30 seconds timeout for selecting servers
            socketTimeoutMS: 45000, 
        });
    console.log(`MongoDB Connected: ${connect.connection.host}`);
    console.log('Hi');

    
        
    } catch (error) {
        console.log('Error Occured:', error);
        
    }
    
};