import express from "express";
import {
    getAllCharacter,
    createCharacter,
    getCharacter,
    updateCharacter,
    deleteCharacter,
} from "../controllers/Character.Controller.js";

const router = express.Router();

router.get("/", getAllCharacter);
router.post("/", createCharacter);
router.get("/:id", getCharacter);
router.put("/:id", updateCharacter);
router.delete("/:id", deleteCharacter);

export default router;
