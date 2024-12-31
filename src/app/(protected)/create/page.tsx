"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useRefetch } from "~/hooks/use-refetch";
import { api } from "~/trpc/react";

const formSchema = z.object({
  repository: z
    .string()
    .nonempty("Field is required")
    .url("Must be a valid URL"),
  projectName: z.string().nonempty("Field is required"),
  githubToken: z.string().optional(),
});

export default function NewProject() {
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repository: "",
      projectName: "",
      githubToken: "",
    },
  });

  function onFormSubmit(values: z.infer<typeof formSchema>) {
    createProject.mutate(values, {
      onSuccess: () => {
        toast.success("Project created successfully");
        refetch();
        form.reset();
      },
      onError: () => {
        toast.error("Failed to create project");
      },
    });
  }

  return (
    <>
      <div className="flex h-full items-center justify-center gap-12">
        <div className="">
          <div className="">
            <h1 className="text-2xl font-semibold">
              Link your Github Repository
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the URL of your repository to link it to Dionysus
            </p>
          </div>
          <div className="h-4"></div>
          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="repository"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repository</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/username/project-name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide the Github repo of your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="example-name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide the name of your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="githubToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Github Token</FormLabel>
                      <FormControl>
                        <Input placeholder="example-token" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optinally provide a token for your private repo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create Project</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
