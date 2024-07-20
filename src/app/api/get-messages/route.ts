import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

// first you have to check the user logged in or not

// and using pipeline aggregation to get message , mongoDb feature

export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {
        Response.json({
            success: false,
            message: 'Not Authenticated'
        }, { status: 403 })
    }

    // we converted user type into string in authoptions/option thats why now we are using this method in aggregation we have to perform like this to get user's id  
    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModal.aggregate([
            { $match: { id: userId } },
            { $unwind: '$message' }, //my messages are in the trype of array of objects by this i'm converting them into objects 
            { $sort: { 'message.createdAt': -1 } },
            { $group: { _id: '$_id', message: { $push: '$message' } } }
        ])
        if (!user || user.length === 0) {
            Response.json({
                success: false,
                message: 'User Not Found'
            }, { status: 401 })

        }
        Response.json({
            success: true,
            message: user[0].message
        }, { status: 200 })
    } catch (error) {
        console.log(error);

        Response.json({
            success: false,
            message: 'Error get message'
        }, { status: 500 })
    }
}