import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useSidebar } from '../ui/sidebar';
import { toast } from 'sonner';
import { UserDetailContext } from '@/context/UserDetailContext';


const SideBarFooter = () => {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { toggleSidebar } = useSidebar();
    const router = useRouter();
    const options = [
        {
            name: 'Settings',
            icon: Settings
        },
        {
            name: 'Help Center',
            icon: HelpCircle
        },
        {
            name: 'My Subscription',
            icon: Wallet,
            path: '/pricing'
        },
        {
            name: 'Sign out',
            icon: LogOut,
        },

    ]
    const onOptionClick = (option) => {
        if (option.name === 'Sign out') {
            localStorage.removeItem('user');
            setUserDetail(null);
            toast.success('Signed out successfully');
            router.push('/');
        } else if (option.path) {
            router.push(option.path);
        }
        toggleSidebar()
    }

    return (
        <div className='p-2 mb-10'>
            {
                options.map((option, index) => (
                    <Button onClick={() => {
                        onOptionClick(option)
                    }} className="w-full flex justify-start my-3" variant="ghost" key={index}>
                        <option.icon />
                        {option.name}

                    </Button>
                ))
            }
        </div>
    )
}

export default SideBarFooter