"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";


export function ConvexClientProvider({ children }) {
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}