import { chatSession } from "@/configs/aiModel";
import { NextResponse } from "next/server";

export async function POST(req){
    const {prompt} = await req.json();
    try{
        const result = await chatSession.sendMessage(prompt);
        const res = result.response.text();
        return NextResponse.json({result:res});
    }catch(e){
        return NextResponse.json({error:e});
    }
}