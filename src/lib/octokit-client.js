// import { Octokit } from "octokit";

// const octokit = new Octokit({
//   auth: "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",
// });

// export async function getCommitHashes() {
//   const { data } = await octokit.rest.repos.listCommits({
//     owner: "MarselDokubo",
//     repo: "mild-pay",
//   });

//   const sortedCommits = data.sort((a, b) => {
//     return (
//       new Date(b.commit.author?.date ?? "").getTime() -
//       new Date(a.commit.author?.date ?? "").getTime()
//     );
//   });

//   return sortedCommits.slice(0, 5).map((commit) => ({
//     commitHash: commit.sha,
//     commitMessage: commit.commit.message,
//     commitAuthorName: commit.commit.author?.name ?? "",
//     commitAuthorAvatat: commit.author?.avatar_url ?? "",
//     commitDate: commit.commit.author?.date ?? "",
//   }));
// }

// console.log(await getCommitHashes());
