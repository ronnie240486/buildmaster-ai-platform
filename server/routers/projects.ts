import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { projects, builds } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const projectsRouter = router({
  // List all projects for the current user
  list: protectedProcedure.query(async ({ ctx }: any) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, ctx.user.id));
    return userProjects;
  }),

  // Get a single project by ID
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const project = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, input.id),
            eq(projects.userId, ctx.user.id)
          )
        )
        .limit(1);
      return project[0] || null;
    }),

  // Create a new project
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        gitUrl: z.string().url().optional(),
        projectType: z.enum(["android", "flutter", "react-native", "other"]),
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db
        .insert(projects)
        .values({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          gitUrl: input.gitUrl,
          projectType: input.projectType,
          status: "active",
        });
      // Fetch the created project
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, ctx.user.id))
        .orderBy((t) => t.id)
        .limit(1);
      return project;
    }),

  // Update a project
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        status: z.enum(["active", "archived", "error"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...updateData } = input;
      await db
        .update(projects)
        .set(updateData)
        .where(
          and(
            eq(projects.id, id),
            eq(projects.userId, ctx.user.id)
          )
        );
      // Fetch the updated project
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);
      return project;
    }),

  // Delete a project
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db
        .delete(projects)
        .where(
          and(
            eq(projects.id, input.id),
            eq(projects.userId, ctx.user.id)
          )
        );
      return { success: true };
    }),

  // Get builds for a project
  getBuilds: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      // First verify the project belongs to the user
      const project = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, input.projectId),
            eq(projects.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!project[0]) {
        throw new Error("Project not found");
      }

      const projectBuilds = await db
        .select()
        .from(builds)
        .where(eq(builds.projectId, input.projectId));
      return projectBuilds;
    }),
});
