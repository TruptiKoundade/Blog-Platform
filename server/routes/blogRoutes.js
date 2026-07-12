import express from "express";

import{
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    toggleLike
} from "../controllers/blogcontroller.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router=express.Router();

//public routes
router.get("/",getAllBlogs);
router.get("/:id",getBlogById);

//protected routes
router.post("/", protect, upload.single("image"), createBlog);
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete("/:id",protect,deleteBlog);
router.put("/:id/like",protect,toggleLike);

export default router;
