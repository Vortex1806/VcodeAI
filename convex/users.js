import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        uid: v.string(),
        token: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query('users').filter((q) => q.eq(q.field('email'), args.email)).collect()
        console.log(user)
        if (user.length === 0) {
            const res = await ctx.db.insert('users', {
                name: args.name,
                email: args.email,
                picture: args.picture,
                uid: args.uid,
                token: args.token ?? 50000
            });
        }
    }
})

export const GetUser = query({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query('users').filter((q) => q.eq(q.field('email'), args.email)).collect()
        return user[0];
    }
})

export const UpdateTokenCount = mutation({
    args: { userId: v.id('users'), token: v.number() },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.userId, {
            token: args.token
        });
        console.log(result);
        return result;
    }
})