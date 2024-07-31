'use client'

import MessageCards from '@/components/MessageCards'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/User'
import { acceptMessagesSchema } from '@/schemas/AcceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@react-email/components'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitching, setIsSwitching] = useState(false)

    const {toast } = useToast()

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter(m => m.id !== messageId))
    }

    const { data: session } = useSession()
    
    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema  )
    })

    const {register, watch, setValue} = form

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitching(true)
        try {
            const response = await axios.get<ApiResponse>(`/api/accept-messages`)
            setValue('acceptMessages', response.data.isAcceptingMessage)
            
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch messages Settings",
                variant:'destructive'
            })
        } finally {
            setIsSwitching(false)
            setIsLoading(false)
        }
    }, [setValue])
    
    const fetchMessages = useCallback(async (refresh :boolean = false) => {
        setIsLoading(true)
        setIsSwitching(false)
        try {
            const response = await axios.get<ApiResponse>(`api/get-messages`)
            setMessages(response.data?.messages || [])

            if (refresh) {
                toast({
                    title: 'Refresh Messages',
                    description: 'Showing Latest Messages',
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch messages Settings",
                variant:'destructive'
            })
        }
        finally {
            setIsLoading(false)
            setIsSwitching(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages()
        fetchAcceptMessages()
    }, [session, setValue, fetchMessages, fetchAcceptMessages, set])

    const handleSwitchChange = async () => {
       try {
           const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
            acceptMessages: !acceptMessages
           })
           setValue('acceptMessages', !acceptMessages)
           toast({
               title: response.data?.message,
               variant :'default'
           })

       } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch messages Settings",
                variant:'destructive'
            })
       }
    } 

    const {username} = session?.user as User

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: 'Copy to Clipboard', 
            description: 'Url Copied to Clipboard'
        })
    }
    
    if (!session || !session.user) {
        return <div>Please Login</div>
    }

   return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
        <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
        <div className='mb-4'>
            <h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>
            <div className='flex items-center'>
                <input 
                       type='text'
                       value={profileUrl}
                       disabled
                       className='input input-bordered w-full p-2 mr-2'
                />
                <Button onClick={copyToClipBoard}>Copy</Button>
            </div>
           </div>
           
           <div>
               <Switch
                   {...register('acceptMessages')}
                   checked={acceptMessages}
                   onCheckedChange={handleSwitchChange}
                   disabled={isSwitching}
               />
               <span className='ml-2'>
                    Accept Messages : {acceptMessages ? 'On' : 'Off'}
               </span>
           </div>
           
           <Button
            className='mt-4'
            // variant='outline'
               onClick={(e) => {
                   e.preventDefault();
                   fetchMessages(true)
                }}
           >
               {
                   isLoading ? (
                   <Loader2 className='h-4 w-4 animate-spin'/>
                   ) : (
                           <RefreshCcw className='h-4 w-4' />
                   )
               }
           </Button>
           <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
               {
                   messages?.length > 0 ? (
                       messages?.map((message, index) => {
                           // eslint-disable-next-line react/jsx-key
                           return <MessageCards 
                                                       //    key={message._id}
                               message={message}
                               onMessageDelete={handleDeleteMessage}
                           />
                       } )
                   ) : <p>No Message To Display</p>
                   
               }
           </div>
    </div>
  )
}

export default Dashboard