import { IAddPostData, IPost } from "../../domain/entities/IPost";
import {
  uploadFileToS3,
  fetchFileFromS3,
} from "../../infrastructure/s3/s3Actions";
import { PostRepository } from "../../domain/respositories/PostRepository";
import { Document } from "mongoose";

class PostService {
  private postRepo: PostRepository;

  constructor() {
    this.postRepo = new PostRepository();
  }

  async addPost(
    post: IAddPostData
  ): Promise<{ success: boolean; message: string; data?: IPost }> {
    try {
      console.log("data recived in the use-case post applciaotn");
      let imageUrls: string[] = [];
      let pdfUrl: string[] = [];
      let originalNames: string[] = [];
      console.log("1");
      if (post.images && post.images.length > 0) {
        imageUrls = await Promise.all(
          post.images.map(async (image) => {
            console.log(image.originalname, " image urls inside s3 function");
            const buffer = Buffer.isBuffer(image.buffer)
              ? image.buffer
              : Buffer.from(image.buffer);
            console.log(buffer, " showing image buffer++++++++++++++++");
            const imageUrl = await uploadFileToS3(buffer, image.originalname);

            return imageUrl;
          })
        );

        // originalNames = post.images.map((image) => image.originalname);
      }
      if (post.pdf) {
        pdfUrl = await Promise.all(
          post.pdf.map(async (pdf: any) => {
            const buffer = Buffer.isBuffer(pdf.buffer)
              ? pdf.buffer
              : Buffer.from(pdf.buffer);
            const fileName = "example.pdf";
            const pdfUrl1 = await uploadFileToS3(buffer, pdf.originalname);
            return pdfUrl1;
          })
        );
      }

      console.log("2");

      const newPost = {
        userId: post.userId,
        summary: post.summary,
        title: post.title,
        imageUrl: imageUrls,
        pdfUrl: pdfUrl[0],
        originalName: originalNames,
        genre: post.genre,
      };
      console.log("3");

      console.log(imageUrls, "this is image url path");
      const result = await this.postRepo.save(newPost);
      console.log("4");
      console.log(result);
      if (!result.success) {
        return { success: false, message: "Data not saved, error occurred" };
      }

      return { success: true, message: "Data successfully saved" };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message };
    }
  }

  async editPost(
    post: any
  ): Promise<{ success: boolean; message: string; data?: IPost }> {
    try {
      console.log("data recived in the use-case post applciaotn");
      let imageUrls: string[] = [];
      let pdfUrl: string[] = [];
      let originalNames: string[] = [];
      console.log("1");
      if (post.images && post.images.length > 0) {
        imageUrls = await Promise.all(
          post.images.map(async (image:any) => {
            console.log(image.originalname, " image urls inside s3 function");
            const buffer = Buffer.isBuffer(image.buffer)
              ? image.buffer
              : Buffer.from(image.buffer);
            console.log(buffer, " showing image buffer++++++++++++++++");
            const imageUrl = await uploadFileToS3(buffer, image.originalname);

            return imageUrl;
          })
        );

        // originalNames = post.images.map((image) => image.originalname);
      }
      if (post.pdf) {
        pdfUrl = await Promise.all(
          post.pdf.map(async (pdf: any) => {
            const buffer = Buffer.isBuffer(pdf.buffer)
              ? pdf.buffer
              : Buffer.from(pdf.buffer);
            const fileName = "example.pdf";
            const pdfUrl1 = await uploadFileToS3(buffer, pdf.originalname);
            return pdfUrl1;
          })
        );
      }

      console.log("2");

      const newPost = {
        postId:post.postId,
        userId: post.userId,
        summary: post.summary,
        title: post.title,
        imageUrl: imageUrls,
        pdfUrl: pdfUrl[0],
        originalName: originalNames,
        genre: post.genre,
      };
      console.log("3++++++updatepost");

      console.log(imageUrls, "this is image url path");
      const result = await this.postRepo.update(newPost);
      console.log("4");
      console.log(result);
      if (!result.success) {
        return { success: false, message: "Data not saved, error occurred" };
      }

      return { success: true, message: "post successfully updated" };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message };
    }
  }

  async getAllPosts(
    page: number
  ): Promise<{ success: boolean; message: string; data?: IPost[] }> {
    try {
      const result = await this.postRepo.findAllPost(page);
      if (!result.success || !result.data) {
        return { success: false, message: "No data found" };
      }

      const postsWithImages = await Promise.all(
        result.data?.map(async (post) => {
          if (post.imageUrl && post.imageUrl.length > 0) {
            const imageUrls = await Promise.all(
              post.imageUrl.map(async (imageKey) => {
                const s3Url = await fetchFileFromS3(imageKey, 604800);
                return s3Url;
              })
            );
            const plainPost = (post as Document).toObject();
            return {
              ...plainPost,
              imageUrl: imageUrls,
            };
          }
          return post;
        })
      );
      return {
        success: true,
        message: "Images and user datas sent",
        data: postsWithImages,
      };
    } catch (error) {
      console.error("Error in user Posts:", error);
      throw new Error(
        `Error fetching user posts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getPdfUrl(
    data: any
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const result:any = await this.postRepo.findPost(data.postId);
      let s3Url = "";
      if (!result.success || !result.data) {
        return { success: false, message: "No data found" };
      }
      if (result.data.pdfUrl && result.data.pdfUrl.length > 0) {
        s3Url = await fetchFileFromS3(result.data.pdfUrl, 604800);
      }
      return { success: true, message: "pdf url got", data: s3Url };
    } catch (error) {
      console.error("Error in user Posts:", error);
      throw new Error(
        `Error fetching pdf url: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async likePost(
    data: any
  ): Promise<{ success: boolean; message: string;like?:boolean }> {

    const result:any=await this.postRepo.likePost(data);
    if (!result.success) {
      return { success: false, message: "No data found" };
    }
    if(result.like){
      return {success:true,message:"liked",like:true}
    }else{
      return {success:true,message:"unliked",like:false}
    }
    
  }

  async deletePost(
    data: any
  ): Promise<{ success: boolean; message: string;like?:boolean }> {

    const result:any=await this.postRepo.deletePost(data);
    if (!result.success) {
      return { success: false, message: "No data found" };
    }
    
      return {success:true,message:"deleted",like:true}
   
    
  }
}

export { PostService };
