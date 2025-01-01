import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useProject from "~/hooks/use-project";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function CommitLog() {
  const { projectId, project } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });

  return (
    <>
      <ul className="space-y-0">
        {commits?.map((commit, index) => (
          <li className="relative flex gap-x-4">
            <div
              className={cn(
                index === commits.length - 1 ? "h-0" : "-bottom-0",
                "absolute left-0 top-0 flex w-6 justify-center",
              )}
            >
              <div className="w-px translate-x-1 bg-gray-200"></div>
            </div>
            <>
              <Image
                src={commit.commitAuthorAvatar}
                alt="commit author avatar"
                className="relative mt-3 size-8 flex-none rounded-full bg-gray-50"
              />
              <div className="flex-auto rounded-md bg-white ring-1 ring-inset ring-gray-200">
                <div className="flex justify-between gap-x-4">
                  <Link
                    target="_blank"
                    href={`${project?.repository}/commit/${commit.commitHash}`}
                    className="py-0.5 text-xs leading-5 text-gray-500"
                  >
                    <span className="font-mediumm text-gray-800">
                      {commit.commitAuthorName}
                    </span>
                    <span className="inline-flex items-center">
                      commited
                      <ExternalLink className="ml-1 size-4" />
                    </span>
                  </Link>
                </div>
                <span className="font-semid">{commit.commitMessage}</span>
                <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500">
                  {commit.summary}
                </pre>
              </div>
            </>
          </li>
        ))}
      </ul>
    </>
  );
}
