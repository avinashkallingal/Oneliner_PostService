import { PostService } from "../../application/use-case/post"
import { IAddPostData } from "../../domain/entities/IPost";

class PostController {

    private postService: PostService;

    constructor() {
        this.postService = new PostService();

    }

    async addpost(data: IAddPostData) {
        try {
            const result = await this.postService.addPost(data);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async fetchedAllPosts(page:number) {
        try {
            console.log(page,'-------------------------hello')
            const result = await this.postService.getAllPosts(page)
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

   
   

    
}

export const postController = new PostController();