export async function onRequest(context) {
    const url = new URL(context.request.url);
    const index = url.searchParams.get("index") || "0";
    
    const res = await fetch(`https://www.bing.com/HPImageArchive.aspx?format=js&idx=${index}&n=1&mkt=zh-CN`);
    const data = await res.json();
    
    if (data && data.images && data.images.length > 0) {
        const imageUrl = `https://www.bing.com${data.images[0].urlbase}_UHD.jpg`;
        return Response.redirect(imageUrl, 302);
    }
    return new Response("Not Found", { status: 404 });
}
