import { getLangFromHeader } from "./utils";

export const onRequest: PagesFunction = async (context) => {
	try {
		// 1. 获取语言
		const lang = getLangFromHeader(
			context.request.headers.get("accept-language")
		);
		
		// 2. 获取 index 参数
		const url = new URL(context.request.url);
		const index = url.searchParams.get("index") || "0";

		// 3. 带上 index 请求必应 API
		const response = await fetch(`https://www.bing.com/HPImageArchive.aspx?format=js&idx=${index}&n=1&mkt=${lang}`);
		if (!response.ok) throw new Error("Bing API error");
		const json = await response.json();

		// 4. 设置原项目的规范 Headers
		const headers = new Headers();
		headers.set("Access-Control-Allow-Origin", "*");
		headers.set("Cache-Control", "max-age=3600");
		headers.set("Content-Type", "application/json; charset=utf-8");
		headers.set("Vary", "Accept-Language");

		return new Response(JSON.stringify(json), {
			headers: headers
		});
	} catch {
		const headers = new Headers();
		headers.set("Access-Control-Allow-Origin", "*");
		return new Response(null, {
			headers: headers,
			status: 500
		});
	}
};
