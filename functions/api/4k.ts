import { getBingWallpaperUrl } from "./utils";

export const onRequest: PagesFunction = async (context) => {
	const url = new URL(context.request.url);
	const idx = url.searchParams.get("index") || "0";

	return await getBingWallpaperUrl(
		context.request.headers.get("accept-language"),
		idx,
		(imgUrl) => {
			return imgUrl.replace("1920x1080", "UHD");
		}
	);
};
