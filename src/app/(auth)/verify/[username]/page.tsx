'use client'

import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/VerifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            })
            toast({
                title: 'Success',
                description: response.data.message,
            })
            router.replace('/sign-in')
        } catch (error) {
            console.error('Error verifying the code:', error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError?.response?.data.message ?? 'Verify Code Failed'
            toast({
                title: 'Verify Code Failed',
                description: errorMessage,
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Verification Code"
                                    {...form.register('code')}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                </>
                            ) : 'Verify'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
