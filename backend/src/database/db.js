import mongoose from "mongoose";

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
    } catch (error) {
        throw new Error("Can't connect to Database")
    }
}

async function disconnectDatabase() {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.log(error);
        throw new Error("Could disconnect from database")
    }
}

export {connectToDatabase, disconnectDatabase};