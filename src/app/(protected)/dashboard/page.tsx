"use client";
import { useUser } from "@clerk/nextjs";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import useProject from "~/hooks/use-project";
import CommitLog from "./_components/commit-log";

export default function DashboardPage() {
  const user = useUser();
  const { project } = useProject();
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <div className="flex w-fit rounded-md bg-primary px-4 py-3">
          <Github className="size-5 text-white" />
          <div className="ml-2">
            <p className="flex items-center gap-1 text-sm font-medium text-white">
              This project is linked to{" "}
              <Link href={project?.repository ?? ""}>
                {project?.repository}
              </Link>
              <ExternalLink className="ml-1 size-4" />
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            AskQuestions MeetingCard
          </div>
        </div>
        <div className="mt-8"></div>
        <CommitLog />
      </div>
    </>
  );
}
