import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
    UserId: string;
    imageUrl: string[];
    pdfUrl:string;
    username: string[];
    title:string;
    summary: string;
    genre:string;
    tags?:string[];
    isDelete: boolean;
    likes?: Array<{
        UserId: string;
        postUser: string;
        createdAt: Date;
    }>;
    comments?: Array<{
        _id?: mongoose.Types.ObjectId;
        UserId: string;
        content: string;
        isEdited: boolean;
        createdAt: Date;
    }>;
    reportPost?: Array<{
        UserId: string;
        reason: string;
    }>
    created_at: Date;
}


export interface IAddPostData {
    userId: string;
    username?:string;
    summary: string;
    genre?:string;
    title: string;
    tags?:string[];
    images?: {
        buffer: Buffer;
        originalname?: string;
    }[];
    pdf?:{buffer:Buffer};

}


export interface ISavePostData {
    userId: string;
    summary?: string;
    title?: string
    imageUrl?: string[];
    pdfUrl?:string;
    originalname?: string[];
    genre?:string;

}