'use client'
import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useConvex, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import uuid4 from 'uuid4'

const LoginDialog = ({ openDialog, closeDialog }) => {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const CreateUser = useMutation(api.users.CreateUser);



    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: 'Bearer ' + tokenResponse?.access_token } },
            );

            console.log(userInfo);
            const user = userInfo?.data;
            setUserDetail(userInfo?.data);
            try {
                await CreateUser({
                    name: user?.name,
                    email: user?.email,
                    picture: user?.picture,
                    uid: uuid4()
                })
            } catch (error) {
                console.error("Error calling CreateUser mutation:", error);
            }

            if (typeof window !== undefined) {
                localStorage.setItem('user', JSON.stringify(user));
            }
            //save data to database
            closeDialog(false);
        },
        onError: errorResponse => console.log(errorResponse),
    });

    return (
        <div>
            <Dialog open={openDialog} onOpenChange={closeDialog}>
                <DialogContent>
                    <DialogHeader className="flex flex-col items-center justify-center gap-3">
                        <DialogTitle className='font-bold text-2xl text-center text-white'> {Lookup.SIGNIN_HEADING}</DialogTitle>
                        <DialogDescription className="mt-2 text-center text-lg justify-center flex flex-col" >

                            {Lookup.SIGNIN_SUBHEADING}
                            <Button onClick={googleLogin} className="bg-blue-500 text-white hover:bg-blue-300 mt-3 mx-auto">Sign In with Google</Button>


                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='text-center mt-3'>
                        {Lookup.SIGNIn_AGREEMENT_TEXT}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LoginDialog