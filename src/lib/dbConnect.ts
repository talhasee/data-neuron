import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connecion: connectionObject = {};

async function dbConnect(): Promise<void> {
    if(connecion.isConnected){
        console.log("Already connected to database");
        return;
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

        connecion.isConnected = db.connections[0].readyState;

        console.log("DB connected Successfully");
        
    } catch (error) {
        console.error(`Database connection failed - ${error}`);
        process.exit(1);
    }
}

export default dbConnect;