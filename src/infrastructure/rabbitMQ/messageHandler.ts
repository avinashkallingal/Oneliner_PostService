import { postController } from "../../interfaces/controller/postController";
import rabbitMQConfig from "../config/rabbitMq";
import RabbitMQClient from "./client";

export default class MessageHandler {
  static async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response;

    switch (operation) {
      case "create-post":
        console.log("Post Service - operation", operation);
        console.log("data sent from api", data);
        response = await postController.addpost(data);
        break;
      case "get-all-posts":
        console.log("Post Service - operation", operation);
        response = await postController.fetchedAllPosts(data);
        break;
      case "get-pdf-url":
        console.log("Post Service - operation", operation);
        response = await postController.fetchPdfUrl(data);
        break;
      case "like-post":
        console.log("Post Service - operation", operation);
        response = await postController.likePost(data);
        break;
      case "edit-post":
        console.log("Post Service - operation", operation);
        console.log("data sent from api", data);
        response = await postController.editPost(data);
        break;
        case "delete-post":
        console.log("Post Service - operation", operation);
        console.log("data sent from api", data);
        response = await postController.deletePost(data);
        break;

      default:
        response = { error: "Operation not found" };
        break;
    }
    console.log("produce message : ", response, replyTo, correlationId);

    await RabbitMQClient.produce(response, correlationId, replyTo);
  }
}
