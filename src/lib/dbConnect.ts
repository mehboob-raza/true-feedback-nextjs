// import mongoose from "mongoose";

// type connectionObject = {
//     isConnected?: number
// }

// const connection: connectionObject = {}

// async function dbConnect(): Promise<void> {
//     if (connection.isConnected) {
//         console.log('Already connected');
//         return
//     }
//     try {
//         const db = await mongoose.connect(process.env.MONGOBD_URI || '')
//         connection.isConnected = db.connections[0].readyState
//     } catch (err) {
//         process.exit(1)
//     }
// }

// export default dbConnect

import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('Already connected to MongoDB');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {
            serverSelectionTimeoutMS: 5000, // Adjust the timeout as needed
        });

        connection.isConnected = db.connections[0].readyState;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process with an error code
    }
}

export default dbConnect;
