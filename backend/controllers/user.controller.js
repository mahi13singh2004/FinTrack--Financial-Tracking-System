import User from "../models/user.model.js"

export const createUser=async(req,res)=>{
    try {
        const {name,email,password,role}=req.body
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const userExist=await User.findOne({email})
        if(userExist){
            return res.status(400).json({message:"User already exist"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            role:role || "viewer"
        })

        return res.status(201).json({
            message:"User created sucessfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })
    } 
    catch (error) {
        console.log("Error in createUser backend",error.message)
        return res.status(500).json({message:"Internal server error"})    
    }
}

export const getAllUsers=async(req,res)=>{
    try {
        const users=await User.find({},{password:0}).sort({createdAt:-1})
        return res.status(200).json({
            message:"Users fetched sucessfully",
            users
        })
    } 
    catch (error) {
        console.log("Error in getAllUsers backend",error.message)
        return res.status(500).json({message:"Internal server error"})    
    }
}

export const GetUserById=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id,{password:0})
        if(!user){
            return res.status(404).json({message:"No user exist"})
        }

        return res.status(200).json({
            message:"User fetched sucessfully",
            user
        })
    } 
    catch (error) {
        console.log("Error in GetUserById backend",error.message)
        return res.status(500).json({message:"Internal server error"})    
    }
}

export const updateUserRole=async(req,res)=>{
    try {
        const {role}=req.body
        if(!role || !["viewer", "analyst", "admin"].includes(role)){
            return res.status(400).json({message:"Enter a valid role"})
        }

        const user=await User.findByIdAndUpdate(
            req.params.id,
            {role},
            {new:true}
        )

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        return res.status(200).json({
            message:"User role updated",
            user:{
                ...user._doc,
                password:undefined
            }
        })
    } 
    catch (error) {
        console.log("Error in updateUserRole backend",error.message)
        return res.status(500).json({message:"Internal server error"})    
    }
}

export const changeStatus=async(req,res)=>{
    try {
        const {user}=await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        user.isActive=!user.isActive
        await user.save()

        return res.status(200).json({
            message:"Status changed",
            user:{
                ...user._doc,
                password:undefined
            }
        })
    } 
    catch (error) {
        console.log("Error in changeStatus backend",error.message)
        return res.status(500).json({message:"Internal server error"})    
    }
}

export const deleteUser=async(req,res)=>{
    try {
        const user=await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        return res.status(200).json({
            message:"User deleted"
        })
    } 
    catch (error) {
        console.log("Error in deleteUser backend",error.message)
        return res.status(500).json({message:"Internal server error"})    
    }
}