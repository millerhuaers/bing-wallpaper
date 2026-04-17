import "./style.css";

// 基础 API 地址，Vite 部署后会自动处理相对路径
const API_BASE_URL = "/api";

function openWallpaper() {
	window.open(API_BASE_URL + "/1080p");
}

// 动态设置显示的完整 URL
function initApiDisplay() {
	const urlDisplay = document.getElementById("api-url-display");
	if (urlDisplay) {
		urlDisplay.textContent = window.location.origin + "/api/1080p";
	}
}

window.addEventListener("keydown", (event) => {
	if ((event.ctrlKey || event.metaKey) && event.key === "s") {
		event.preventDefault();
		openWallpaper();
	}
});

window.addEventListener("load", async () => {
    // 执行新添加的 URL 初始化
    initApiDisplay();

	const copyright = document.getElementById("copyright");
	if (!copyright) return;

	try {
		const response = await fetch(API_BASE_URL + "/json");
		if (!response.ok) throw new Error(response.status.toString());
		const data = await response.json();
		if (data && data.images) {
			copyright.textContent = data.images[0].copyright;
		}
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			copyright.textContent = `Error: ${error.message}`;
		}
	}
});

document.getElementById("bg-img")?.addEventListener("click", function () {
	this.classList.toggle("blur");
});

document.getElementById("footer")?.addEventListener("click", openWallpaper);
