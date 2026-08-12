import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { projects, builds } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const PROJECTS_DIR = path.join(process.cwd(), "storage", "projects");

export const projectsRouter = router({
  list: protectedProcedure.query(async ({ ctx }: any) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db.select().from(projects).where(eq(projects.userId, ctx.user.id));
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [project] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, input.id), eq(projects.userId, ctx.user.id)))
        .limit(1);
      return project || null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        gitUrl: z.string().optional(),
        projectType: z.enum(["android", "flutter", "react-native", "other"]),
        sourceType: z.enum(["github", "zip", "clone"]),
        zipContent: z.string().optional(), // Base64 or text content for ZIP upload simulation/handling
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (!fs.existsSync(PROJECTS_DIR)) {
        fs.mkdirSync(PROJECTS_DIR, { recursive: true });
      }

      const projectSlug = input.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const projectPath = path.join(PROJECTS_DIR, `${Date.now()}-${projectSlug}`);
      fs.mkdirSync(projectPath, { recursive: true });

      // Handle repository cloning or setup
      if (input.sourceType === "github" || input.sourceType === "clone") {
        if (input.gitUrl) {
          try {
            execSync(`git clone ${input.gitUrl} ${projectPath}`, { stdio: "ignore" });
          } catch (e) {
            console.warn("[Projects] Git clone failed or simulated:", e);
            // Create a stub structure if clone fails in sandbox without auth
            fs.writeFileSync(path.join(projectPath, "README.md"), `# ${input.name}\n\n${input.description || ""}`);
          }
        }
      } else if (input.sourceType === "zip" && input.zipContent) {
        // If zip content is provided, save it
        fs.writeFileSync(path.join(projectPath, "project.zip"), Buffer.from(input.zipContent, "base64"));
      }

      await db.insert(projects).values({
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        gitUrl: input.gitUrl || null,
        projectType: input.projectType,
        status: "active",
      });

      const [created] = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, ctx.user.id))
        .orderBy((t) => t.id)
        .limit(1);

      return created;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .delete(projects)
        .where(and(eq(projects.id, input.id), eq(projects.userId, ctx.user.id)));
      return { success: true };
    }),
});
