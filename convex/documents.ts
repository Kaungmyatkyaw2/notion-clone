import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getSidebar = query({
  args: { parentDocument: v.optional(v.id("documents")) },

  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) => {
        return q.eq("userId", userId).eq("parentDocument", args.parentDocument);
      })
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args?.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

export const archive = mutation({
  args: { id: v.id("documents") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);

    if (!existingDoc) {
      throw new Error("Document Not Found!");
    }

    if (existingDoc.userId != userId) {
      throw new Error("Unauthroized!");
    }

    const recursiveArchive = async (docId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", docId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id);
      }
    };

    await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchive(args.id);
  },
});

export const getArchivedDocuments = query({
  async handler(ctx, _) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => {
        return q.eq("userId", userId);
      })
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);

    if (!existingDoc) {
      throw new Error("Document Not Found!");
    }

    if (existingDoc.userId != userId) {
      throw new Error("Unauthroized!");
    }

    const payload: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    const recursiveRestore = async (docId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", docId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    };

    if (existingDoc.parentDocument) {
      const parent = await ctx.db.get(existingDoc.parentDocument);

      if (parent?.isArchived) {
        payload.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, payload);

    recursiveRestore(args.id);

    return document;
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);

    if (!existingDoc) {
      throw new Error("Document Not Found!");
    }

    if (existingDoc.userId != userId) {
      throw new Error("Unauthroized!");
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const search = query({
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getById = query({
  args: { documentId: v.id("documents") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Document Not Found!");
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    if (identity.subject != document.userId) {
      throw new Error("Unauthorized!");
    }

    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const { id, ...body } = args;

    const existingDoc = await ctx.db.get(id);

    if (!existingDoc) {
      throw new Error("Document Not Found!");
    }

    if (existingDoc.userId != userId) {
      throw new Error("Unauthroized!");
    }

    const document = await ctx.db.patch(id, body);

    return document;
  },
});

export const removeIcon = mutation({
  args: {
    id: v.id("documents"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const { id } = args;

    const existingDoc = await ctx.db.get(id);

    if (!existingDoc) {
      throw new Error("Document Not Found!");
    }

    if (existingDoc.userId != userId) {
      throw new Error("Unauthroized!");
    }

    const document = await ctx.db.patch(id, { icon: undefined });

    return document;
  },
});

export const removeCoverImage = mutation({
  args: {
    id: v.id("documents"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const { id } = args;

    const existingDoc = await ctx.db.get(id);

    if (!existingDoc) {
      throw new Error("Document Not Found!");
    }

    if (existingDoc.userId != userId) {
      throw new Error("Unauthroized!");
    }

    const document = await ctx.db.patch(id, { coverImage: undefined });

    return document;
  },
});
