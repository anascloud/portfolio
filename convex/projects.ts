import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    description: v.string(),
    image: v.string(),
    link: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const projectId = await ctx.db.insert("projects", {
      ...args,
      userId,
    });
    return projectId;
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...fields } = args;
    const project = await ctx.db.get("projects", id);
    if (!project) throw new Error("Project not found");
    if (project.userId !== userId) throw new Error("Not authorized");

    await ctx.db.patch("projects", id, fields);
  },
});

export const seed = mutation({
  args: {
    projects: v.array(v.object({
      title: v.string(),
      category: v.string(),
      description: v.string(),
      image: v.string(),
      link: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    for (const p of args.projects) {
      await ctx.db.insert("projects", { ...p, userId });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const project = await ctx.db.get("projects", args.id);
    if (!project) throw new Error("Project not found");
    if (project.userId !== userId) throw new Error("Not authorized");

    await ctx.db.delete("projects", args.id);
  },
});
