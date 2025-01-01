import Link from "next/link";

export default async function Home() {
  return (
    <>
      <h1 className="text-5xl">Landing Page</h1>
      <Link href={"/dashboard"}> Dashboard</Link>
    </>
  );
}
