import React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "../ui/button"
import { MessageCircleCode } from "lucide-react"
import WorkspaceHistory from "./WorkspaceHistory"
import SideBarFooter from "./SidebarFooter"

const AppSidebar = () => {
    return (
        <Sidebar>
            <SidebarHeader className="p-5" >
                <Image src={'/logo.png'} alt={'logo'} width={30} height={30} />
                <Button className="mt-5"> <MessageCircleCode />Start new chat</Button>
            </SidebarHeader>
            <SidebarContent className="px-5">
                <SidebarGroup />
                <WorkspaceHistory />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter >
                <SideBarFooter />
                <SidebarTrigger />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar