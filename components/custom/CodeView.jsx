'use client'
import React, { useContext, useEffect, useState } from 'react'
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import { MessagesContext } from '@/context/MessagesContext';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Loader2Icon, LoaderIcon } from 'lucide-react';
import { countToken } from './ChatView';
import SandpackPreviewClient from './SandpackPreviewClient';
import { ActionContext } from '@/context/ActionContext';
import { UserDetailContext } from '@/context/UserDetailContext';

const CodeView = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
    const { Messages, setMessages } = useContext(MessagesContext);
    const updateFiles = useMutation(api.workspace.UpdateFiles);
    const UpdateToken = useMutation(api.users.UpdateTokenCount);
    const [loading, setLoading] = useState(false);
    const { action, setAction } = useContext(ActionContext);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const convex = useConvex();

    useEffect(() => {
        id && GetFiles();
    }, [id])

    useEffect(() => {
        setActiveTab('preview');
    }, [action])

    const GetFiles = async () => {
        setLoading(true);
        const result = await convex.query(api.workspace.GetWorkspace, {
            workSpaceId: id
        })
        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
        setFiles(mergedFiles);
        setLoading(false);
    }


    useEffect(() => {
        if (Messages?.length > 0) {
            const role = Messages[Messages.length - 1].role;
            if (role == 'user') {
                GenerateAiCode();
            }
        }
    }, [Messages]);

    const GenerateAiCode = async () => {
        setLoading(true);
        console.log("Generating ai code");
        const PROMPT = JSON.stringify(Messages) + " " + Prompt.CODE_GEN_PROMPT;
        const result = await axios.post('/api/gen-code', {
            prompt: PROMPT
        });
        console.log(result.data);
        const aiResp = result.data;
        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
        setFiles(mergedFiles);
        await updateFiles({
            workSpaceId: id,
            files: aiResp?.files
        });
        const usedToken = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
        setUserDetail(prev => ({
            ...prev,
            token: usedToken
        }))

        await UpdateToken({
            token: usedToken,
            userId: userDetail?._id
        })
        setActiveTab('code');
        setLoading(false);
    }

    return (
        <div className='relative'>
            <div className='bg-[#181818] w-full p-2 border'>
                <div className='flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center rounded-full'>
                    <h2 onClick={() => setActiveTab('code')} className={`text-sm cursor-pointer ${activeTab == 'code' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>Code</h2>
                    <h2 onClick={() => setActiveTab('preview')} className={`text-sm cursor-pointer ${activeTab == 'preview' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>Preview</h2>
                </div>
            </div>
            <SandpackProvider template="react" theme={'dark'}
                files={files}
                customSetup={{
                    dependencies: {
                        ...Lookup.DEPENDANCY
                    }
                }}
                options={{
                    externalResources: ['https://cdn.tailwindcss.com']
                }}
            >
                <SandpackLayout >
                    {activeTab == 'code' ? <>
                        <SandpackFileExplorer style={{ height: '80vh' }} />
                        <SandpackCodeEditor style={{ height: '80vh' }} />
                    </> : <>
                        <SandpackPreviewClient />
                    </>}
                </SandpackLayout>
            </SandpackProvider>
            {loading && <div className='p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
                <Loader2Icon className='animate-spin h-10 w-10 text-white' />
                <h2 className='text-white'>Crafting your code...</h2>
            </div>}
        </div>
    )
}

export default CodeView