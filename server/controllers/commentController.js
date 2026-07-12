import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const addComment=async(req,res)=>{
    try{
        const{text}=req.body;
        const blog=await Blog.findById(req.params.blogId);

        if(!blog){
            return res.status(400).json({
                success:false,
                message:"Blog not found"
            });
        }
        const comment=await Comment.create({
            blog:blog._id,
            user:req.user._id,
            text
        })
        blog.comments.push(comment._id);

        await blog.save();

        res.status(201).json({
            success:true,
            message:"Comment added successfully",
            comment
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
export const getComments=async(req,res)=>{
    try{
        const comments=await Comment.find({
            blog:req.params.blogId
        })
        .populate("user","name profileImage")
        .sort({createdAt:-1});

        res.status(200).json({
            success:true,
            count:comments.length,
            comments
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};
export const updateComment=async(req,res)=>{
    try{
        const{text}=req.body;
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return res.status(404).json({
                success:false,
                message:"Comment not found"
            });
        }
        if(comment.user.toString()!==req.user._id.toString()){
            return res.status(401).json({
                success:false,
                message:"Not authorized to update this comment"
            });
        }
        comment.text=text;

        await comment.save();

        res.status(200).json({
            success:true,
            message:"Comment updated successfully",
            comment
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
export const deleteComment=async(req,res)=>{
    try{
        const comment=await Comment.findById(req.params.commentId);

        if(!comment){
            return res.status(404).json({
                success:false,
                message:"Comment"
            });
        }
        if(comment.user.toString()!==req.user._id.toString()){
           return res.status(401).json({
            success:false,
            message:"Not authorized to delete this comment"
           });
        }
        await Blog.findByIdAndUpdate(comment.blog,{
            $pull:{
                comments:comment._id
            }
        });
        await comment.deleteOne();

        res.status(200).json({
            success:true,
            message:"Comment deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};