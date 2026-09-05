import type { APIEvent } from "@solidjs/start/server";
import { getPostData } from "@/lib/post-data";

// src/routes/api/home.json.ts와 같은 이유로 존재한다 — 자세한 맥락은 그 파일 참고.
export async function GET({ params }: APIEvent) {
  const data = await getPostData(params.id);
  return Response.json(data, { status: data.post ? 200 : 404 });
}
