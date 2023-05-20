import User from "../models/User.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const checkAuth = async (req) => {
  try {
    if (!req.user) return false;
    const id = req.user.id;
    if (!id) return null;
    const user = await User.findById(id);
    if (!user) return null;
    return user;
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

//@desc Get all users
//@route GET /
//@access private
const getUsers = async (req, res, next) => {
  try {
    const user = await checkAuth(req);
    if (!user)
      res.status(400).json({ success: false, error: "Invalid authorization" });
    if (!user.isAdmin)
      res
        .status(403)
        .json({ success: false, error: "Not authorized to access this data" });
    const users = await User.find({});
    if (!users)
      res.status(404).json({ success: false, error: "Cannot fine users" });
    const mappedUsers = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      created_at: user.created_at,
    }));
    res.status(200).json({ success: true, data: mappedUsers });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

//@desc Create a user
//@route POST /
//@access public
const createUser = async (req, res, next) => {
  try {
    const { id, username, name, email, password } = req.body;
    if (!name || !email || !password || !id || !username)
      res.status(500).json({ success: false, error: "Invalid parameters" });

    const userTaken = await User.findOne({ email });
    if (userTaken) {
      res.status(403).json({ success: false, error: "Email already taken" });
      throw new Error("User already taken");
    }

    //HASH
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      _id: id,
      username,
      name,
      email,
      password: hashedPassword,
    });
    if (!user)
      res.status(500).json({ success: false, error: "Failed to create user" });
    const accessToken = jwt.sign(
      {
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          authority: user.authority,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.EXPIRE_IN || "24h" }
    );
    res.status(201).json({
      success: true,
      data: { name: user.name, token: accessToken },
    });
    res.status(201).json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

//@desc Get a user
//@route GET /:id
//@access private
const getUser = async (req, res, next) => {
  try {
    const reqUser = await checkAuth(req);
    if (!reqUser)
      res.status(400).json({ success: false, error: "Invalid authorization" });
    if (reqUser.authority != process.env.ADMIN)
      res
        .status(403)
        .json({ success: false, error: "Not authorized to access this data" });
    const id = req.params.id;
    if (!id) res.status(403).json({ success: false, error: "Invalid ID" });
    const user = await User.findById(id);
    if (!user)
      res.status(404).json({ success: false, error: "Cannot find user" });
    const mappedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      authority: user.authority,
    };
    res.status(200).json({ success: true, data: mappedUser });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

//@desc Update a user
//@route PUT /:id
//@access private
const updateUser = async (req, res, next) => {
  try {
    const reqUser = await checkAuth(req);
    if (!reqUser)
      res.status(400).json({ success: false, error: "Invalid authorization" });
    if (reqUser.authority != process.env.ADMIN)
      res
        .status(403)
        .json({ success: false, error: "Not authorized to access this data" });
    const id = req.params.id;
    if (!id) res.status(403).json({ success: false, error: "Invalid ID" });
    let user = await User.findById(id);
    if (!user)
      res.status(404).json({ success: false, error: "Cannot find user" });
    await User.findByIdAndUpdate(id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

//@desc Delete a user
//@route DELETE /:id
//@access private
const deleteUser = async (req, res, next) => {
  try {
    const reqUser = await checkAuth(req);
    if (!reqUser)
      res.status(400).json({ success: false, error: "Invalid authorization" });
    if (reqUser.authority != process.env.ADMIN)
      res
        .status(403)
        .json({ success: false, error: "Not authorized to access this data" });
    const id = req.params.id;
    if (!id) res.status(403).json({ success: false, error: "Invalid ID" });
    const user = await User.findById(id);
    if (!user)
      res.status(404).json({ success: false, error: "Cannot find user" });
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

//@desc Change user password
//@route PUT /change-password
//@access private
const changePassword = async (req, res, next) => {
  try {
    const user = await checkAuth(req);
    if (!user)
      res.status(400).json({ success: false, error: "Invalid authorization" });
    const { previous_password, new_password } = req.body;
    if (!previous_password || !new_password)
      res
        .status(403)
        .json({ success: false, error: "Invalid password parameters" });
    if (await bcrypt.compare(previous_password, user.password)) {
      const hashedPassword = await bcrypt.hash(new_password, 10);
      user.password = hashedPassword;
      await User.findByIdAndUpdate(id, user);
      res.status(200).json({ success: true, data: user });
    } else {
      res
        .status(403)
        .json({ success: false, error: "No permission to change password" });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

//@desc Login user
//@route GET /login
//@access public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      res
        .status(403)
        .json({ success: false, error: "Invalid login information" });
    const user = await User.findOne({ email: email });
    if (!user)
      res.status(404).json({ success: false, error: "User not found" });
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            authority: user.authority,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.EXPIRE_IN || "24h" }
      );
      res.status(200).json({ success: true, data: accessToken });
    } else {
      res
        .status(404)
        .json({ success: false, error: "No such user / invalid information" });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

export {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  loginUser,
};
