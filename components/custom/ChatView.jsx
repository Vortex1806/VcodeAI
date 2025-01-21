"use client"
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api'
import Colors from '@/data/Colors'
import Lookup from '@/data/Lookup'
import Prompt from '@/data/Prompt'
import axios from 'axios'
import { useConvex, useMutation } from 'convex/react'
import { ArrowRight, Link, Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { SidebarTrigger, useSidebar } from '../ui/sidebar'
import { toast } from 'sonner'

export const countToken = (inputText) => {
    return inputText.trim().split(/\s+/).filter(word => word).length;
}

const ChatView = () => {
    const { id } = useParams();
    const convex = useConvex();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { Messages, setMessages } = useContext(MessagesContext);
    const [userInput, setUserInput] = useState();
    const { toggleSidebar } = useSidebar();
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateMessages);
    const UpdateToken = useMutation(api.users.UpdateTokenCount);
    const GetWorkSpaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workSpaceId: id
        })
        setMessages(result?.messages);
        console.log(Messages);
    }

    useEffect(() => {
        id && GetWorkSpaceData();
    }, [id])

    useEffect(() => {
        if (Messages?.length > 0) {
            const role = Messages[Messages.length - 1].role;
            if (role == 'user') {
                GetAiResponse();
            }
        }
    }, [Messages])

    const onGenerate = (input) => {
        if (userDetail?.token < 10) {
            toast('You dont have enough tokens!')
            return;
        }
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setUserInput('');
    }

    const GetAiResponse = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(Messages) + Prompt.CHAT_PROMPT;
        const result = await axios.post('/api/ai-chat', {
            prompt: PROMPT
        });
        console.log(result.data.result);
        const airesp = { role: 'ai', content: result.data.result }
        setMessages(prev => [...prev, airesp]);


        await UpdateMessages({
            messages: [...Messages, airesp],
            workSpaceId: id,
        })

        const usedToken = Number(userDetail?.token) - Number(countToken(JSON.stringify(airesp)));
        setUserDetail(prev => ({
            ...prev,
            token: usedToken
        }))

        await UpdateToken({
            token: usedToken,
            userId: userDetail?._id
        })
        setLoading(false);
    }

    return (
        <div className='relative h-[85vh] flex flex-col'>
            <div className='flex-1 overflow-y-scroll scrollbar-hide px-5'>
                {Array.isArray(Messages) && Messages?.map((msg, index) => (
                    <div key={index}
                        className='p-3 rounded-lg mb-2 flex gap-2 items-center leading-7'
                        style={{
                            backgroundColor: Colors.CHAT_BACKGROUND
                        }}>
                        {msg?.role == 'user' && <Image className='rounded-full' src={userDetail?.picture} alt="userimg" width={35} height={35} />}
                        <ReactMarkdown className='flex flex-col'>{msg.content}</ReactMarkdown>

                    </div>
                ))}
                {loading && <div className='p-3 rounded-lg mb-2 flex gap-2 items-start'
                    style={{
                        backgroundColor: Colors.CHAT_BACKGROUND
                    }}
                >
                    <Loader2Icon className='animate-spin' />
                    <h2>Generating response...</h2>
                </div>}

            </div>

            <div className='flex gap-2 items-end'>
                {userDetail && <Image src={userDetail?.picture} alt='user' width={30} height={30} className='rounded-full' onClick={toggleSidebar} />}


                <div className='p-5 border rounded-xl max-w-xl w-full mt-3' style={{ backgroundColor: Colors.BACKGROUND }}>

                    <div className='flex gap-2'>
                        <textarea
                            value={userInput}
                            onChange={(event) => setUserInput(event.target.value)}
                            placeholder={Lookup.INPUT_PLACEHOLDER}
                            type="text"
                            className='outline-none bg-transparent w-full h-32 resize-none'
                        />
                        {userInput && (
                            <ArrowRight
                                onClick={() => onGenerate(userInput)}
                                className='bg-blue-500 p-2 h-8 w-8 rounded-md cursor-pointer'
                            />
                        )}
                    </div>
                    <div>
                        <Link className='h-5 w-5' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatView