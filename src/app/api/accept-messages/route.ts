// this session is to know which user loggedin

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 400 })
    }
    const userId = user._id
    const { acceptMesaages } = await request.json()

    try {
        const updatedUser = await UserModal.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMesaages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "message acceptance status updated successfully"
        }, { status: 200 })

    } catch (error) {
        console.log('failed to update user status to accept messages', error);
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 400 })
    }
    const userId = user._id

    try {
        const foundUser = await UserModal.findById(userId)

        if (!foundUser) {
            return Response.json({
                success: true,
                message: "User Not Found"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 })
    } catch (error) {
        console.log('failed to update user status to accept messages', error);
        return Response.json({
            success: false,
            message: "Error in getting messages status"
        }, { status: 500 })
    }
}
