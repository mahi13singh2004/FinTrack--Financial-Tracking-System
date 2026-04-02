import Record from "../models/record.model.js"

export const createRecord=async(req,res)=>{
    try {
        const {amount,type,category,date,notes}=req.body
        if(!amount || !type || !category){
            return res.status(400).json({message:"All fields are required"})
        }

        const record=await Record.create({
            userId:req.user._id,
            amount,
            type,
            category,
            date,
            notes
        })

        return res.status(201).json({
            message:"Record created successfully",
            record
        })    
    } 
    catch (error) {
        console.log("Error in backend createRecord controller",error.message)
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getRecords=async(req,res)=>{
    try {
        const {type,category}=req.query
        
        let filter={}

        if(type) filter.type=type
        if(category) filter.category=category

        const records=await Record.find(filter).sort({createdAt:-1})

        return res.status(200).json({
            message:"Records fetched sucessfully",
            records
        })
    } 
    catch (error) {
        console.log("Error in backend getRecord controller",error.message)
        return res.status(500).json({message:"Internal server error"})
    }
}

export const deleteRecord=async(req,res)=>{
    try {
        const record=await Record.findByIdAndDelete(req.params.id)
        if(!record){
            return res.status(404).json({message:"Record not found"})
        }
        return res.status(200).json({message:"Record deleted sucessfully"})
    } 
    catch (error) {
        console.log("Error in backend deleteRecord controller",error.message)
        return res.status(500).json({message:"Internal server error"})
    }
}

export const updateRecord=async(req,res)=>{
    try {
        const record=await Record.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        if(!record){
            return res.status(404).json({message:"Record not found"})
        }

        return res.status(200).json({
            message:"Record updated",
            record
        })
    } 
    catch (error) {
        console.log("Error in backend updateRecord controller",error.message)
        return res.status(500).json({message:"Internal server error"})
    }
}