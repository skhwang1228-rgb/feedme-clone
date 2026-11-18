import {
  ConvertError,
  fetchAndConvert,
} from "@/features/url-to-markdown/convert.server";
import { parseWebUrl } from "@/features/url-to-markdown/validate-url";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const url = parseWebUrl(typeof body?.url === "string" ? body.url : "");
  if (!url) {
    return Response.json(
      { error: "http:// 또는 https://로 시작하는 올바른 URL을 입력하세요." },
      { status: 400 }
    );
  }
  try {
    return Response.json(await fetchAndConvert(url));
  } catch (e) {
    const message =
      e instanceof ConvertError ? e.message : "변환 중 오류가 발생했습니다.";
    return Response.json({ error: message }, { status: 422 });
  }
}
