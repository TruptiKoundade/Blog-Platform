import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

//create blog
export const createBlog=async(req,res)=>{
    try{
       const { title, content } = req.body;

       const image = req.file? `/uploads/${req.file.filename}`: "";

        if(!title || !content){
            return res.status(400).json({
                success:false,
                message:"Title and content are required"
            });
        }
        const blog=await Blog.create({
            title,
            content,
            image,
            author:req.user._id,
        });
        res.status(201).json({
            success:true,
            message:"Blog created successfully",
            blog,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    };
}
//GET ALL BLOGS

export const getAllBlogs=async(req,res)=>{
    try{
        const blogs=await Blog.find()
        .populate("author","name email profileImage")  //to replace the author's ObjectId with selected user details.
        .sort({createdAt:-1}); //Sorts the blogs by createdAt in descending order, so the newest blog appears first.

        res.status(200).json({
            success:true,
            count:blogs.length,
            blogs,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
//get single Blog by id
export const getBlogById=async(req,res)=>{
    try{
        const blog=await Blog.findById(req.params.id)
        .populate("author","name email profileImage");

        if(!blog){
            return res.status(404).json({
                success:false,
                message:"Blog not found",
            });
        }
// Get comment for this blog
        const comments=await Comment.find({blog:blog._id})
        .populate("user","name profileImage")
        .sort({createdAt:-1});

        res.status(200).json({
            success:true,
            blog,comments,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
 }
 //update blog
export const updateBlog=async(req,res)=>{
    try{
       const { title, content } = req.body;

        const blog=await Blog.findById(req.params.id);

        if(!blog){
            return res.status(404).json({
                success:false,
                message:"Blog not found",
            });
        }
        if(blog.author.toString()!==req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to update this blog",
            })
        }
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        if (req.file) {
           blog.image = `/uploads/${req.file.filename}`;
        }

        const updateBlog=await blog.save();

        res.status(200).json({
            success:true,
            message:"Blog updated successfullt",
            blog:updateBlog,
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
//Delete blog
export const deleteBlog=async(req,res)=>{
    try{
        const blog=await Blog.findById(req.params.id);
        
        if(!blog){
            return res.status(400).json({
                success:false,
                message:"Blog not found",
            });
        }
        if(blog.author.toString()!==req.user._id.toString()){
           return res.status(403).json({
            success:false,
            message:"You are not authorized to delete this blog",
           });
        }
        //Delete all comments related to this blog
        await Comment.deleteMany({
            blog:blog._id,
        });

        //Delete the blog
        await blog.deleteOne();

        res.status(200).json({
            success:true,
            message:"Blog deleted successfully",
        });
         
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
export const toggleLike=async(req,res)=>{
    try{
        const blog=await Blog.findById(req.params.id);

        if(!blog){
            return res.status(404).json({
                success:false,
                message:"Blog not found",
            });
        }

        const userId=req.user._id.toString();

        //Check if user has already liked the blog
        const alreadyLiked=blog.likes.some((id)=>   //.some() checks whether at least one element matches the condition.
            id.toString()===userId
        );

        if(alreadyLiked){
            //Unlike
            blog.likes=blog.likes.filter((id)=>id.toString()!==userId);

            await blog.save();

            return res.status(200).json({
                success:true,
                message:"Blog unliked successfully",
                totalLikes:blog.likes.length,
            });
        }

        //Like
        blog.likes.push(userId);

        await blog.save();

        res.status(200).json({
            success:true,
            message:"Blog liked successfully",
            totalLikes:blog.likes.length
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};