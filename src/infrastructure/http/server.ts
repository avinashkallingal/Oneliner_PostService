import express from 'express';
import { databaseConnection } from '../database/mongodb'
import RabbitMQClient from '../rabbitMQ/client';
import config from '../config/config';

const app = express();
app.use(express.json());

const startServer = async () => {
    try {
        await databaseConnection();
        await RabbitMQClient.initialize();
        // app.listen(4002, () => console.log(`postService running on port 4002`))
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        })

    } catch (error) {
        console.log('post srevice running error -->', error); 
    }

}

startServer();