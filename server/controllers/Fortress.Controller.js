import Fortress from "../models/Fortress.Model.js";

//@desc Get all Fortress
//@route GET /
//@access public
const getAllFortress = async (req, res) => {
    try {
        const data = await Fortress.find({});
        if(!data) 
            throw new Error("Server error, failed to fetch data");
        res.status(200).json({data: data});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

//@desc Create new Fortress
//@route POST /
//@access public
const createFortress = async (req, res) => {
    try {
        const data = await Fortress.create({...req.body});
        if(!data) throw new Error("Server error, failed to create data");
        res.status(201).json({data: data});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

//@desc Get Fortress by ID
//@route GET /:id
//@access public
const getFortress = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id) throw new Error("Invalid id")
        const data = await Fortress.findById(id);
        if(!data) throw new Error("Server error, failed to create data");
        res.status(200).json({data: data});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

//@desc Update Fortress by ID
//@route PUT /:id
//@access public
const updateFortress = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id) throw new Error("Invalid id")
        const updatedData = await Fortress.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );
        if(!updatedData) throw new Error("Failed to update data");
        res.status(200).json({data: updatedData});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}


//@desc Delete Fortress by ID
//@route DELETE /:id
//@access public
const deleteFortress = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id) throw new Error("Invalid id")
        const data = await Fortress.findByIdAndDelete(id);
        if(!data) throw new Error("Failed to update data");
        res.status(200).json({data: data});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

export {
    getAllFortress,
    createFortress,
    getFortress,
    updateFortress,
    deleteFortress,
};


