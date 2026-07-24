import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  projects: defineTable({
    title: v.string(),
    category: v.string(),
    description: v.string(),
    image: v.string(),
    link: v.string(),
    userId: v.optional(v.id("users")),
  }).index("by_userId", ["userId"]),
});

export default schema;
