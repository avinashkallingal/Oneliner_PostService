import { IPost } from "../entities/IPost";

export interface IPostRepository {
    save(post:{
        originalname:string[],
        imageUrl:string[],
        userId:string,
        pdfUrl:string,
        summary:string,
        title:string,
        genre?:string,
        tags?:string[];
    }):Promise<{success:boolean, message:string,data?:IPost}>
}