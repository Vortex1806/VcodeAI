"use client"
import Image from 'next/image'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useSidebar } from '../ui/sidebar'
import Link from 'next/link'
import { LucideDownload, LucideRocket, Rocket } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ActionContext } from '@/context/ActionContext'

const Header = () => {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { toggleSidebar } = useSidebar();
    const { action, setAction } = useContext(ActionContext);
    const path = usePathname();

    const onActionBtn = (action) => {
        setAction({
            actionType: action,
            timeStamp: Date.now()
        })
    }

    return (
        <div className='p-4 flex justify-between items-center h-15'>
            <Link href={'/'}>
                <Image src={'/logo.png'} alt="logo" width={40} height={40} ></Image>
            </Link>
            {!userDetail?.name ? <div className="flex gap-5">
                <Button variant="ghost">Sign in</Button>
                <Button className="text-white" style={{
                    backgroundColor: Colors.BLUE
                }}>Get Started</Button>
            </div> :
                <div className="flex gap-2 items-center">
                    {path?.includes('workspace') && <div>
                        <Button variant="ghost" onClick={() => onActionBtn('export')}> <LucideDownload />Export</Button>
                        <Button className="text-white bg-blue-500 hover:bg-blue-600" onClick={() => onActionBtn('deploy')}><Rocket />Deploy</Button>
                    </div>}

                    <Image src={userDetail?.picture} alt='user' width={30} height={30} className='rounded-full w-[30px]' onClick={toggleSidebar} />
                </div>

            }

        </div>
    )
}
export default Header