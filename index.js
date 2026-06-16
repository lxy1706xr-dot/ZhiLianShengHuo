export default {
  async fetch(request, env, ctx) {
    // 1. 定義通用的 CORS 響應標頭
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400", // 快取預檢請求
    };

    // 2. 徹底攔截瀏覽器的 OPTIONS 預檢請求
    if (request.method === "OPTIONS") {
      return new Response(null, { 
        status: 204, // 使用 204 No Content 回應預檢
        headers: corsHeaders 
      });
    }

    // 3. 限制只允許 POST 請求
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    try {
      const apiKey = env.GEMINI_API_KEY; 
      // 建議使用最新穩定的 gemini-2.5-flash 模型
      const geminiUrl = `https://googleapis.com{apiKey}`;

      const body = await request.json();
      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
