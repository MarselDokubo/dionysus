import { Octokit } from "octokit";
import { db } from "~/server/db";
import { summariseCommit } from "./gemini";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// const githubRepo = "https://github.com/docker/genai-stack";

type CommitResponse = {
  commitMessage: string;
  commitHash: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export async function getCommitHashes(url: string) {
  const [owner, repo] = url.split("/").slice(-2);
  if (!owner || !repo) throw new Error("Invalid github url");
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort((a, b) => {
    return (
      new Date(b.commit.author?.date as string).getTime() -
      new Date(a.commit.author?.date as string).getTime()
    );
  });

  const commits = sortedCommits.slice(0, 15).map((commit) => ({
    commitHash: commit.sha,
    commitMessage: commit.commit.message,
    commitAuthorName: commit.commit.author?.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: commit.commit.author?.date ?? "",
  }));
  return commits;
}

export async function pollCommits(projectId: string) {
  const { repository } = await fetchProjectRepo(projectId);
  const commitHashes = await getCommitHashes(repository);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );
  const commitSummaries = await Promise.allSettled(
    unprocessedCommits.map(async (commit) => {
      return await getCommitSummaries(repository, commit.commitHash);
    }),
  );

  const summaries = commitSummaries.map((summary) => {
    if (summary.status === "fulfilled") {
      return summary.value as string;
    }
    return "";
  });

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      return {
        projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary,
      };
    }),
  });

  return commits;
}

async function fetchProjectRepo(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      repository: true,
    },
  });
  if (!project?.repository) throw new Error("Cannot find repo");
  return { project, repository: project?.repository };
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: CommitResponse[],
) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });

  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some((pc) => pc.commitHash === commit.commitHash),
  );
  return unprocessedCommits;
}

async function getCommitSummaries(repository: string, commitHash: string) {
  console.log("Getting commit summaries");
  const response = await fetch(`${repository}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });
  const commitDiff = await response.text();
  const diffSummary = await summariseCommit(commitDiff);
  return diffSummary;
}
