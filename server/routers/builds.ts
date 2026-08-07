import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { projects, builds } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const buildsRouter = router({
  // Get builds for a project
  list: protectedProcedure
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

  // Get a single build
  get: protectedProcedure
    .input(z.object({ buildId: z.number(), projectId: z.number() }))
    .query(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Verify project belongs to user
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

      const [build] = await db
        .select()
        .from(builds)
        .where(
          and(
            eq(builds.id, input.buildId),
            eq(builds.projectId, input.projectId)
          )
        )
        .limit(1);
      
      return build || null;
    }),

  // Create a new build (start a build)
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        buildType: z.enum(["debug", "release"]).default("debug"),
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Verify project belongs to user
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

      // Get the next build number
      const lastBuilds = await db
        .select()
        .from(builds)
        .where(eq(builds.projectId, input.projectId));
      
      const buildNumber = lastBuilds.length + 1;

      // Create the build
      const result = await db
        .insert(builds)
        .values({
          projectId: input.projectId,
          buildNumber,
          buildType: input.buildType,
          status: "pending",
        });

      // Fetch the created build
      const [build] = await db
        .select()
        .from(builds)
        .where(eq(builds.projectId, input.projectId))
        .orderBy((t) => t.id)
        .limit(1);

      return build;
    }),

  // Update build status (used by build engine)
  updateStatus: protectedProcedure
    .input(
      z.object({
        buildId: z.number(),
        projectId: z.number(),
        status: z.enum(["pending", "running", "success", "failed", "cancelled"]),
        logs: z.string().optional(),
        errorMessage: z.string().optional(),
        duration: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Verify project belongs to user
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

      const updateData: any = {
        status: input.status,
      };

      if (input.logs !== undefined) updateData.logs = input.logs;
      if (input.errorMessage !== undefined) updateData.errorMessage = input.errorMessage;
      if (input.duration !== undefined) updateData.duration = input.duration;
      if (input.status === "running") updateData.startedAt = new Date();
      if (input.status === "success" || input.status === "failed") {
        updateData.completedAt = new Date();
      }

      await db
        .update(builds)
        .set(updateData)
        .where(eq(builds.id, input.buildId));

      // Fetch the updated build
      const [build] = await db
        .select()
        .from(builds)
        .where(eq(builds.id, input.buildId))
        .limit(1);

      return build;
    }),
});
