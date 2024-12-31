import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollCommits } from "~/lib/github";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        repository: z
          .string()
          .nonempty("Field is required")
          .url("Must be a valid URL"),
        projectName: z.string().nonempty("Field is required"),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectName: name, repository } = input;
      const project = await ctx.db.project.create({
        data: {
          name,
          repository,
          userToProjects: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });
      console.log("Created Project ", project.name, project.id);
      await pollCommits(project.id);
      return project;
    }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        userToProjects: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null,
      },
    });
    return projects;
  }),
});

export type ProjectRouter = typeof projectRouter;
