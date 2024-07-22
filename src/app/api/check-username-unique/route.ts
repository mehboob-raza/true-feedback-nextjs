import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import { z } from 'zod'
import { usernameValidation } from '@/schemas/SignUpSchema'

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username'),
        }
        // validate with zod 
        const result = UsernameQuerySchema.safeParse(queryParams)
        console.log('result', result);

        if (!result.success) {
            const UsernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: UsernameError?.length > 0 ? UsernameError.join(', ') : 'Invalid query Parameters'
            }, { status: 400 })
        }
        const { username } = result.data
        const existingVerifiedUser = await UserModal.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username already taken by another'
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: 'Username is unique'
        }, { status: 200 })

    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: 'Error Checking username'
        }, { status: 500 })
    }
}