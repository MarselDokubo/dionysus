import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "~/server/db";

export default async function () {
  const { userId } = await auth();
  if (!userId) throw new Error("User Not Found");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const emailAddress = user?.emailAddresses[0]?.emailAddress;

  if (!emailAddress) notFound();

  await db.user.upsert({
    where: { emailAddress },
    update: {
      imageURL: user.imageUrl,
      firstname: user.firstName,
      lastname: user.lastName,
    },
    create: {
      id: user.id,
      emailAddress,
      imageURL: user.imageUrl,
      firstname: user.firstName,
      lastname: user.lastName,
    },
  });
  return redirect("/dashboard");
}
