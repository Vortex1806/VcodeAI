import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkspace = mutation({
    args: {
        messages: v.any(),
        user: v.id('users')
    },
    handler: async (ctx, args) => {
        const workSpaceId = await ctx.db.insert('workspace', {
            messages: args.messages,
            user: args.user
        })
        return workSpaceId;
    }
})

export const GetWorkspace = query({
    args: { workSpaceId: v.id('workspace') },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.workSpaceId);
        return result;
    }
})
export const UpdateMessages = mutation({
    args: { workSpaceId: v.id('workspace'), messages: v.any() },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.workSpaceId, {
            messages: args.messages
        });
        return result;
    }
})

export const UpdateFiles = mutation({
    args: { workSpaceId: v.id('workspace'), files: v.any() },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.workSpaceId, {
            fileData: args.files
        });
        return result;
    }
})

export const GetAllWorkspace = query({
    args: {
        userId: v.id('users')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('workspace').filter(q => q.eq(q.field('user'), args.userId)).collect();
        return result;
    }
})