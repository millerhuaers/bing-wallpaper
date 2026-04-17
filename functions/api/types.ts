export interface ImageItem {
	url: string;
	urlbase?: string;
	copyright?: string;
	title?: string;
}

export interface BingWallpaperJson {
	images: ImageItem[];
}
