import { PostService } from "../../application/use-case/post"
import { IAddPostData } from "../../domain/entities/IPost";

class PostController {

    private postService: PostService;

    constructor() {
        this.postService = new PostService();

    }

    async addpost(data: IAddPostData) {
        try {
            console.log("this is save post++++++++++")
            const result = await this.postService.addPost(data);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async editPost(data: IAddPostData) {
        try {

            console.log("this is edit post++++++++++")
            const result = await this.postService.editPost(data);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async fetchedAllPosts(data:any) {
        try {
            console.log(data,'-------------------------hello')
            const result = await this.postService.getAllPosts(data)
        
            return result;
        } catch (error) {

        }
    }

    
    async fetchedUserPosts(user:any) {
        try {
            console.log(user.userId,'-------------------------hello')
            const result = await this.postService.getUserPosts(user)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }

    
    async getPost(post:any) {
        try {
            console.log(post.postId,'-------------------------hello')
            const result = await this.postService.getPost(post)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }

    async fetchPdfUrl(data:any){
        try {
            console.log(data,'-------------------------hello')
            const result = await this.postService.getPdfUrl(data)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }

    async fetchImageUrl(data:any){
        try {
            console.log(data,'-------------------------hello')
            const result = await this.postService.getImageUrl(data)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }

    async likePost(data:any){
        try {
            console.log(data,'-------------------------hello')
            const result = await this.postService.likePost(data)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }

    async deletePost(data:any){
        try {
            console.log(data,'-------------------------hello')
            const result = await this.postService.deletePost(data)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }

    
    async addComment(data:any){
        try {
            console.log(data,'-------------------------in addcomment function ')
            const result = await this.postService.addComment(data)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }

    async reportPost(data:any){
        try {
            console.log(data,'-------------------------report post function ')
            const result = await this.postService.reportPost(data)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }


    async adminRemovePost(data:any){
        try {
            console.log(data,'-------------------------admin remove post function ')
            const result = await this.postService.adminRemovePost(data)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }

    
    async getPostDataForAdmin(data:any){
        try {
            console.log(data,'-------------------------rport post function ')
            const result = await this.postService.getPostDataForAdmin(data)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }
    

   
   

    
}

export const postController = new PostController();