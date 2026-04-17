import "./style.css";

const API_BASE_URL = "/api";
let currentIndex = 0; // 0 表示今天，1 表示昨天，最大为 7
const MAX_DAYS = 7;

// 下载/打开当前查看的壁纸
function openWallpaper() {
	let url = `${API_BASE_URL}/1080p`;
	if (currentIndex > 0) {
		url += `?index=${currentIndex}`;
	}
	window.open(url);
}

// 核心函数：加载指定天数的壁纸
async function loadWallpaper(index: number) {
	const copyright = document.getElementById("copyright");
	const bgImg = document.getElementById("bg-img") as HTMLImageElement;
	const prevBtn = document.getElementById("prev-btn") as HTMLButtonElement;
	const nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
	const urlDisplay = document.getElementById("api-url-display");

	// 更新按钮状态
	if (prevBtn) prevBtn.disabled = index >= MAX_DAYS; // 到达最旧的一天
	if (nextBtn) nextBtn.disabled = index <= 0;        // 到达最新的一天（今天）

	if (copyright) copyright.textContent = "Loading...";

	try {
		// 1. 获取 JSON 版权信息
		let jsonUrl = `${API_BASE_URL}/json`;
		if (index > 0) jsonUrl += `?index=${index}`;
		
		const response = await fetch(jsonUrl);
		if (!response.ok) throw new Error(response.status.toString());
		const data = await response.json();

		// 2. 更新背景图片
		if (bgImg) {
			let imgUrl = `${API_BASE_URL}/1080p`;
			if (index > 0) imgUrl += `?index=${index}`;
			bgImg.src = imgUrl;
		}

		// 3. 更新版权文字 (兼容 Worker 返回的单对象或原版数组)
		if (data && copyright) {
			copyright.textContent = data.copyright || (data.images && data.images[0].copyright) || "Unknown Copyright";
		}

		// 4. 更新展示的 API 链接
		if (urlDisplay) {
			let displayUrl = window.location.origin + "/api/1080p";
			if (index > 0) displayUrl += `?index=${index}`;
			urlDisplay.textContent = displayUrl;
		}

	} catch (error) {
		console.error(error);
		if (copyright && error instanceof Error) {
			copyright.textContent = `Error: ${error.message}`;
		}
	}
}

// 绑定快捷键
window.addEventListener("keydown", (event) => {
	if ((event.ctrlKey || event.metaKey) && event.key === "s") {
		event.preventDefault();
		openWallpaper();
	}
});

// 绑定左右切换事件
document.getElementById("prev-btn")?.addEventListener("click", () => {
	if (currentIndex < MAX_DAYS) {
		currentIndex++;
		loadWallpaper(currentIndex);
	}
});

document.getElementById("next-btn")?.addEventListener("click", () => {
	if (currentIndex > 0) {
		currentIndex--;
		loadWallpaper(currentIndex);
	}
});

// 绑定模糊特效和底部点击事件
document.getElementById("bg-img")?.addEventListener("click", function () {
	this.classList.toggle("blur");
});
document.getElementById("footer")?.addEventListener("click", openWallpaper);

// 页面加载完毕后初始化
window.addEventListener("load", () => {
	loadWallpaper(currentIndex);
});
