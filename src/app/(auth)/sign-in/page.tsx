"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {useDebounceValue} from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/SignUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { signInSchema } from "@/schemas/SignInSchema"
import { signIn } from "next-auth/react"

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
  const router = useRouter()

  // zod implementation 
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  })



  const onSubmit = async(data : z.infer<typeof signInSchema >) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier : data.identifier,
      password : data.password
    })    
    if (result?.error) {
      if (result.error == 'CredentialsSignin') {
        toast({
        title: 'Login Failed',
        description: 'Incorrect credentials',
        variant: 'destructive'
      })
      } else {
        toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      })
      }
      
    } 
    if (result?.url) {
      router.replace('/dashboard')
    }
  }       
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Messages
          </h1>
          <p className="mb-4"> SignUp To Start Your Anonymous Adventure</p>

        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field}        
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type='password'  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting}>
              SignIn 
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            New? Register Here {' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign Up
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default SignIn