import express from "express";
import {
    getAllFortress,
    createFortress,
    getFortress,
    updateFortress,
    deleteFortress,
} from "../controllers/Fortress.Controller.js";

const router = express.Router();

router.get("/", getAllFortress);
router.post("/", createFortress);
router.get("/:id", getFortress);
router.put("/:id", updateFortress);
router.delete("/:id", deleteFortress);

export default router;
