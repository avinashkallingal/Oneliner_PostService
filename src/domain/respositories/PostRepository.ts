import mongoose from "mongoose";
import { Post } from "../../model/PostModel";
import { IPost, ISavePostData } from "../entities/IPost";
import { IPostRepository } from "./IPostRepository";

export class PostRepository implements IPostRepository {
  async save(
    post: ISavePostData
  ): Promise<{ success: boolean; message: string; data?: IPost }> {
    try {
      console.log("00");
      console.log(
        post.summary,
        "-------------------------------description of the post----------"
      );
      const newPost = new Post({
        userId: post.userId,
        genre: post.genre,
        summary: post.summary,
        title: post.title,
        imageUrl: post.imageUrl,
        pdfUrl: post.pdfUrl,
        // originalname: post.originalname,
      });
      console.log("0000abc");
      const savedPost = await newPost.save();
      console.log(savedPost);
      console.log("0000000000");
      if (!savedPost) {
        return { success: false, message: "Can't save data" };
      }
      console.log("000000000000================");
      return {
        success: true,
        message: "Data saved successfullt",
        data: savedPost,
      };
    } catch (error) {
      const err = error as Error;
      console.log("Error saving posts", err);
      return { success: false, message: err.message };
    }
  }

  async update(
    post: any
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log("00");
      console.log(
        post,
        "-------------------------------description of the post data++++++----------"
      );
      // const newPost = new Post({
      //     userId: post.userId,
      //     genre:post.genre,
      //     summary: post.summary,
      //     title: post.title,
      //     imageUrl: post.imageUrl,
      //     pdfUrl:post.pdfUrl,
      //     // originalname: post.originalname,
      // });
      // console.log('0000');
      // const savedPost = await newPost.save();
      // console.log(savedPost);
      // console.log('0000000000')
      // if (!savedPost) {
      //     return { success: false, message: "Can't save data" };
      // }
      // console.log('000000000000================')
      // return { success: true, message: "Data saved successfullt", data: savedPost };

      const updateFields: any = {};
      if (post.title !== undefined && post.title.length !== 0) {
        updateFields.title = post.title;
      }
      if (post.genre !== undefined && post.genre.length !== 0) {
        updateFields.genre = post.genre;
      }
      if (
        post.imageUrl !== undefined &&
        post.imageUrl !== null &&
        post.imageUrl !== "" &&
        post.imageUrl.length !== 0
      ) {
        updateFields.imageUrl = post.imageUrl;
      }
      if (
        post.pdfUrl !== undefined &&
        post.pdfUrl !== null &&
        post.pdfUrl !== "" &&
        post.pdfUrl.length !== null
      ) {
        updateFields.pdfUrl = post.pdfUrl;
      }
      if (post.summary !== undefined && post.summary.length !== 0) {
        updateFields.summary = post.summary;
      }
      if (post.tags !== undefined && post.tags !== null) {
        updateFields.tags = post.tags;
      }

      console.log(post.postId, " post id +++++++++++++++++++++");
      const postExist = await Post.updateOne(
        { _id: post.postId },
        { $set: updateFields }
      );
      console.log(updateFields, "updated fields from react body");

      if (postExist.modifiedCount > 0) {
        const updatedPost = await Post.findById(post.postId);
        return { success: true, message: "postUpdated" };
      } else {
        console.log("No changes were made to the document.");
        return { success: false, message: "no change updated" };
      }
    } catch (error) {
      const err = error as Error;
      console.log("Error saving posts", err);
      return { success: false, message: err.message };
    }
  }

  async findAllPost(
    data: any
  ): Promise<{ success: boolean; message: string; data?: IPost[] }> {
    try {
      // const posts = await Post.find({ isDelete: false }).sort({ created_at: -1 }).limit(page*5);
      console.log(data.genre, "  pages is post service repo");
      let posts:any={}
     if(data.genre=="All"){
        posts = await Post.find({ isDelete: false }).sort({
          created_at: -1,
        });
    }else{
        posts = await Post.find({ genre:data.genre,isDelete: false}).sort({
            created_at: -1,
          });

    }

        if (!posts) {
          return { success: false, message: "no posts found" };
        }
        return { success: true, message: "post found", data: posts };
      
    } catch (error) {
      const err = error as Error;
      console.log("Error fetching all post", err);
      throw new Error(`Error fetching post: ${err.message}`);
    }
  }

  async findUserPost(
    user: any
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log(user, "email in repo++++++++++++++++++++");

      const posts: any = await Post.find({
        userId: user.userId.toString(),
      }).sort({ created_at: -1 });
      console.log(posts, "----post data");
      if (!posts || posts.length === 0) {
        return { success: false, message: "No posts found" };
      }
      return { success: true, message: "Posts found", data: posts };
    } catch (error) {
      const err = error as Error;
      console.log("Error fetching users post", err);
      throw new Error(`Error fetching users post: ${err.message}`);
    }
  }

  
  async getPost(
    post: any
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log(post, "view post in repo++++++++++++++++++++");

      const posts: any = await Post.find({
        _id: post.postId.toString(),
      }).sort({ created_at: -1 });
      console.log(posts, "----post data");
      if (!posts || posts.length === 0) {
        return { success: false, message: "No posts found" };
      }
      return { success: true, message: "Posts found", data: posts };
    } catch (error) {
      const err = error as Error;
      console.log("Error fetching users post", err);
      throw new Error(`Error fetching users post: ${err.message}`);
    }
  }

  async findPost(
    id: String
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log(id, " id from front api gate way");
      const post = await Post.findById(id);
      // const post = await Post.find({ _id: id });
      console.log(post, "----post data for a sinle post");
      if (!post) {
        return { success: false, message: "No posts found" };
      }
      return { success: true, message: "Posts found", data: post };
    } catch (error) {
      const err = error as Error;
      console.log("Error fetching users post", err);
      throw new Error(`Error fetching users post: ${err.message}`);
    }
  }

  async getNewPosts() {
    try {
      const posts = await Post.find().sort({ _id: -1 }).limit(5);
      const count = await Post.find({}).countDocuments();
      return { posts, count };
    } catch (error) {
      const err = error as Error;
      console.log("Error fetching users post", err);
      throw new Error(`Error fetching users post: ${err.message}`);
    }
  }

  async likePost(data: any) {
    try {
      // Convert postId to ObjectId if necessary
      const userId = new mongoose.Types.ObjectId(data.userId);
      console.log(data, " data in post repo");
      const post = await Post.findById(data.postId);
      console.log(post, " post details in like function");
      console.log(data.likeFlag, " this is like flag");
      if (data.likeFlag) {
        await Post.findByIdAndUpdate(data.postId, {
          $push: { likes: { userId: data.userId } },
        });
        console.log("liked by user");
        return { success: true, message: "liked by user", like: true };
      } else {
        await Post.findByIdAndUpdate(data.postId, {
          $pull: { likes: { userId: data.userId } },
        });
        console.log("unliked by user");
        return { success: true, message: "unliked by user", like: false };
      }
    } catch (error) {
      const err = error as Error;
      console.log("Error liking post", err);
      throw new Error(`Error fetching like post: ${err.message}`);
    }
  }

  async deletePost(post: any) {
    try {
      console.log(post, " postId in repo++++++++++");
      const posts = await Post.deleteOne({ _id: post.postId });
      return { success: true, message: "deleted" };
    } catch (error) {
      const err = error as Error;
      console.log("Error fetching users post", err);
      throw new Error(`Error fetching users post: ${err.message}`);
    }
  }

  async reportPost(post: any) {
    try {   
      
     
      const posts = await Post.findByIdAndUpdate(
        post.data.postId, // Directly pass the post ID here
        { 
          $push: { 
            reportPost: { 
              UserId: post.data.reportUserId, 
              reason: post.data.reason 
            } 
          } 
        },
        { new: true } // To return the updated document
      );   
      
        
 
      
 
      return { success: true, message: "report done" };
    } catch (error) {
      const err = error as Error;
      console.log("Error fetching users post", err);
      throw new Error(`Error reporting  post: ${err.message}`);
    }
  }

  
  async adminRemovePost(post: any) {
    try {   
      
     
      const posts = await Post.findByIdAndUpdate(
        {_id:post.data}, // Directly pass the post ID here
        { 
          $set: { isDelete: true } // Set the isDeleted field to true
        }
       
      );      
        
      console.log(posts," posts removed admin 988798796879687698768769")
      
 
      return { success: true, message: "remove done" };
    } catch (error) {
      const err = error as Error;
      console.log("Error fetching users post", err);
      throw new Error(`Error reporting  post: ${err.message}`);
    }
  }

  async addComment(data:any) {
    try {
      console.log(data,"111111111")
      // Basic validation
      if (!data.data.postId || !data.data.userId) {
        return false;
      }

      if (data.data.parentCommentId) {
        console.log("222222222")
        // Handle replying to an existing comment
        const post = await Post.updateOne(
          { _id: data.data.postId, "comments._id": data.data.parentCommentId },
          {
            $addToSet: {
              "comments.$.replies": {
                // Accessing the 'replies' field of the specific comment
                UserId: data.data.userId,
                content: data.data.replayText,
                userName: data.data.userName,
                avatar: data.data.avatar,
              },
            },
          }
        );
        console.log(post);
        return post;
      } else {
        console.log("33333333")
        console.log(data.data.postId," post id")
        // Handle adding a new comment
        const post = await Post.updateOne(
          { _id: data.data.postId },
          {
            $addToSet: {
              comments: {
                UserId: data.data.userId,
                content: data.data.content,
                userName: data.data.userName,
                avatar: data.data.avatar,
              },
            },
          }
        );
        console.log(post," updated result");
        return post;
      }
    } catch (error) {
      console.log("error in comment method", error);
      return null;
    }
  }

  async getPostDataForAdmin(
    user: any
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {


      const posts: any = await Post.find({ reportPost: { $ne: [] } }).sort({ created_at: -1 });
      console.log(posts, "----post data in admin get post+%%%%%%%%%%%%%%%%%%%");
      if (!posts || posts.length === 0) {
        return { success: false, message: "No posts found" };
      }
      return { success: true, message: "Posts found", data: posts };
    } catch (error) {
      const err = error as Error;
      console.log("Error fetching users post", err);
      throw new Error(`Error fetching users post: ${err.message}`);
    }
  }

}
