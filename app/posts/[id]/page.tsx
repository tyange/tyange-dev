import { getDevPosts } from "@/lib/cms-api";

export async function generateStaticParams() {
  const devPosts = await getDevPosts();
  return devPosts.map((post) => ({ id: post.post_id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <div>Post: {id}</div>;
}
