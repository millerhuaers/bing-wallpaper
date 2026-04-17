import { getLangFromHeader } from "./utils";

export const onRequest: PagesFunction = async (context) => {
	try {
		const lang = getLangFromHeader(
			context.request.headers.get("accept-language")
		);
		const url = new URL(context.request.url);
		const index = url.searchParams.get("index") || "0";

		const response = await fetch(`https://www.bing.com/HPImageArchive.aspx?format=js&idx=${index}&n=1&mkt=${lang}`);
		if (!response.ok) throw new Error("Bing API error");
		const data: any = await response.json();

		if (data?.images?.[0]) {
			// 拼接 1080p 分辨率图片链接
			const imageUrl = `https://www.bing.com${data.images[0].urlbase}_1920x1080.jpg`;
			
			const headers = new Headers();
			headers.set("Access-Control-Allow-Origin", "*");
			headers.set("Cache-Control", "max-age=3600");
			headers.set("Location", imageUrl);

			// 302 重定向到真实的图片地址
			return new Response(null, {
				status: 302,
				headers: headers
			});
		}
		throw new Error("No image found");
	} catch {
		const headers = new Headers();
		headers.set("Access-Control-Allow-Origin", "*");
		return new Response(null, { headers, status: 500 });
	}
};
