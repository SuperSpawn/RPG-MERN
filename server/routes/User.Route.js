import express from "express";
const router = express.Router();

import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  loginUser,
} from "../controllers/User.Controller.js";

router.get("/", getUsers);
router.post("/", createUser);
router.put("/change-password", changePassword);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
