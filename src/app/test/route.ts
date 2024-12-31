import { summariseCommit } from "~/lib/gemini";

export async function GET() {
  const response = await fetch(
    "https://github.com/MarselDokubo/nova/commit/9699dfd7aab5d8dd165144be7d8774e665c4d8f8.diff",
    {
      headers: {
        Accept: "application/vnd.github.v3.diff",
      },
    },
  );

  const commitDiff = await response.text();
  console.log("testing get commit diff", commitDiff);
  console.log("commit summary gemini", await summariseCommit(commitDiff));
  return Response.json({ data: "some data" });
}
