import UserModal from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()
    const { username, content } = await request.json();

    try {
        const user = await UserModal.findOne(username)
        if (!user) {
            Response.json({
                success: false,
                message: 'User Not Found'
            }, { status: 401 })
        }

        // now check the  user accepting messages or not 
        if (!user?.isAcceptingMessage) {
            Response.json({
                success: false,
                message: 'User is Not Accepting Messages',
            }, { status: 403 })
        }
        const newMessage = { content, createdAt: new Date() }
        user?.message.push(newMessage as Message)
        await user?.save()
        Response.json({
            success: true,
            message: 'Message send successfully'
        }, { status: 200 })

    } catch (error) {
        console.log(error);

        Response.json({
            success: false,
            message: 'Error sending message'
        }, { status: 401 })
    }
}