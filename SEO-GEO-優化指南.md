# SEO + GEO 網站優化完整指南

> 本指南以「華訊通訊東海店」實戰案例整理，適用於所有靜態/動態網站。
> 照著做完，Google 搜尋排名與 AI 引用率都會提升。

---

## 目錄

1. [SEO 基礎優化](#1-seo-基礎優化)
2. [Schema.org 結構化資料](#2-schemaorg-結構化資料)
3. [GEO 優化（讓 AI 引用你）](#3-geo-優化讓-ai-引用你)
4. [robots.txt 完整範本](#4-robotstxt-完整範本)
5. [sitemap.xml 範本](#5-sitemapxml-範本)
6. [llms.txt 範本](#6-llmstxt-範本)
7. [驗證清單](#7-驗證清單)

---

## 1. SEO 基礎優化

在 `<head>` 裡放齊以下標籤：

```html
<!-- ① 標題：60字內，前段放關鍵字，後段放品牌名 -->
<title>主要服務・次要服務・地區關鍵字 | 品牌名</title>

<!-- ② 描述：150字內，包含服務、地區、USP、電話或時間 -->
<meta name="description" content="地區+服務專門店。具體USP一；USP二；USP三。營業時間，電話。" />

<!-- ③ 關鍵字：15-25個，涵蓋地區+服務+長尾詞 -->
<meta name="keywords" content="地區服務A,地區服務B,品牌名,..." />

<!-- ④ 基本 meta -->
<meta name="robots" content="index, follow" />
<meta name="author" content="品牌名" />

<!-- ⑤ Canonical（防重複內容） -->
<link rel="canonical" href="https://你的網址/" />

<!-- ⑥ Open Graph（Facebook/LINE 分享預覽） -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://你的網址/" />
<meta property="og:title" content="同 <title>" />
<meta property="og:description" content="同 description" />
<meta property="og:locale" content="zh_TW" />
<meta property="og:site_name" content="品牌名" />

<!-- ⑦ Twitter Card -->
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="同 <title>" />
<meta name="twitter:description" content="同 description" />

<!-- ⑧ 地理位置（本地 SEO 必做） -->
<meta name="geo.region" content="TW-TXG" />        <!-- 台中市用 TXG，台北用 TPE -->
<meta name="geo.placename" content="台中市龍井區" />
<meta name="geo.position" content="緯度;經度" />    <!-- 從 Google Maps 取得 -->
<meta name="ICBM" content="緯度, 經度" />
```

### Title 關鍵字策略

| 類型 | 範例 |
|---|---|
| 一般 | `台中手機維修・電信辦理 \| 品牌名` |
| 加評分 | `台中手機維修｜5星568評好評 \| 品牌名` |
| 加數字 | `台中手機維修｜最快30分完修・10年老店 \| 品牌名` |
| 加地區 | `台中海線手機維修・龍井・沙鹿・梧棲 \| 品牌名` |

### Description 寫法公式

```
[地區+服務類型]。[USP1]；[USP2]；[USP3]。[時間/電話]。
```

範例：
```
台中海線龍井手機專門店。二手機買賣・新機推薦・綁約優惠比價；
iPhone螢幕電池最快30分鐘完修；四大電信申辦攜碼。每日10–21時，04-2631-3552。
```

---

## 2. Schema.org 結構化資料

放在 `</head>` 前，能讓 Google 顯示**富搜尋結果**（星評、FAQ 展開、商家資訊卡）。

### 2-1 本地商家（LocalBusiness）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "依商家類型填入",
  <!-- 常見類型：LocalBusiness / MobilePhoneRepairShop / Restaurant /
       BeautySalon / AutoRepair / Dentist / LegalService 等 -->

  "@id": "https://你的網址/#business",
  "name": "商家全名",
  "alternateName": "商家別名",
  "description": "200字內的商家描述",
  "url": "https://你的網址/",
  "telephone": "+886-x-xxxx-xxxx",

  "address": {
    "@type": "PostalAddress",
    "streetAddress": "路名 + 號",
    "addressLocality": "區名",
    "addressRegion": "縣市名",
    "postalCode": "郵遞區號",
    "addressCountry": "TW"
  },

  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 緯度數字,
    "longitude": 經度數字
  },

  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "10:00",
      "closes": "21:00"
    }
  ],

  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "568",
    "bestRating": "5",
    "worstRating": "1"
  },

  "areaServed": [
    {"@type": "City", "name": "龍井區"},
    {"@type": "City", "name": "沙鹿區"}
  ],

  "sameAs": [
    "https://www.instagram.com/你的帳號/",
    "https://page.line.me/你的LINE"
  ],

  "priceRange": "$$",

  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "服務項目",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "服務名稱",
          "description": "服務描述"
        }
      }
    ]
  }
}
</script>
```

### 2-2 FAQ（讓搜尋結果展開問答）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "問題一？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "答案一。"
      }
    },
    {
      "@type": "Question",
      "name": "問題二？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "答案二。"
      }
    }
  ]
}
</script>
```

> **建議 FAQ 數量**：5–7 則，每則答案 50–150 字，用自然語言寫，涵蓋常見搜尋問題。

---

## 3. GEO 優化（讓 AI 引用你）

GEO = Generative Engine Optimization，目標是讓 Claude / ChatGPT / Perplexity 能找到、讀懂、引用你的內容。

### 三層 AI 爬蟲的差異

| 類型 | 爬蟲名稱 | 意義 |
|---|---|---|
| 訓練爬蟲 | ClaudeBot / GPTBot / Bytespider | 收集訓練語料，不代表被引用 |
| 索引爬蟲 | Claude-SearchBot / OAI-SearchBot / PerplexityBot | 進 AI 搜尋索引，日後可能引用 |
| **即時瀏覽** | **Claude-User / ChatGPT-User / Perplexity-User** | ⭐ **真人對話即時抓 = 真實被引用** |

### 在 `<head>` 加入 GEO 標籤

```html
<!-- LLMs.txt 宣告（AI 爬蟲自動發現） -->
<link rel="llms" type="text/plain" href="https://你的網址/llms.txt" title="AI-readable content" />

<!-- 明確歡迎 AI 索引 -->
<meta name="ai-content-declaration" content="this page is available for AI training and indexing" />
<meta name="googlebot" content="index, follow" />
<meta name="bingbot" content="index, follow" />
```

---

## 4. robots.txt 完整範本

放在網站根目錄 `/robots.txt`：

```
# ────────────────────────────────────
# robots.txt — SEO + GEO 完整版
# ────────────────────────────────────

# 一般搜尋引擎
User-agent: *
Allow: /

# ── Anthropic / Claude 系列 ──
User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

# ── OpenAI / ChatGPT 系列 ──
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# ── Perplexity 系列 ──
User-agent: PerplexityBot
Allow: /

# ── Google AI 系列 ──
User-agent: Google-Extended
Allow: /

# ── Bing / Microsoft 系列 ──
User-agent: Bingbot
Allow: /

# ── ByteDance 系列 ──
User-agent: Bytespider
Allow: /

# ── 其他 AI 系列 ──
User-agent: cohere-ai
Allow: /

User-agent: FacebookBot
Allow: /

Sitemap: https://你的網址/sitemap.xml
```

---

## 5. sitemap.xml 範本

放在網站根目錄 `/sitemap.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://你的網址/</loc>
    <lastmod>2026-06-14</lastmod>   <!-- 每次更新網站記得改日期 -->
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- 若有多個頁面，繼續新增 <url> -->
</urlset>
```

> 建立後去 **Google Search Console → Sitemap** 提交網址，加速索引。

---

## 6. llms.txt 範本

放在網站根目錄 `/llms.txt`，這是給 AI 讀的「純文字名片」：

```markdown
# 商家名稱

> 一句話描述：地區+服務+核心優勢+評價。

## 關於我們

[2–3段自然語言描述，包含：
- 地點、年資、服務對象
- Google 評分資訊]

## 服務項目

### 服務名稱一
- 包含：具體項目
- 速度/費用：具體數字
- 特色：差異化說明

### 服務名稱二
...

## 常見問題

**Q: 問題一？**
A: 答案一。

**Q: 問題二？**
A: 答案二。

## 聯絡資訊

- **地址**: 完整地址
- **電話**: 電話號碼
- **LINE**: LINE ID
- **營業時間**: 時間

## 服務地區

[列出服務涵蓋的地區名稱]

## 評價資訊

- Google 評分：X.X 星
- Google 評論數：XXX 則
- 服務年資：X 年
```

---

## 7. 驗證清單

### 上線前必做

- [ ] `<title>` 60 字內，含主關鍵字
- [ ] `<meta name="description">` 150 字內，含 USP 和電話
- [ ] `<meta name="keywords">` 15–25 個關鍵字
- [ ] Canonical URL 設定正確
- [ ] Open Graph 標籤齊全（og:title / og:description / og:url）
- [ ] Geo meta tags 填入正確經緯度
- [ ] Schema.org LocalBusiness JSON-LD 完整
- [ ] Schema.org FAQPage JSON-LD（至少 5 則 Q&A）
- [ ] Schema.org AggregateRating（有 Google 評論後加入）
- [ ] `robots.txt` 建立，AI 爬蟲全部 Allow
- [ ] `sitemap.xml` 建立
- [ ] `llms.txt` 建立
- [ ] `<link rel="llms">` 加入 `<head>`

### 上線後必做

- [ ] Google Search Console 提交 sitemap
- [ ] Google 商家檔案 100% 完整（照片、服務、時間）
- [ ] 累積 Google 評論（10 則以上開始有感）
- [ ] 每週發 Google 商家貼文（優惠/新品/維修案例）

### 驗證工具

| 工具 | 用途 | 網址 |
|---|---|---|
| Google Rich Results Test | 驗證 Schema.org 是否正確 | search.google.com/test/rich-results |
| Google Search Console | 查排名、點擊、曝光 | search.google.com/search-console |
| Schema Markup Validator | 驗證結構化資料 | validator.schema.org |

---

## 注意事項

1. **AggregateRating** 要有真實評論才能加，填假數字會被 Google 懲罰
2. **llms.txt 的 `lastmod`** 跟 sitemap.xml 一樣，更新內容後要同步改日期
3. **Vercel 靜態站**記得加 `vercel.json`（見下方），否則會誤判為 Next.js

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**",
      "use": "@vercel/static"
    }
  ]
}
```

4. **查 AI 爬蟲有沒有來**：去主機的 access log 搜尋 `ClaudeBot`、`GPTBot`、`PerplexityBot`
5. **新站台**：先來的通常是 Bing / GPT，ClaudeBot 稍晚，不用著急，把以上做好就等

---

*整理自華訊通訊東海店 SEO+GEO 實戰案例 · 2026/06*
