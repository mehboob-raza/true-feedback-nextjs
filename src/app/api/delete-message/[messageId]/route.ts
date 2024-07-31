import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

// first you have to check the user logged in or not

// and using pipeline aggregation to get message , mongoDb feature

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const messageId = params.messageId
    await dbConnect()
    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {
        Response.json({
            success: false,
            message: 'Not Authenticated'
        }, { status: 403 })
    }

    try {
        const updateResult = await UserModal.updateOne(
            { _id: user._id },
            { $pull: { message: { _id: messageId } } }
        )

        if (updateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: 'message not Found or already deleted'
            }, { status: 404 })
        }
        Response.json({
            success: true,
            message: 'Successfully  deleted '
        }, { status: 200 })
    } catch (error) {
        console.log('Error deleting message', error);

        return Response.json({
            success: false,
            message: 'Error deleting message'
        }, { status: 403 })
    }
}