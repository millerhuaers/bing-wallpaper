import { getBingWallpaperJson, getLangFromHeader } from "./utils";

export const onRequest: PagesFunction = async (context) => {
	try {
		const lang = getLangFromHeader(
			context.request.headers.get("accept-language")
		);
		
		// 提取 index 参数
		const url = new URL(context.request.url);
		const idx = url.searchParams.get("index") || "0";

		// 传入 idx
		const json = await getBingWallpaperJson(lang, idx);

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
