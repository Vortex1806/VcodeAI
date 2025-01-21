import { GenAiCode } from "@/configs/aiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { prompt } = await req.json();
    try {
        const result = await GenAiCode.sendMessage(prompt);
        const res = result.response.text();
        return NextResponse.json(JSON.parse(res));
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({ error: err.message || "Unknown error" });
    }
}