import { config } from 'dotenv';
config();
import express from "express";
import cors from 'cors';
import { connectToDatabase } from "./src/database/db.js";
import router from "./src/routes/userRoutes.js";

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

app.use("/api/v1", router);

const PORT = process.env.PORT;

async function startServer(){
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();
