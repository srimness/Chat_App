import generateToken from '../lib/util.js';
import User from '../models/user.model.js'; 
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js'


export const signup = async (req,res)=>{
    const {name, email, password, profilePic} = req.body;
try {

    if(!name || !email ||!password) {
        return res.status(400).json({message: 'All Fields are Mandatory!'});
    }
    if(password.length <6){
        return res.status(400).json({message: 'Password must be more than 6 characters'});
    }
    const userExists = await User.findOne({email});

    if (userExists){
       return  res.status(400).json({message: 'Email already has been registered!'})};

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    
    const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            profilePic: ''
        });

    if(newUser) {
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id, 
            name: newUser.name,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    }
    
} catch (error) {
    console.log('Error in Signup controller', error.message),
    res.status(500).json({message: 'Internal Server error'})
}
    
};

export const login = async (req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message: 'Invalid Credentials'})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message: 'Invalid Credentials'})
        }
        generateToken(user._id, res)

        res.status(201).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic
        })


    } catch (error) {
        console.log('Error in Login Controller', error.message);
        return res.status(500).json({message:'Internal Server Error'});


        
    }
};

export const logout = (req,res)=>{
    try {
        res.cookie('jwttoken', '', { maxAge: 0}) 
        res.status(200).json({message:'Logged Out Successfully'});

    } catch (error) {
        console.log('Error in Logout Controller', error.message);
        res.status(500).json({message:'Internal Server Error'});
        
    }
};

export const updateProfile = async (req,res) =>{
    try {
        const {profilePic} = req.body;
        const id = req.user.id; // we're getting the id from the req.body. which has the user details.. which is possible we added it in  protectRoute func. 

        if(!profilePic){
            res.status(400).json({message:'Profile Pic is required'});
        }

        const uploadedResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(id, {profilePic:uploadedResponse.secure_url}, {new:true}).lean()//new:true will send the updated User details back. 

        res.status(200).json(updatedUser);


    } catch (error) {
        console.log('Error in Update Profile Controller', error.message);
        res.status(500).json({message:'Internal Server Error'});
        
    }
};

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user);

    } catch (error) {
        console.log('Error in Check Auth controller', error.message);
        res.status(500).json({message:'Internal Server Errors'})
        
    }
};



//check why authentication toast is coming twice..