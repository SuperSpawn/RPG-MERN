import Character from "../models/Character.Model.js";

//@desc Get all Character
//@route GET /
//@access public
const getAllCharacter = async (req, res) => {
  try {
    const data = await Character.find({});
    if (!data) throw new Error("Server error, failed to fetch data");
    res.status(200).json({ data: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//@desc Create new Character
//@route POST /
//@access public
const createCharacter = async (req, res) => {
  try {
    const data = await Character.create({ ...req.body, balance: 0 });
    if (!data) throw new Error("Server error, failed to create data");
    res.status(201).json({ data: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//@desc Get Character by ID
//@route GET /:id
//@access public
const getCharacter = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("Invalid id");
    const data = await Character.findById(id);
    if (!data) throw new Error("Server error, failed to create data");
    res.status(200).json({ data: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//@desc Update Character by ID
//@route PUT /:id
//@access public
const updateCharacter = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("Invalid id");
    const updatedData = await Character.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!updatedData) throw new Error("Failed to update data");
    res.status(200).json({ data: updatedData });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//@desc Delete Character by ID
//@route DELETE /:id
//@access public
const deleteCharacter = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("Invalid id");
    const data = await Character.findByIdAndDelete(id);
    if (!data) throw new Error("Failed to update data");
    res.status(200).json({ data: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export {
  getAllCharacter,
  createCharacter,
  getCharacter,
  updateCharacter,
  deleteCharacter,
};
