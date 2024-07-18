import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";


export async function POST(req: Request, res: Response) {
    await dbConnect()
    try {
        const { username, email, password } = await req.json()
        const existingUserVerifiedByUsename = await UserModal.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsename) {
            return Response.json({
                success: false,
                message: 'Username already Exists'
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModal.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already Exists with this email address",
                }, { status: 500 })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModal({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            })

            await newUser.save()
        }

        // send verification email 
        const emailResponse = await sendVerificationEmail(
            email, username, verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User Registered successfully, please verify your email address"
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: 'Error Registering User'
        }, {
            status: 500
        })

    }
}

