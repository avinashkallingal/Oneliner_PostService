import { IAddPostData, IPost } from "../../domain/entities/IPost";
import {
  uploadFileToS3,
  fetchFileFromS3,
  deleteFileFromS3,
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
    data: any
  ): Promise<{ success: boolean; message: string; data?: IPost[] }> {
    try {
      const result = await this.postRepo.findAllPost(data);
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
              imageUrlS3: imageUrls,
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


  async getUserPosts(
    user: any
  ): Promise<{ success: boolean; message: string; data?: any }> {
    const result = await this.postRepo.findUserPost(user);
    if (!result.success || !result.data) {
      return { success: false, message: "No data found" };
    }
    const postsWithImages = await Promise.all(
      result.data?.map(async (post:any) => {
        if (post.imageUrl && post.imageUrl.length > 0) {
          const imageUrls = await Promise.all(
            post.imageUrl.map(async (imageKey:any) => {
              const s3Url = await fetchFileFromS3(imageKey, 604800);
              return s3Url;
            })
          );
          const plainPost = (post as Document).toObject();
          return {
            ...plainPost,
            imageUrlS3: imageUrls,
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
  }

  
  async getPost(
    post: any
  ): Promise<{ success: boolean; message: string; data?: any }> {
    const result = await this.postRepo.getPost(post);
    if (!result.success || !result.data) {
      return { success: false, message: "No data found" };
    }
    const postsWithImages = await Promise.all(
      result.data?.map(async (post:any) => {
        if (post.imageUrl && post.imageUrl.length > 0) {
          const imageUrls = await Promise.all(
            post.imageUrl.map(async (imageKey:any) => {
              const s3Url = await fetchFileFromS3(imageKey, 604800);
              return s3Url;
            })
          );
          const plainPost = (post as Document).toObject();
          return {
            ...plainPost,
            imageUrlS3: imageUrls,
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

  async getImageUrl(
    data: any
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const result:any = await this.postRepo.findPost(data.postId);
      let s3Url = "";
      if (!result.success || !result.data) {
        return { success: false, message: "No data found" };
      }
      if (result.data.imageUrl && result.data.imageUrl.length > 0) {
        s3Url = await fetchFileFromS3(result.data.imageUrl, 604800);
      }
      return { success: true, message: "image url got", data: s3Url };
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


  async fetchLikeList(
    data: any
  ): Promise<{ success: boolean; message: string;like_data?:IPost }> {

    const result:any=await this.postRepo.fetchLikeList(data);
    if (!result.success) {
      return { success: false, message: "No data found" };
    }
   
      return {success:true,message:"like data got",like_data:result.like_data}
        
  }

  async deletePost(
    data: any
  ): Promise<{ success: boolean; message: string;like?:boolean }> {
    console.log(data.imageKey[0]," image key")
    const responseImage=deleteFileFromS3(data.imageKey[0])
    const responsePdf=deleteFileFromS3(data.pdfKey)

    console.log(responseImage," delete response in post usecase")
    console.log(responsePdf," delete response in post usecase")

    const result:any=await this.postRepo.deletePost(data);
    if (!result.success) {
      return { success: false, message: "No data found" };
    }
    
      return {success:true,message:"deleted",like:true}
   
    
  }
  async addComment(data: any) {
    try {

        console.log(data, '---------data in the post service ')
        const comment = await this.postRepo.addComment(data);
        if (!comment) {
            return { success: false, message: 'unable to comment the post' }
        }
        return { success: true, message: 'commented the post' }
    } catch (error) {
        console.log('Error in likePost in applicaiton user service', error);
        return { success: false, message: 'Someting went wrong' }
    }
}

async reportPost(data: any) {
  try {

      console.log(data, '---------data in the post service ')
      const report = await this.postRepo.reportPost(data);
      if (!report) {
          return { success: false, message: 'unable to comment the post' }
      }
      return { success: true, message: 'post reported' }
  } catch (error) {
      console.log('Error in likePost in applicaiton user service', error);
      return { success: false, message: 'Someting went wrong' }
  }
}

async adminRemovePost(data: any) {
  try {

      console.log(data, '---------data in the post service ')
      const report = await this.postRepo.adminRemovePost(data);
      if (!report) {
          return { success: false, message: 'unable to comment the post' }
      }
      return { success: true, message: 'post reported' }
  } catch (error) {
      console.log('Error in likePost in applicaiton user service', error);
      return { success: false, message: 'Someting went wrong' }
  }
}


async getPostDataForAdmin(data: any) {
  try {
      console.log(data, '---------data in the post service ')
      const report = await this.postRepo.getPostDataForAdmin(data);
      // const postData=report.data
      if (!report) {
          return { success: false, message: 'unable to comment the post' }
      }

      //
      const postsWithImages = await Promise.all(
        report.data?.map(async (post:any) => {
          if (post.imageUrl && post.imageUrl.length > 0) {
            const imageUrls = await Promise.all(
              post.imageUrl.map(async (imageKey:string) => {
                const s3Url = await fetchFileFromS3(imageKey, 604800);
                return s3Url;
              })
            );
            const plainPost = (post as Document).toObject();
            return {
              ...plainPost,
              imageUrlS3: imageUrls,
            };
          }
          return post;
        })
      );
      //


      return { success: true, message: 'post reported', data: postsWithImages, }
  } catch (error) {
      console.log('Error in likePost in applicaiton user service', error);
      return { success: false, message: 'Someting went wrong' }
  }
}
  
}

export { PostService };
