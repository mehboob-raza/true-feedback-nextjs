import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModal.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json({
                success: false,
                message: 'User Not Verified'
            }, { status: 500 })
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: 'User Verified'
            }, { status: 200 })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: 'Verification Code Expired, Signup again'
            }, { status: 400 })
        }
        else {
            return Response.json({
                success: false,
                message: 'Incorrect Verification Code '
            }, { status: 400 })
        }
    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: 'Error Verifying User'
        }, { status: 500 })
    }
}
