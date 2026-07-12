import express from "express";

import {
    addComment,
    getComments,
    updateComment,
    deleteComment,
}from "../controllers/commentController.js";

import protect from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/:blogId",protect,addComment);
router.get("/:blogId",getComments);
router.put("/:commentId",protect,updateComment);
router.delete("/:commentId",protect,deleteComment);

export default router;