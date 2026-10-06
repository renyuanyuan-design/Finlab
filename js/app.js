/* ============================================================
 * 金融研习社 FinLab · 应用逻辑
 * 模块：学习空间(攻略生成) / 研习社区(瀑布流) / 消息(找搭子+AI+招财兽) / 我的
 * 保留：匹配引擎、交换状态机、信用反哺、四金刚区、主题研习局、学习计划
 * ============================================================ */
(function () {
  "use strict";

  /* ---------- 存储 ---------- */
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  };
  let STORE = LS.get("finlab_store", null);
  if (!STORE) STORE = { demands: [], exchanges: [], me: null, collected: [], liked: [], themes: [], notes: [], pet: { exp: 30 }, integral: 120, aiLog: [], signed: "", currentGuide: "", challengeJoined: [] };
  ["themes", "notes", "pet", "aiLog", "challengeJoined"].forEach(k => { if (STORE[k] == null) STORE[k] = (k === "pet" ? { exp: 30 } : []); });
  if (STORE.me == null) STORE.me = JSON.parse(JSON.stringify(CURRENT_USER));
  if (STORE.pet == null) STORE.pet = { exp: 30 };
  if (STORE.integral == null) STORE.integral = 0;
  if (STORE.aiLog == null) STORE.aiLog = [];
  if (STORE.signed == null) STORE.signed = "";
  function persist() { LS.set("sx_store", STORE); }

  NOTES.forEach(p => { if (STORE.liked.includes(p.id)) p.liked = true; });

  const me = () => STORE.me;

  /* ---------- 图标 ---------- */
  const ICON = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    plaza: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z"/></svg>',
    space: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.8L12 17.8 6.5 20l1-6.8L3 8.9 9 8z"/></svg>',
    community: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></svg>',
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    me: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.3-9.3-8.5C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.3 7C19 16.7 12 21 12 21z"/></svg>',
    comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor" stroke="none"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>',
    pet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="9" r="2"/><circle cx="17" cy="9" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="9" cy="15" r="2"/><circle cx="15" cy="15" r="2"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
  };

  /* ---------- 工具 ---------- */
  const $screen = document.getElementById("screen");
  const $topbar = document.getElementById("topbar");
  const $tabbar = document.getElementById("tabbar");
  const $toast = document.getElementById("toast");

  function avatar(u, cls = "") { return `<div class="avatar ${cls}" style="background:${u.color || "#2563eb"}">${u.avatar || "?"}</div>`; }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function go(r) { location.hash = r; }
  /* 导航栈：记录访问路径，返回按钮按来路回退（从「我的」进的子页返回「我的」） */
  let NAV_STACK = [];
  function goBack() {
    if (NAV_STACK.length >= 2) {
      NAV_STACK.pop();                     // 弹出当前页
      const target = NAV_STACK.pop();      // 回到上一页
      go(target);
    } else {
      go("#/");
    }
  }
  function findUser(id) { return USERS.find(u => u.id === id); }
  function findEx(id) { return STORE.exchanges.find(e => e.id === id); }

  let toastTimer;
  function toast(msg) {
    $toast.textContent = msg; $toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => $toast.classList.remove("show"), 1800);
  }

  const STATUS_LABEL = { pending: "待确认", agreed: "已约定", ongoing: "进行中", completed: "已完成", reviewed: "已评价", cancelled: "已取消" };
  const STEP_ORDER = ["initiated", "pending", "agreed", "ongoing", "completed", "reviewed"];

  /* ---------- 顶部栏 / 底部导航（5 Tab + 中间发布） ---------- */
  function topbar(title, showBack, rightHtml) {
    $topbar.classList.remove("hide");
    $topbar.classList.remove("raw");
    $topbar.innerHTML = `
      ${showBack ? `<div class="back" data-act="back">${ICON.back}</div>` : `<div class="back" style="visibility:hidden">${ICON.back}</div>`}
      <h1>${esc(title)}</h1>
      <div class="right" id="topRight">${rightHtml || ""}</div>`;
  }
  function tabbar(active) {
    $tabbar.style.display = "flex";
    const tabs = [
      { k: "space", t: "学习空间", ic: ICON.space },
      { k: "community", t: "社区", ic: ICON.community },
      { k: "message", t: "消息", ic: ICON.message },
      { k: "me", t: "我的", ic: ICON.me },
    ];
    $tabbar.innerHTML = tabs.map(t => `
      <div class="tab ${active === t.k ? "on" : ""}" data-act="go" data-p="#/${t.k}">
        ${t.ic}<span>${t.t}</span>
      </div>`).join("");
  }

  /* ---------- 复用组件 ---------- */
  const KK_COLORS = ["#eef4fb", "#faf3e0", "#fff7ed", "#ecfdf3", "#eef1f7", "#fff7ed", "#eef4fb"];
  function kkGrid() {
    return `<div class="kk-grid">${SKILL_TREE.map((c, i) => `<div class="kk-item" data-act="cat" data-p="${c.cat}">
      <div class="kk-ic" style="background:${KK_COLORS[i % KK_COLORS.length]}">${CATEGORY_ICONS[c.cat] || "📌"}</div>
      <span>${c.cat}</span></div>`).join("")}</div>`;
  }
  function themeCard(t) {
    const pct = Math.round((t.joined / t.total) * 100);
    const joined = STORE.themes.includes(t.id);
    return `<div class="theme-card">
      <span class="tag hot" style="background:${t.hot ? "linear-gradient(135deg,#f59e0b,#ea580c)" : "rgba(15,76,129,.9)"}">${t.tag}</span>
      <div class="tt">${esc(t.title)}</div><div class="ts">${esc(t.skills)}</div>
      <div class="td">${esc(t.desc)}</div>
      <div class="prog"><i style="width:${pct}%"></i></div>
      <div class="row"><span>🕒 ${esc(t.time)}</span><span>📍 ${esc(t.place)}</span></div>
      <button class="btn sm" style="margin-top:10px;width:100%" data-act="joinTheme" data-p="${t.id}">${joined ? "已报名 ✓" : "立即报名"}</button>
    </div>`;
  }
  function matchCard(r) {
    const u = r.user, m = r;
    const badge = m.type === "强" ? `<span class="badge-strong">强匹配 · 双向互换</span>` : `<span class="badge-weak">弱匹配 · 发现</span>`;
    return `<div class="feed-card" data-st="${esc(u.name)} ${skillNames(u.teach).join(" ")} ${skillNames(u.want).join(" ")}">
      ${badge}
      <div class="top">${avatar(u)}
        <div><div class="name">${esc(u.name)} <span class="credit">★ ${u.credit}</span></div>
        <div class="meta">${esc(u.city)} · 活跃度 ${Math.round(u.active * 100)}%</div></div></div>
      <div class="skills"><span class="tag">能教</span>${u.teach.map(t => `<span class="tag gray">${esc(t.s)}<span class="level">${t.level}</span></span>`).join("")}</div>
      <div class="skills"><span class="tag purple">想学</span>${u.want.map(t => `<span class="tag gray">${esc(t.s)}<span class="level">${t.level}</span></span>`).join("")}</div>
      <div class="bio">${esc(u.bio)}</div>
      <div class="row" style="justify-content:space-between;margin-top:6px">
        <span class="score-pill">${r.discover ? "🔍 发现 · 潜在搭子" : "匹配度 " + m.total}</span>
        <button class="btn sm" data-act="initiate" data-p="${u.id}">发起交换</button>
      </div></div>`;
  }
  function emptyFeed() { return `<div class="empty"><div class="em">🧭</div>暂时没有匹配的人<br>去「发布」补全你的研习档案吧</div>`; }

  /* ---------- Hero 轮播文案 ---------- */
  const HEROS = [
    { cls: "hero-0", h: "用你懂的，换你想懂的", p: "零金钱成本，和真人互教互学 🤝", cta: "一键匹配", to: "#/match" },
    { cls: "hero-1", h: "本周热门：量化换财报", p: "6 人小班，零基础也能上手 📈", cta: "看主题局", to: "#/themes" },
    { cls: "hero-2", h: "边学边交真朋友", p: "财报换 CFA、定投换估值，知识不闲置 🌱", cta: "发布我的技能", to: "#/publish" },
  ];
  let carouselTimer = null, carouselIdx = 0;
  function startCarousel() {
    carouselIdx = 0; if (carouselTimer) clearInterval(carouselTimer);
    const slides = document.getElementById("slides"); if (!slides) return;
    const dots = document.querySelectorAll("#dots .d");
    carouselTimer = setInterval(() => {
      carouselIdx = (carouselIdx + 1) % HEROS.length;
      slides.style.transform = `translateX(-${carouselIdx * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("on", i === carouselIdx));
    }, 3200);
  }

  /* ============================================================
   * 学习空间（漫游记「旅行空间」迁移：攻略生成 + 空态 Hero + 攻略预览）
   * ============================================================ */
  function space() {
    topbar("学习空间", false);
    tabbar("space");
    const results = computeMatches(me(), USERS);
    const g = genGuide(STORE.currentGuide || "量化交易");
    $screen.innerHTML = `
      <div class="carousel" id="carousel">
        <div class="slides" id="slides">${HEROS.map(h => `<div class="slide ${h.cls}"><h3>${h.h}</h3><p>${h.p}</p>
          <button class="btn" data-act="go" data-p="${h.to}">${h.cta} →</button></div>`).join("")}</div>
        <div class="dots" id="dots">${HEROS.map((_, i) => `<span class="d ${i === 0 ? "on" : ""}"></span>`).join("")}</div>
      </div>

      <div class="hero-create" data-act="toggleCreate">
        <div class="suitcase">💼</div>
        <h2>制作我的学习空间</h2>
        <p>输入想学的金融技能，AI 一次性生成：资源清单 · 学习路径 · 每日计划</p>
        <button class="btn" data-act="toggleCreate">${STORE.currentGuide ? "重新生成攻略" : "开始制作 →"}</button>
      </div>

      <div id="createBox" style="display:none">
        <div class="card">
          <h3 style="margin-top:0">想学什么？</h3>
          <div class="chips" id="guideChips">${ALL_SKILLS.map(s => `<div class="chip ${STORE.currentGuide === s ? "on" : ""}" data-act="guidePick" data-p="${s}">${s}</div>`).join("")}</div>
          <div class="field" style="margin-top:12px"><label>学习周期（天）</label><input class="input" id="guideDays" value="21" placeholder="如 21"></div>
          <div class="field"><label>学习目标</label><input class="input" id="guideGoal" placeholder="如：能看懂一份年报"></div>
          <button class="btn" data-act="spaceGen">生成研习攻略 →</button>
        </div>
      </div>

      <div class="guide-preview">
        <div class="gp-head"><div><div class="gp-title">📘 ${esc(g.skill)} 学习攻略</div><div class="gp-sum">${esc(g.tag)} · ${esc(g.summary)}</div></div>
          <span class="btn sm ghost" data-act="go" data-p="#/guide">查看完整</span></div>
        <div class="section-title" style="margin:10px 0 6px;font-size:13px">热门资源</div>
        ${g.resources.map(r => resRow(r)).join("")}
        <div class="section-title" style="margin:12px 0 6px;font-size:13px">学习路径</div>
        <div class="path">${g.path.map(s => `<span class="step">${esc(s)}</span>`).join("")}</div>
        <div class="section-title" style="margin:12px 0 6px;font-size:13px">每日计划</div>
        <div class="timeline">${g.daily.map(d => `<div class="tl-item"><div class="tl-t">${esc(d.t)}</div><div class="tl-title">${esc(d.title)}</div><div class="tl-note">${esc(d.note)}</div></div>`).join("")}</div>
      </div>

      <div class="kingkong"><div class="section-title" style="margin:0 0 8px">按金融领域分类 <span class="more" data-act="go" data-p="#/explore/${encodeURIComponent("投资入门")}">全部 ›</span></div>${kkGrid()}</div>
      <div class="section-title">主题研习局 <span class="more" data-act="go" data-p="#/themes">全部 ›</span></div>
      <div class="hscroll">${THEME_GROUPS.map(t => themeCard(t)).join("")}</div>

      <div class="section-title">为你推荐 <span class="more" data-act="feedNext">换一批 ›</span></div>
      <div id="homeFeed"></div>`;
    startCarousel();
    renderHomeFeed();
  }

  /* ---------- 为你推荐：分批轮换（换一批） ---------- */
  let feedOffset = 0;
  const FEED_PAGE = 3;
  function buildFeedPool() {
    const matched = computeMatches(me(), USERS);
    const inPool = new Set(matched.map(r => r.user.name));
    const discover = USERS.filter(u => !inPool.has(u.name) && u.name !== me().name)
      .sort((a, b) => b.active - a.active)
      .map(u => ({ user: u, type: "弱", total: 0, wantHit: [], discover: true }));
    return matched.concat(discover);
  }
  function renderHomeFeed() {
    const feed = document.getElementById("homeFeed"); if (!feed) return;
    const pool = buildFeedPool();
    if (!pool.length) { feed.innerHTML = emptyFeed(); return; }
    const page = [];
    for (let i = 0; i < Math.min(FEED_PAGE, pool.length); i++) page.push(pool[(feedOffset + i) % pool.length]);
    feed.innerHTML = page.map(r => matchCard(r)).join("");
    feed.classList.remove("feed-in"); void feed.offsetWidth; feed.classList.add("feed-in");
  }

  /* ============================================================
   * 主题互换局（聚合落地页：轮播「看主题局」入口）
   * ============================================================ */
  function themes() {
    topbar("主题研习局", true); tabbar("");
    const joinedN = THEME_GROUPS.filter(t => STORE.themes.includes(t.id)).length;
    $screen.innerHTML = `
      <div class="card" style="background:linear-gradient(135deg,#0f4c81,#c9a227);color:#fff;border:none">
        <h3 style="margin:0 0 6px">🎯 主题研习局</h3>
        <p style="margin:0;opacity:.85;font-size:13px">一群人围绕一个「金融研习主题」组队互教互学，小班制、有排期、有进度。已报名 ${joinedN} 个局</p>
      </div>
      ${THEME_GROUPS.map(t => themeCard(t)).join("")}
      <button class="btn ghost" data-act="toast" data-p="发起主题局为 V1.5 规划功能，敬请期待 🚧" style="width:100%;margin-top:4px">＋ 发起我的主题局</button>`;
  }

  function resRow(r) {
    const heats = r.heat.map(i => `<span class="heat"><i style="background:${HEAT[i].color}"></i></span>`).join("");
    return `<div class="res-row"><div class="rr-name">${esc(r.name)}${heats}</div><div class="rr-price">${esc(r.price)}</div></div>`;
  }

  /* ---------- 攻略详情页（子页贴顶毛玻璃头 + 分享长图） ---------- */
  function guide() {
    const g = genGuide(STORE.currentGuide || "量化交易");
    topbar(`${g.skill} 攻略`, true, `<span class="share-link" data-act="guideShare">分享长图</span>`);
    tabbar("");
    $screen.innerHTML = `
      <div class="card"><div class="gp-sum" style="font-weight:700;font-size:15px">${esc(g.summary)}</div></div>
      <div class="card"><div class="section-title" style="margin:0 0 8px">热门资源（平台热度）</div>${g.resources.map(r => `<div class="res-row"><div class="rr-name">${esc(r.name)}${r.heat.map(i => `<span class="heat"><i style="background:${HEAT[i].color}"></i></span>`).join("")}</div><div style="display:flex;align-items:center;gap:8px"><span class="rr-price">${esc(r.price)}</span><button class="btn sm ghost" data-act="addRes" data-p="${esc(r.name)}">加入清单</button></div></div>`).join("")}</div>
      <div class="card"><div class="section-title" style="margin:0 0 8px">学习路径</div><div class="path">${g.path.map(s => `<span class="step">${esc(s)}</span>`).join("")}</div></div>
      <div class="card"><div class="section-title" style="margin:0 0 8px">每日计划</div><div class="timeline">${g.daily.map(d => `<div class="tl-item"><div class="tl-t">${esc(d.t)}</div><div class="tl-title">${esc(d.title)}</div><div class="tl-note">${esc(d.note)}</div></div>`).join("")}</div></div>
      <div class="share-long"><h3>${esc(g.skill)} 学习计划</h3><div class="gp-sum" style="opacity:.9;margin-bottom:8px">${esc(g.summary)}</div>
        ${g.daily.map(d => `<div class="sl-row"><span>${esc(d.t)}</span><span>${esc(d.title)}</span></div>`).join("")}
        <div class="sl-foot">由「金融研习社」学习空间生成 · 用你懂的换你想懂的</div></div>`;
  }

  /* ============================================================
   * 分类探索（漫游记「目的地分类页」迁移）
   * ============================================================ */
  function explore(cat) {
    topbar(cat, true); tabbar("");
    const catItems = (SKILL_TREE.find(c => c.cat === cat) || { items: [] }).items;
    const results = computeMatches(me(), USERS).filter(r => [...skillNames(r.user.teach), ...skillNames(r.user.want)].some(s => catItems.includes(s)));
    $screen.innerHTML = `
      <div class="searchbar">${ICON.search}<input class="input" placeholder="在「${esc(cat)}」中搜索…" data-search="expFeed"></div>
      <div class="kingkong">${kkGrid()}</div>
      <div class="section-title">${esc(cat)} · ${results.length} 位伙伴</div>
      <div id="expFeed">${results.length ? results.map(r => matchCard(r)).join("") : emptyFeed()}</div>`;
  }

  /* ============================================================
   * 学习计划 / 排期（漫游记「行程规划器」迁移）
   * ============================================================ */
  function plan() {
    topbar("学习计划", false); tabbar("");
    const week = ["一", "二", "三", "四", "五", "六", "日"];
    const busyDays = [2, 5];
    const exs = STORE.exchanges.filter(e => ["agreed", "ongoing"].includes(e.status));
    $screen.innerHTML = `
      <div class="card"><div class="section-title" style="margin:0 0 10px">本周排期</div>
        <div class="cal">${week.map((w, i) => `<div class="cd ${busyDays.includes(i + 1) ? "has" : ""}">${w}${busyDays.includes(i + 1) ? '<span class="dot"></span>' : ""}</div>`).join("")}</div></div>
      <div class="section-title">进行中的学习</div>
      ${exs.length ? exs.map(e => `<div class="plan-card" data-act="go" data-p="#/exchange/${e.id}"><div class="pc-ic">📚</div>
        <div style="flex:1"><div class="pc-t">与 ${esc(e.otherName)} 互换</div><div class="pc-m">${e.skillWant.join("、") || "—"} · ${esc(STATUS_LABEL[e.status])}</div></div>
        <span class="arrow" style="color:var(--muted)">${ICON.arrow}</span></div>`).join("") : `<div class="empty" style="padding:20px"><div class="em">🗓️</div>还没有进行中的学习，去广场发起交换吧</div>`}
      <div class="section-title" style="margin-top:16px">我的计划</div>
      ${PLANS.map(p => `<div class="plan-card"><div class="pc-ic">${p.mode === "线上" ? "💻" : "🤝"}</div>
        <div style="flex:1"><div class="pc-t">${esc(p.skill)}</div><div class="pc-m">与 ${esc(p.with)} · ${esc(p.time)} · ${esc(p.mode)}</div><div class="pc-m" style="color:var(--brand)">下次：${esc(p.next)}</div></div>
        <span class="tag ${p.status === "进行中" ? "green" : p.status === "待确认" ? "gray" : ""}">${esc(p.status)}</span></div>`).join("")}
      <button class="btn ghost" data-act="go" data-p="#/space" style="margin-top:6px">去广场找研习搭子</button>`;
  }

  /* ============================================================
   * 社区（漫游记「真·瀑布流」迁移）
   * ============================================================ */
  let postType = "全部";
  function community() {
    topbar("学习社区", false); tabbar("community");
    const tr = document.getElementById("topRight");
    if (tr) tr.innerHTML = `<span data-act="go" data-p="#/community/new" style="font-weight:700">发帖</span>`;
    const types = ["全部", "问答互助", "学习打卡", "成果展示", "经验分享"];
    $screen.innerHTML = `
      <div class="seg" id="postSeg" style="margin-bottom:12px">${types.map(t => `<div class="opt ${postType === t ? "on" : ""}" data-act="postType" data-p="${t}">${t === "全部" ? "推荐" : t}</div>`).join("")}</div>
      <div id="noteList"></div>`;
    renderNotes();
  }
  function renderNotes() {
    const box = document.getElementById("noteList");
    const arr = NOTES.filter(p => postType === "全部" || p.type === postType);
    // 两列错落：按索引交替分列
    const cols = [[], []];
    arr.forEach((p, i) => cols[i % 2].push(p));
    box.innerHTML = `<div class="masonry">${cols.map(c => `<div class="col">${c.map(noteCard).join("")}</div>`).join("")}</div>` ||
      `<div class="empty"><div class="em">💬</div>暂无帖子，去发一条吧</div>`;
  }
  function noteCard(p) {
    return `<div class="mnote" data-act="go" data-p="#/note/${p.id}">
      <div class="mn-cover" style="background:linear-gradient(135deg,${p.color},#f3effe)">${p.cover || "📌"}</div>
      <div class="mn-body"><div class="mn-title">${esc(p.text).slice(0, 32)}…</div>
      <div class="mn-meta"><span>#${esc(p.topic)}</span><span>${p.likes + (p.liked ? 1 : 0)} ❤</span></div></div></div>`;
  }
  function noteDetail(id) {
    const p = NOTES.find(x => x.id === id); if (!p) { go("#/community"); return; }
    topbar("笔记详情", true); tabbar("");
    $screen.innerHTML = `
      <div class="mnote" style="margin-bottom:12px">
        <div class="mn-cover" style="height:180px;font-size:64px;background:linear-gradient(135deg,${p.color},#f3effe)">${p.cover || "📌"}</div>
        <div class="mn-body"><div class="mn-title" style="font-size:15px">${esc(p.text)}</div>
        <div class="mn-meta" style="margin-top:8px"><span>#${esc(p.topic)} · ${esc(p.type)}</span></div></div></div>
      <div class="card"><div class="row"><div class="avatar sm" style="background:${p.color}">${p.avatar}</div>
        <div style="flex:1"><div class="name" style="font-size:14px;font-weight:700">${esc(p.author)}</div><div class="meta">${esc(p.time)} · ${esc(p.poi)}</div></div>
        <span class="${p.liked ? "credit" : ""}" data-act="like" data-p="${p.id}" style="cursor:pointer">${ICON.heart} ${p.likes + (p.liked ? 1 : 0)}</span></div></div>
      <div class="card"><div class="section-title" style="margin:0 0 8px">评论（${p.comments}）</div>
        <div class="row" style="gap:10px"><input class="input" placeholder="说点什么…"><button class="btn sm" data-act="toast" data-p="评论功能 V1.5 上线">发送</button></div></div>`;
  }
  function newPost() {
    topbar("发帖", true); tabbar("");
    const types = ["问答互助", "学习打卡", "成果展示", "经验分享"];
    $screen.innerHTML = `<form id="postForm"><div class="block"><h3 style="margin-top:0">类型</h3>
      <div class="chips" id="npType">${types.map((t, i) => `<div class="chip ${i === 0 ? "on" : ""}" data-act="npType" data-p="${t}">${t}</div>`).join("")}</div></div>
      <div class="block"><div class="field"><label>话题标签</label><input class="input" id="npTopic" placeholder="例如：CFA"></div>
      <div class="field" style="margin-bottom:0"><label>内容</label><textarea class="textarea" id="npText" placeholder="分享你的学习或成果…"></textarea></div></div>
      <button class="btn" type="submit">发布</button></form>`;
    window.__npType = types[0];
  }

  /* ============================================================
   * 消息 / 社交（漫游记「找搭子 + AI 搭子 + 好友 + 宠物」迁移）
   * ============================================================ */
  function message() {
    // 漫游记式布局：页面自带品牌顶栏，隐藏通用 topbar
    $topbar.classList.add("hide"); $topbar.innerHTML = ""; tabbar("message");
    const st = petStage(STORE.pet.exp);
    const lv = Math.max(1, PET_STAGES.indexOf(st) + 1);
    // 弹幕数据：emoji + 主题 · 城市 · 一句话（金融研习搭子）
    const DANMU = [
      { ic: "📈", t: "量化入门搭子", city: "上海", d: "求带跑通第一个回测！" },
      { ic: "📊", t: "财报共读搭子", city: "杭州", d: "每周拆一份年报，还缺 1 人" },
      { ic: "🎓", t: "CFA 备考搭子", city: "深圳", d: "每晚 8 点连麦刷原版书题" },
      { ic: "💰", t: "基金定投搭子", city: "北京", d: "互相监督纪律定投，来！" },
      { ic: "🧮", t: "估值建模搭子", city: "成都", d: "从 DCF 到 LBO，一起练" },
      { ic: "💳", t: "可转债打新搭子", city: "广州", d: "低风险玩法一起研究" },
      { ic: "🏦", t: "资产配置搭子", city: "南京", d: "四笔钱规划互相复盘" },
      { ic: "🛡️", t: "保险避坑搭子", city: "武汉", d: "先保障后理财，一起学" },
      { ic: "🤖", t: "Python 金融搭子", city: "西安", d: "akshare 拉数据一起折腾" },
      { ic: "📖", t: "考研金融搭子", city: "重庆", d: "431 金融专硕线上自习室" },
    ];
    $screen.innerHTML = `
      <div class="msg-hero">
        <div class="msg-logo"><span class="lg-ic">${ICON.logo}</span><span><span class="lg-name">金融研习社</span> <span class="lg-en">FinLab</span></span></div>
        <div class="msg-search" data-act="go" data-p="#/plaza">${ICON.search}想学啥？搜技能 / 搭子</div>
      </div>

      <div class="sec-head">
        <div class="sh-title">🧭 找研习搭子</div>
        <div class="pet-pill" data-act="go" data-p="#/pet">
          <span class="pp-av">${st.emoji}<span class="pp-lv">Lv.${lv}</span></span>
          <span class="pp-info"><div class="pp-name">我的招财兽</div><div class="pp-sub">${st.name}</div></span>
        </div>
      </div>
      <div class="danmu-card">
        <div class="danmu-area" id="danmu">${DANMU.map((m, i) => `<div class="danmu" style="top:${8 + (i % 4) * 42}px;animation-duration:${9 + (i % 5) * 2}s;animation-delay:${-i * 1.4}s"><b>${m.ic} ${m.t}</b> · <span class="dc">${m.city}</span> · ${m.d}</div>`).join("")}</div>
        <div class="match-bar">
          <div class="match-hint">按技能 / 城市 / 兴趣<br>推荐研习搭子</div>
          <button class="match-btn" data-act="openFilter">匹配研习搭子</button>
        </div>
      </div>

      <div class="sec-head"><div class="sh-title">🤖 AI 研习搭子</div></div>
      <div class="ai-card" data-act="go" data-p="#/ai">
        <div class="ai-av">🤖</div>
        <div style="flex:1"><div class="ai-t">AI 研习搭子</div><div class="ai-s">问规划 / 找资源 / 聊进度</div></div>
        <span style="color:var(--muted)">›</span>
      </div>

      <div class="sec-head"><div class="sh-title">👥 好友消息</div></div>
      <div class="friend-list">
        ${FRIEND_MSGS.map(f => `<div class="lrow" data-act="go" data-p="#/chat/${encodeURIComponent(f.who)}">
          <div class="f-av"><div class="avatar sm" style="background:linear-gradient(135deg,${f.color},${f.color}b0);color:#fff">${esc(f.avatar)}</div><span class="dot-online"></span>${f.unread ? `<span class="unread-badge">${f.unread}</span>` : ""}</div>
          <div style="flex:1;min-width:0"><div class="lt">${esc(f.who)}</div><div class="meta" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(f.last)}</div></div>
          <div class="f-time">${esc(f.time)}</div>
        </div>`).join("")}
      </div>`;
  }

  /* ============================================================
   * 聊天详情页（好友消息 → 一对一对话）
   * ============================================================ */
  const CHAT_SEED = {
    "K先生": [
      { me: 0, t: "你这两周量化练得咋样啦？" },
      { me: 1, t: "刚把 pandas 和数据获取过完，正想找你答疑 😄" },
      { me: 0, t: "可以，老时间，我帮你看看策略代码" },
      { me: 0, t: "明晚 8 点量化课准时开，记得装好 Python 环境～" },
    ],
    "小陈": [
      { me: 1, t: "估值模板发我一份呗，下周路演要用" },
      { me: 0, t: "没问题，我整理好就发你" },
      { me: 0, t: "财报分析的模板我发你微信啦" },
    ],
    "阿哲": [
      { me: 0, t: "这周末的财报共读局你来不来？就差一个人了" },
      { me: 0, t: "周末财报共读局还差 1 人，来不来？" },
    ],
    "Momo": [
      { me: 1, t: "刚搭了一个 DCF 模型，帮我看看 👀" },
      { me: 0, t: "你的 DCF 模型我超喜欢！" },
    ],
    "Coco": [
      { me: 0, t: "CFA 打卡群建好啦，把你拉进来" },
      { me: 0, t: "CFA 备考群组了个群，拉你" },
    ],
  };
  const CHAT_REPLIES = ["收到收到！", "好呀好呀 😄", "没问题 👌", "OK，等我消息～", "哈哈可以，到时候见", "行，就这么定了！", "这个主意不错 👍"];
  let chatLog = {};
  function chat(who) {
    const f = FRIEND_MSGS.find(x => x.who === who);
    if (!f) { go("#/message"); return; }
    f.unread = 0;
    topbar(who, true); tabbar("");
    $tabbar.style.display = "none";
    document.querySelector(".fab")?.classList.add("hide");
    if (!chatLog[who]) chatLog[who] = (CHAT_SEED[who] || [{ me: 0, t: f.last }]).slice();
    renderChat(who);
  }
  function renderChat(who) {
    const f = FRIEND_MSGS.find(x => x.who === who);
    const log = chatLog[who] || [];
    $screen.innerHTML = `
      <div class="chat-day">今天</div>
      <div class="chat-wrap" id="chatWrap">
        ${log.map(m => `<div class="chat-row ${m.me ? "mine" : ""}">
          ${m.me ? "" : `<div class="avatar sm" style="background:linear-gradient(135deg,${f.color},${f.color}b0);color:#fff">${esc(f.avatar)}</div>`}
          <div class="bubble ${m.me ? "me" : ""}">${esc(m.t)}</div>
          ${m.me ? `<div class="avatar sm" style="background:linear-gradient(135deg,#0f4c81,#c9a227);color:#fff">${esc(me().avatar)}</div>` : ""}
        </div>`).join("")}
      </div>
      <div class="chat-bar">
        <input class="input" id="chatInput" placeholder="说点什么…" autocomplete="off">
        <button class="btn sm" data-act="chatSend" data-p="${esc(who)}">${ICON.send}</button>
      </div>`;
    const input = document.getElementById("chatInput");
    input.addEventListener("keydown", e => { if (e.key === "Enter") chatSend(who); });
    const sc = document.querySelector(".screen");
    sc.scrollTop = sc.scrollHeight;
  }
  function chatSend(who) {
    const input = document.getElementById("chatInput");
    const text = (input.value || "").trim();
    if (!text) return;
    (chatLog[who] = chatLog[who] || []).push({ me: 1, t: text });
    renderChat(who);
    document.getElementById("chatInput")?.focus();
    setTimeout(() => {
      (chatLog[who] = chatLog[who] || []).push({ me: 0, t: CHAT_REPLIES[Math.floor(Math.random() * CHAT_REPLIES.length)] });
      if (location.hash === "#/chat/" + encodeURIComponent(who)) { renderChat(who); document.getElementById("chatInput")?.focus(); }
    }, 900);
  }
  /* ---------- 主题局报名抽屉（未报名→填表报名；已报名→详情+取消） ---------- */
  let jtTime = [];
  function refreshCur() {
    const h = location.hash || "#/space";
    if (h.indexOf("#/themes") === 0) themes(); else space();
  }
  function openJoinSheet(themeId) {
    const t = THEME_GROUPS.find(x => x.id === themeId); if (!t) return;
    let sheet = document.getElementById("joinSheet");
    if (!sheet) {
      sheet = document.createElement("div"); sheet.id = "joinSheet"; sheet.className = "filter-sheet";
      document.querySelector(".phone").appendChild(sheet);
    }
    const joined = STORE.themes.includes(themeId);
    const form = (STORE.themeForms || {})[themeId] || {};
    if (!joined) jtTime = [t.time];
    if (joined) {
      sheet.innerHTML = `
        ${SHEET_X}<div class="fs-title">🎟️ 报名详情</div>
        <div class="join-head"><b>${esc(t.title)}</b><span>${esc(t.skills)} · ${esc(t.time)} · ${esc(t.place)}</span></div>
        <div class="jd-row"><span class="jd-k">状态</span><span class="jd-badge">⏳ 待组织者确认</span></div>
        <div class="jd-row"><span class="jd-k">报名昵称</span><b>${esc(form.name || me().name)}</b></div>
        <div class="jd-row"><span class="jd-k">联系方式</span><b>${esc(form.contact || "—")}</b></div>
        <div class="jd-row"><span class="jd-k">可参与时段</span><b>${esc((form.times || []).join("、") || "—")}</b></div>
        <div class="jd-row"><span class="jd-k">自我介绍</span><b class="jd-intro">${esc(form.intro || "—")}</b></div>
        <div class="join-tip">开课前组织者会通过联系方式拉你进小班群，请留意消息 📬</div>
        <button class="ns-publish" style="background:linear-gradient(135deg,#f59e0b,#ea580c)" data-act="joinCancel" data-p="${themeId}">取消报名</button>`;
    } else {
      sheet.innerHTML = `
        ${SHEET_X}<div class="fs-title">📝 填写报名信息</div>
        <div class="join-head"><b>${esc(t.title)}</b><span>${esc(t.skills)} · ${esc(t.time)} · ${esc(t.place)} · 剩余 ${t.total - t.joined} 席</span></div>
        <div class="ns-lbl">报名昵称</div>
        <input class="ns-input" id="jtName" value="${esc(me().name)}" placeholder="怎么称呼你？">
        <div class="ns-lbl">联系方式 <span style="color:var(--muted);font-weight:400">（微信号 / 手机号，用于拉群）</span></div>
        <input class="ns-input" id="jtContact" placeholder="如：wx_abc123">
        <div class="ns-lbl">自我介绍 <span style="color:var(--muted);font-weight:400">（会教的 & 想学的）</span></div>
        <textarea class="ns-input" id="jtIntro" placeholder="如：会财报分析，零基础想学量化，每周能练 3 次"></textarea>
        <div class="ns-lbl">可参与时段</div>
        <div class="chips" style="margin-bottom:14px">${TIME_SLOTS.map(s => `<div class="chip ${jtTime.includes(s) ? "on" : ""}" data-act="jtTime" data-p="${esc(s)}">${esc(s)}</div>`).join("")}</div>
        <button class="ns-publish" data-act="joinSubmit" data-p="${themeId}">确认报名 · 积分 +10</button>`;
    }
    requestAnimationFrame(() => { sheet.classList.add("show"); showMask(); });
  }
  function joinSubmit(themeId) {
    const t = THEME_GROUPS.find(x => x.id === themeId); if (!t) return;
    const name = (document.getElementById("jtName") || {}).value?.trim();
    const contact = (document.getElementById("jtContact") || {}).value?.trim();
    const intro = (document.getElementById("jtIntro") || {}).value?.trim();
    if (!name) { toast("填一下报名昵称哦"); return; }
    if (!contact) { toast("留个联系方式，方便拉群"); return; }
    if (!jtTime.length) { toast("选一个可参与的时段"); return; }
    STORE.themeForms = STORE.themeForms || {};
    STORE.themeForms[themeId] = { name, contact, intro, times: [...jtTime] };
    if (!STORE.themes.includes(themeId)) { STORE.themes.push(themeId); t.joined = Math.min(t.joined + 1, t.total); }
    STORE.integral += 10; STORE.pet.exp = (STORE.pet.exp || 0) + 5; persist();
    closeSheets();
    toast(`报名成功！积分 +10，等待组织者确认 🎉`);
    refreshCur();
  }
  function joinCancel(themeId) {
    const t = THEME_GROUPS.find(x => x.id === themeId); if (!t) return;
    STORE.themes = STORE.themes.filter(x => x !== themeId);
    if (STORE.themeForms) delete STORE.themeForms[themeId];
    t.joined = Math.max(0, t.joined - 1); persist();
    closeSheets();
    toast("已取消报名，名额已释放");
    refreshCur();
  }

  let filterSel = { skill: "", city: "", mbti: "" };
  const SHEET_X = '<button class="fs-x" data-act="closeSheet" aria-label="关闭"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
  function ensureMask() {
    let mask = document.getElementById("sheetMask");
    if (!mask) { mask = document.createElement("div"); mask.id = "sheetMask"; mask.className = "sheet-mask"; mask.dataset.act = "closeSheet"; document.querySelector(".phone").appendChild(mask); }
    return mask;
  }
  function showMask() { ensureMask().classList.add("show"); }
  function closeSheets() {
    ["noteSheet", "filterSheet", "joinSheet"].forEach(id => { const s = document.getElementById(id); if (s) s.classList.remove("show"); });
    const mask = document.getElementById("sheetMask"); if (mask) mask.classList.remove("show");
  }
  function openFilterSheet() {
    let sheet = document.getElementById("filterSheet");
    if (sheet && sheet.classList.contains("show")) { closeSheets(); return; }
    if (!sheet) {
      sheet = document.createElement("div"); sheet.id = "filterSheet"; sheet.className = "filter-sheet";
      document.querySelector(".phone").appendChild(sheet);
    }
    sheet.innerHTML = `
      ${SHEET_X}<div class="fs-title">匹配我的研习搭子</div>
      <div class="fs-row"><div class="lbl">想学技能</div><div class="chips" id="fsSkill">${MATCH_OPTIONS.skill.map(s => `<div class="chip ${filterSel.skill === s ? "on" : ""}" data-act="fsSel" data-p="skill:${s}">${s}</div>`).join("")}</div></div>
      <div class="fs-row"><div class="lbl">城市</div><div class="chips" id="fsCity">${MATCH_OPTIONS.city.map(s => `<div class="chip ${filterSel.city === s ? "on" : ""}" data-act="fsSel" data-p="city:${s}">${s}</div>`).join("")}</div></div>
      <div class="fs-row"><div class="lbl">MBTI</div><div class="chips" id="fsMbti">${MATCH_OPTIONS.mbti.map(s => `<div class="chip ${filterSel.mbti === s ? "on" : ""}" data-act="fsSel" data-p="mbti:${s}">${s}</div>`).join("")}</div></div>
      <button class="btn" data-act="applyFilter">为你推荐以下搭子</button>`;
    sheet.classList.add("show"); showMask();
  }
  function applyFilter() {
    closeSheets();
    const res = computeMatches(me(), USERS).filter(r => {
      const u = r.user;
      if (filterSel.skill && ![...skillNames(u.teach), ...skillNames(u.want)].includes(filterSel.skill)) return false;
      if (filterSel.city && u.city !== filterSel.city) return false;
      if (filterSel.mbti && u.mbti !== filterSel.mbti) return false;
      return true;
    });
    const box = document.getElementById("homeFeed");
    toast(filterSel.skill || filterSel.city || filterSel.mbti ? "已按筛选推荐" : "已推荐全部");
    // 在消息页顶部插入推荐？简化：toast + 跳学习空间筛选
    go("#/explore/" + encodeURIComponent(filterSel.skill || "投资入门"));
  }

  /* ---------- AI 研习搭子对话 ---------- */
  function aiPage() {
    topbar("AI 研习搭子", true); tabbar("");
    if (!STORE.aiLog.length) STORE.aiLog = [{ who: "ai", text: "我是你的 AI 研习搭子 🤖 想规划学习、找搭子、还是撸招财兽？都听你的～" }];
    $screen.innerHTML = `
      <div class="chat" id="chat">${STORE.aiLog.map(m => `<div class="bubble ${m.who}">${esc(m.text)}</div>`).join("")}</div>
      <div class="chat-input"><input class="input" id="aiInput" placeholder="问问学习规划、资源、搭子…"><button class="btn sm" data-act="aiSend">${ICON.send}</button></div>`;
    $screen.scrollTop = $screen.scrollHeight;
  }
  function aiSend() {
    const inp = document.getElementById("aiInput"); if (!inp) return;
    const t = inp.value.trim(); if (!t) return;
    STORE.aiLog.push({ who: "me", text: t });
    STORE.aiLog.push({ who: "ai", text: aiReply(t) });
    persist(); aiPage();
  }

  /* ============================================================
   * 成长宠物（金融版「招财兽」）
   * ============================================================ */
  function petPage() {
    topbar("我的招财兽", true); tabbar("");
    const st = petStage(STORE.pet.exp);
    const next = PET_STAGES.find(s => s.min > STORE.pet.exp);
    const pct = next ? Math.round((STORE.pet.exp - st.min) / (next.min - st.min) * 100) : 100;
    $screen.innerHTML = `
      <div class="card"><div class="pet-stage"><div class="pet-big">${st.emoji}</div><div class="pet-name">${st.name} · Lv.${PET_STAGES.indexOf(st) + 1}</div>
        <div style="font-size:12px;color:var(--muted)">经验 ${STORE.pet.exp}${next ? " / 下一级 " + next.min : "（已满级）"}</div>
        <div class="exp-bar"><i style="width:${pct}%"></i></div>
        <div class="muted" style="font-size:12px">${next ? "距「" + next.name + "」还差 " + (next.min - STORE.pet.exp) + " 经验" : "已是最高形态 🎉"}</div></div></div>
      <div class="section-title">陪它玩，攒经验</div>
      <div class="pet-actions">
        <div class="pa" data-act="petPlay" data-p="feed"><span class="pe">🍖</span>喂食 +10</div>
        <div class="pa" data-act="petPlay" data-p="walk"><span class="pe">🚶</span>散步 +8</div>
        <div class="pa" data-act="petPlay" data-p="play"><span class="pe">🎾</span>玩耍 +12</div>
      </div>
      <div class="card" style="margin-top:14px"><div class="muted" style="font-size:13px;line-height:1.7">🐾 招财兽会随你的<b>打卡、完成互换、发笔记</b>而成长。每完成一次互换 +20，发笔记 +15，签到 +5。带它升级，解锁专属展示位！</div></div>`;
  }
  function petPlay(act) {
    const gain = act === "feed" ? 10 : act === "walk" ? 8 : 12;
    STORE.pet.exp += gain; persist();
    const before = petStage(STORE.pet.exp - gain).name, after = petStage(STORE.pet.exp).name;
    toast(after !== before ? `招财兽进化成「${after}」！` : `经验 +${gain}，陪它玩耍真开心`);
    petPage();
  }

  /* ============================================================
   * 我的（漫游记「数据概览 + 创意玩法 + 创作者」迁移）
   * ============================================================ */
  function mePage() {
    // 漫游记式布局：页面自带品牌顶栏，隐藏通用 topbar
    $topbar.classList.add("hide"); $topbar.innerHTML = ""; tabbar("me");
    const m = me();
    const exs = STORE.exchanges;
    const active = exs.filter(e => ["pending", "agreed", "ongoing"].includes(e.status)).length;
    const done = exs.filter(e => e.status === "reviewed").length;
    // 等级：由互换与发布推导；称号随等级
    const myNotes = NOTES.filter(n => n.author === m.name).concat(STORE.notes || []);
    const lv = Math.min(9, 1 + done + myNotes.length + Math.floor(STORE.integral / 100));
    const lvName = lv >= 5 ? "研习达人" : lv >= 3 ? "进阶学习者" : "学习者";
    const pStage = petStage(STORE.pet.exp);
    const pubList = myNotes.slice(0, 4);
    $screen.innerHTML = `
      <div class="msg-hero">
        <div class="msg-logo"><span class="lg-ic">${ICON.logo}</span><span><span class="lg-name">金融研习社</span> <span class="lg-en">FinLab</span></span></div>
        <div class="msg-search" data-act="go" data-p="#/plaza">${ICON.search}想学啥？搜技能 / 搭子</div>
      </div>

      <div class="profile-row">
        <div class="pr-av">${m.avatar || "我"}</div>
        <div style="flex:1;min-width:0">
          <div class="pr-name">${esc(m.name)}</div>
          <div class="pr-lv">Lv.${lv} · ${lvName} <span style="color:var(--muted);font-weight:400">· ★${m.credit} 信用分</span></div>
        </div>
        <button class="pub-btn" data-act="go" data-p="#/community/new">＋ 发布</button>
      </div>

      <div class="stat4">
        <div class="st" data-act="go" data-p="#/creators"><div class="sv">${STORE.integral}</div><div class="sl">积分</div></div>
        <div class="st" data-act="toast" data-p="已完成互换点亮技能：${done ? skillNames(me().teach).slice(0, 2).join("、") + " 等" : "完成首次互换即可点亮"}"><div class="sv">${done + (active ? 0 : 0)}</div><div class="sl">互换技能</div></div>
        <div class="st" data-act="go" data-p="#/space"><div class="sv">${STORE.currentGuide ? 1 : 0}</div><div class="sl">学习空间</div></div>
        <div class="st" data-act="go" data-p="#/community"><div class="sv">${myNotes.length}</div><div class="sl">发布</div></div>
      </div>

      <div class="sec-head"><div class="sh-title">💡 创意玩法</div></div>
      <div class="friend-list">
        <div class="lrow" data-act="go" data-p="#/ai"><span style="font-size:20px">🤖</span><span class="lt" style="margin-left:4px">AI 研习搭子</span><span class="arrow">${ICON.arrow}</span></div>
        <div class="lrow" data-act="go" data-p="#/challenges"><span style="font-size:20px">🏆</span><span class="lt" style="margin-left:4px">话题挑战赛 / 积分打卡</span><span class="arrow">${ICON.arrow}</span></div>
      </div>

      <div class="sec-head">
        <div class="sh-title">📓 我的发布</div>
        <span data-act="go" data-p="#/community/new" style="color:var(--brand);font-weight:800;font-size:13px;cursor:pointer">＋ 发布</span>
      </div>
      ${pubList.length ? `<div class="pub-grid">${pubList.map(p => `
        <div class="pgn" data-act="go" data-p="#/note/${p.id}">
          <div class="cover" style="background:linear-gradient(135deg,${p.color}22,#eaf1ff)">${p.cover || "📌"}</div>
          <div class="t">${esc(p.text).slice(0, 26)}</div>
          <div class="by"><span class="av" style="background:${p.color}">${esc(p.avatar)}</span><span>${esc(p.author)}</span><span class="hearts">❤ ${p.likes + (p.liked ? 1 : 0)}</span></div>
        </div>`).join("")}</div>` : `<div class="pub-more">还没有发布，点右上「＋ 发布」分享你的学习成果吧</div>`}

      <div class="sec-head"><div class="sh-title">其他</div></div>
      <div class="friend-list">
        <div class="lrow" data-act="signIn"><span>📅 每日签到</span><b style="color:var(--orange)">+5 积分</b><span class="arrow">${ICON.arrow}</span></div>
        <div class="lrow" data-act="go" data-p="#/pet"><span>🐾 我的招财兽</span><span class="muted">${pStage.emoji} ${pStage.name}</span><span class="arrow">${ICON.arrow}</span></div>
        <div class="lrow" data-act="go" data-p="#/publish"><span>🗂️ 研习档案</span><span class="muted">能教 ${m.teach.length} · 想学 ${m.want.length}</span><span class="arrow">${ICON.arrow}</span></div>
        <div class="lrow" data-act="go" data-p="#/plan"><span>🔄 我的交换</span><span class="muted">进行中 ${active} · 已完成 ${done}</span><span class="arrow">${ICON.arrow}</span></div>
        <div class="lrow" data-act="toast" data-p="设置：技能可见范围 / 通知偏好 / 账号与实名（V1.0 演示）"><span>⚙️ 设置</span><span class="arrow">${ICON.arrow}</span></div>
      </div>`;
  }

  /* ---------- 创作者中心 ---------- */
  function creators() {
    topbar("创作者指南", true); tabbar("");
    $screen.innerHTML = `
      <div class="card"><div class="section-title" style="margin:0 0 8px">成长阶梯</div>
        <div class="lrow"><span>素人</span><span class="muted">注册即可发布</span></div>
        <div class="lrow"><span>KOC</span><span class="muted">发布≥10 / 粉丝≥500 → 流量扶持+商单</span></div>
        <div class="lrow"><span>签约创作者</span><span class="muted">优质内容+审核 → 保底+品牌合作</span></div></div>
      <div class="card"><div class="section-title" style="margin:0 0 8px">里程换积分公式</div>
        <div class="muted" style="font-size:13px;line-height:1.7">完成 1 次互换 = 1 里程 = 20 积分；发 1 篇笔记 = 15 积分；连续签到叠加。积分可在商城兑换课程券 / 金融模板 / 招财兽道具。</div></div>
      <div class="card"><div class="section-title" style="margin:0 0 8px">高质量打卡要点</div>
        <div class="muted" style="font-size:13px;line-height:1.7">① 真实学习成果 + 过程记录；② 标注互换对象与技能；③ 写明踩坑与收获；④ 带 #研习成果展 更易被推荐。只分享知识，不荐股、不带单。</div></div>`;
  }
  function challenges() {
    topbar("话题挑战赛", true); tabbar("");
    $screen.innerHTML = `<div id="chList">${CHALLENGES.map(c => `<div class="challenge"><div class="ct">${esc(c.tag)}</div><div class="cd">${esc(c.desc)}</div>
      <div class="row" style="justify-content:space-between"><span class="cj">${c.joined + (STORE.challengeJoined?.includes(c.id) ? 1 : 0)} 人参与</span>
      <button class="btn sm" data-act="joinChallenge" data-p="${c.id}">${STORE.challengeJoined?.includes(c.id) ? "已参加·发笔记" : "参加"}</button></div></div>`).join("")}</div>`;
  }

  /* ---------- 挑战赛「参加」→ 发布笔记抽屉（漫游记式） ---------- */
  let nsTopicSel = "";
  function openNoteSheet(c) {
    if (!Array.isArray(STORE.challengeJoined)) STORE.challengeJoined = [];
    if (!STORE.challengeJoined.includes(c.id)) { STORE.challengeJoined.push(c.id); persist(); }
    let sheet = document.getElementById("noteSheet");
    if (!sheet) {
      sheet = document.createElement("div"); sheet.id = "noteSheet"; sheet.className = "filter-sheet note-sheet";
      document.querySelector(".phone").appendChild(sheet);
    }
    nsTopicSel = c.tag;
    sheet.innerHTML = `
      ${SHEET_X}<div class="fs-title">📨 发布笔记</div>
      <div class="ns-lbl">标题</div>
      <input class="ns-input" id="nsTitle" placeholder="如：30 天 CFA 打卡第 1 天">
      <div class="ns-lbl">正文</div>
      <textarea class="ns-input" id="nsText" placeholder="分享你的学习进度、踩坑、成果..."></textarea>
      <div class="ns-lbl">关联技能</div>
      <input class="ns-input" id="nsSkill" placeholder="如：CFA">
      <div class="ns-lbl">参与话题</div>
      <div class="chips">${CHALLENGES.map(x => `<div class="chip ${x.tag === nsTopicSel ? "on" : ""}" data-act="nsTopic" data-p="${esc(x.tag)}">${esc(x.tag)}</div>`).join("")}</div>
      <div class="ns-lbl">封面 emoji</div>
      <input class="ns-input" id="nsCover" placeholder="如：🐍（可选）">
      <button class="ns-publish" data-act="nsPublish">发布</button>`;
    requestAnimationFrame(() => { sheet.classList.add("show"); showMask(); });
  }
  function nsPublish() {
    const title = document.getElementById("nsTitle").value.trim();
    const text = document.getElementById("nsText").value.trim();
    if (!title || !text) { toast("标题和正文都要填哦"); return; }
    const skill = document.getElementById("nsSkill").value.trim() || "综合";
    const cover = document.getElementById("nsCover").value.trim() || "✏️";
    const id = "p" + Date.now();
    NOTES.unshift({ id, type: "学习打卡", topic: skill, author: me().name, avatar: me().avatar, color: me().color, time: "刚刚", cover, text: `${title}｜${text}`, likes: 0, comments: 0, liked: false, poi: me().city });
    (STORE.notes = STORE.notes || []).push(id);
    STORE.integral += 50; persist();
    closeSheets();
    toast("发布成功，积分 +50 🎉");
    go("#/community");
  }

  /* ============================================================
   * 发布（技能档案）
   * ============================================================ */
  let pub = { want: [], teach: [], wantLevel: "入门", teachLevel: "熟练", time: [], mode: "线上", bio: "" };
  function publish() {
    topbar("发布研习档案", true); tabbar("");
    const _me = me() || {};
    pub = { want: (_me.want || []).map(x => x.s), teach: (_me.teach || []).map(x => x.s), wantLevel: "入门", teachLevel: "熟练", time: (_me.teach || []).flatMap(t => t.time || []), mode: _me.teach?.[0]?.mode || "线上", bio: _me.bio || "" };
    $screen.innerHTML = `<form id="pubForm"><div class="block"><h3>① 我想学 <span class="muted" style="font-weight:400;font-size:12px">（可多选）</span></h3>
      <div class="chips" id="wantChips"></div>
      <div class="field" style="margin-top:12px"><label>默认水平</label><div class="seg" id="wantLevelSeg">${LEVELS.map(l => `<div class="opt ${pub.wantLevel === l ? "on" : ""}" data-act="pubLevel" data-p="want:${l}">${l}</div>`).join("")}</div></div></div>
      <div class="block"><h3>② 我能教 <span class="muted" style="font-weight:400;font-size:12px">（可多选）</span></h3>
      <div class="chips" id="teachChips"></div>
      <div class="field" style="margin-top:12px"><label>默认水平</label><div class="seg" id="teachLevelSeg">${LEVELS.map(l => `<div class="opt ${pub.teachLevel === l ? "on" : ""}" data-act="pubLevel" data-p="teach:${l}">${l}</div>`).join("")}</div></div></div>
      <div class="block"><h3>③ 可教学时间</h3><div class="chips" id="timeChips">${TIME_SLOTS.map(t => `<div class="chip ${pub.time.includes(t) ? "on" : ""}" data-act="pubTime" data-p="${t}">${t}</div>`).join("")}</div></div>
      <div class="block"><h3>④ 方式 & 简介</h3><div class="seg" id="modeSeg" style="margin-bottom:12px">${MODES.map(mm => `<div class="opt ${pub.mode === mm ? "on" : ""}" data-act="pubMode" data-p="${mm}">${mm}</div>`).join("")}</div>
      <div class="field" style="margin-bottom:0"><label>一句话简介</label><input class="input" id="bioInput" placeholder="例如：擅长财报分析，可以带入门" value="${esc(pub.bio)}"></div></div>
      <button class="btn" type="submit">发布并保存档案</button></form>`;
    document.getElementById("wantChips").innerHTML = ALL_SKILLS.map(s => `<div class="chip ${pub.want.includes(s) ? "on" : ""}" data-act="pubSkill" data-p="want:${s}">${s}</div>`).join("");
    document.getElementById("teachChips").innerHTML = ALL_SKILLS.map(s => `<div class="chip ${pub.teach.includes(s) ? "on" : ""}" data-act="pubSkill" data-p="teach:${s}">${s}</div>`).join("");
  }

  /* ============================================================
   * 一键匹配
   * ============================================================ */
  let match = { sel: [], phase: "pick" };
  function matchPage() {
    topbar("一键匹配", true); tabbar("");
    if (match.sel.length === 0) match.sel = me().want.map(x => x.s);
    if (match.phase === "pick") return renderMatchPick();
    if (match.phase === "calc") return renderMatchCalc();
    renderMatchResult();
  }
  function renderMatchPick() {
    $screen.innerHTML = `<div class="card"><h3 style="margin-top:0">想学什么？选好后帮你实时匹配 🔍</h3>
      <div class="chips" id="matchChips">${ALL_SKILLS.map(s => `<div class="chip ${match.sel.includes(s) ? "on" : ""}" data-act="matchSel" data-p="${s}">${s}</div>`).join("")}</div></div>
      <button class="btn" data-act="matchStart">开始匹配（${match.sel.length}）</button>
      <p class="muted" style="text-align:center;margin-top:10px;font-size:12px">未匹配到？去发布页补全研习档案</p>`;
  }
  function renderMatchCalc() { $screen.innerHTML = `<div class="calc"><div class="spinner"></div><div>正在计算最佳匹配…</div></div>`; setTimeout(() => { match.phase = "result"; matchPage(); }, 950); }
  function renderMatchResult() {
    const mObj = Object.assign({}, me(), { want: match.sel.map(s => ({ s, level: "入门" })) });
    const res = computeMatches(mObj, USERS);
    if (!res.length) { $screen.innerHTML = `<div class="empty"><div class="em">😶</div>没有找到能教你这些技能的人<br>试试换几个技能，或去发布页补全档案</div><button class="btn ghost" data-act="go" data-p="#/publish" style="margin-top:8px">去发布</button>`; return; }
    $screen.innerHTML = `<div class="row" style="justify-content:space-between;margin-bottom:8px"><b>为你找到 ${res.length} 个匹配</b><span class="muted" style="font-size:12px" data-act="go" data-p="#/match" data-reset="1">重算</span></div>
      <div id="matchList">${res.map(r => { const u = r.user; const badge = r.type === "强" ? `<span class="badge-strong">强匹配</span>` : `<span class="badge-weak">弱匹配</span>`;
        return `<div class="feed-card" data-st="${esc(u.name)} ${skillNames(u.teach).join(" ")} ${skillNames(u.want).join(" ")}">${badge}
          <div class="top">${avatar(u)}<div><div class="name">${esc(u.name)} <span class="credit">★ ${u.credit}</span></div><div class="meta">${esc(u.city)}</div></div></div>
          <div class="skills"><span class="tag">能教</span>${u.teach.map(t => `<span class="tag gray">${esc(t.s)}</span>`).join("")}</div>
          <div class="skills"><span class="tag purple">想学</span>${u.want.map(t => `<span class="tag gray">${esc(t.s)}</span>`).join("")}</div>
          <div class="row" style="justify-content:space-between;margin-top:8px"><span class="muted" style="font-size:12px">命中：${r.wantHit.join("、") || "—"}</span>
          <span class="row"><span class="score-pill">匹配度 ${r.total}</span><button class="btn sm" data-act="initiate" data-p="${u.id}">发起交换</button></span></div></div>`; }).join("")}</div>`;
  }

  /* ---------- 发起交换 ---------- */
  function initiate(otherId) {
    const other = findUser(otherId); if (!other) return;
    const m = me();
    const myWant = skillNames(m.want), myTeach = skillNames(m.teach);
    const wantHit = myWant.filter(s => skillNames(other.teach).includes(s));
    const teachHit = myTeach.filter(s => skillNames(other.want).includes(s));
    let type = "弱";
    if (myWant.length && myTeach.length && myWant.every(s => skillNames(other.teach).includes(s)) && myTeach.every(s => skillNames(other.want).includes(s))) type = "强";
    const ex = { id: "ex" + Date.now(), otherId, otherName: other.name, otherAvatar: other.avatar, otherColor: other.color, type, skillWant: wantHit, skillTeach: teachHit, status: "pending", schedule: "", createdAt: Date.now(), myReview: null };
    STORE.exchanges.unshift(ex); STORE.integral += 20; persist();
    toast("已发起交换，积分 +20"); go("#/exchange/" + ex.id);
  }

  /* ============================================================
   * 交换详情（状态机）
   * ============================================================ */
  let curExId = null;
  function exchange(id) {
    curExId = id; const ex = findEx(id); if (!ex) { go("#/me"); return; }
    topbar("交换详情", true); tabbar("");
    const other = findUser(ex.otherId) || { name: ex.otherName, avatar: ex.otherAvatar, color: ex.otherColor, city: "—", bio: "" };
    const idx = STEP_ORDER.indexOf(ex.status === "pending" ? "pending" : ex.status);
    const steps = STEP_ORDER.map((s, i) => { const cls = ex.status === "cancelled" ? "" : (i < idx ? "done" : (i === idx ? "cur" : "")); const label = s === "initiated" ? "已发起" : STATUS_LABEL[s]; return `<div class="st ${cls}"><div class="dot">${i < idx ? "✓" : i + 1}</div>${label}</div>`; }).join("");
    let actions = "";
    if (ex.status === "pending") actions = `<button class="btn" data-act="exAdv" data-p="confirm:${ex.id}">确认交换</button><button class="btn gray" data-act="exAdv" data-p="cancel:${ex.id}">取消交换</button>`;
    else if (ex.status === "agreed") actions = `<div class="field"><label>约定排期</label><input class="input" id="schedInput" placeholder="例如：每周三晚 20:00 线上" value="${esc(ex.schedule)}"></div><button class="btn" data-act="exAdv" data-p="ongoing:${ex.id}">开始学习</button><button class="btn gray" data-act="exAdv" data-p="cancel:${ex.id}">取消交换</button>`;
    else if (ex.status === "ongoing") actions = `<button class="btn" data-act="exAdv" data-p="complete:${ex.id}">完成互换</button><button class="btn gray" data-act="exAdv" data-p="cancel:${ex.id}">取消交换</button>`;
    else if (ex.status === "completed") actions = `<div class="block" style="margin-top:4px"><h3 style="margin-top:0">给 ${esc(other.name)} 评价</h3><div class="stars" id="stars">${[1,2,3,4,5].map(i => `<span class="s ${ex._rating >= i ? "on" : ""}" data-act="star" data-p="${i}">★</span>`).join("")}</div><textarea class="textarea" id="revText" placeholder="这次互换体验如何？">${ex.myReview ? esc(ex.myReview.text) : ""}</textarea></div><button class="btn" data-act="exAdv" data-p="review:${ex.id}">提交评价</button>`;
    else if (ex.status === "reviewed") actions = `<div class="card" style="text-align:center">🎉 互换完成，信用分已更新</div>`;
    else if (ex.status === "cancelled") actions = `<div class="card" style="text-align:center;color:var(--muted)">该交换已取消</div>`;
    $screen.innerHTML = `<div class="card"><div class="top row">${avatar(other, "lg")}<div><div class="name" style="font-size:17px">${esc(other.name)}</div><div class="meta">${esc(other.city)} · <span class="credit">★ ${other.credit || "—"}</span></div></div>${ex.type === "强" ? `<span class="tag green" style="margin-left:auto">强匹配</span>` : `<span class="tag gray" style="margin-left:auto">弱匹配</span>`}</div></div>
      <div class="card"><div class="steps">${steps}</div><div class="row" style="justify-content:space-between;font-size:13px"><span class="muted">状态</span><b>${ex.status === "cancelled" ? "已取消" : STATUS_LABEL[ex.status]}</b></div>
      <div style="height:1px;background:var(--line);margin:8px 0"></div>
      <div class="row" style="justify-content:space-between;font-size:13px"><span class="muted">你换到</span><span>${ex.skillWant.join("、") || "—"}</span></div>
      <div class="row" style="justify-content:space-between;font-size:13px;margin-top:6px"><span class="muted">你教出</span><span>${ex.skillTeach.join("、") || "—"}</span></div>
      ${ex.schedule ? `<div class="row" style="justify-content:space-between;font-size:13px;margin-top:6px"><span class="muted">排期</span><span>${esc(ex.schedule)}</span></div>` : ""}
      ${ex.myReview ? `<div class="row" style="justify-content:space-between;font-size:13px;margin-top:6px"><span class="muted">我的评价</span><span>${"★".repeat(ex.myReview.score)} ${esc(ex.myReview.text)}</span></div>` : ""}</div>${actions}`;
  }
  function exAdv(act, id) {
    const ex = findEx(id); if (!ex) return;
    if (act === "confirm") ex.status = "agreed";
    else if (act === "ongoing") { ex.schedule = (document.getElementById("schedInput") || {}).value || ex.schedule; ex.status = "ongoing"; }
    else if (act === "complete") ex.status = "completed";
    else if (act === "cancel") ex.status = "cancelled";
    else if (act === "review") {
      const score = ex._rating || 5; const text = (document.getElementById("revText") || {}).value || "";
      ex.myReview = { score, text }; ex.status = "reviewed";
      me().credit = Math.min(100, me().credit + 5); STORE.integral += 20;
      const o = findUser(ex.otherId); if (o) o.credit = Math.min(100, o.credit + 5);
      persist(); toast("评价成功，信用分 +5，积分 +20"); return exchange(id);
    }
    persist(); exchange(id);
  }

  /* ============================================================
   * 路由
   * ============================================================ */
  const routes = { space, community, message, me: mePage, publish, match: matchPage, plan, explore, guide, pet: petPage, ai: aiPage, creators, challenges, themes, note: noteDetail };
  function router() {
    closeSheets();
    document.querySelector(".fab")?.classList.remove("hide");
    const h = location.hash || "#/space";
    if (NAV_STACK.length >= 2 && NAV_STACK[NAV_STACK.length - 2] === h) NAV_STACK.pop();       // 浏览器原生后退
    else if (NAV_STACK[NAV_STACK.length - 1] !== h) NAV_STACK.push(h);                          // 前进导航
    const hash = (location.hash || "#/space").replace(/^#\//, "");
    const parts = hash.split("/");
    const path = parts[0];
    if (path === "" || path === "space") return space();
    if (path === "exchange") return exchange(parts[1]);
    if (path === "community" && parts[1] === "new") return newPost();
    if (path === "explore") return explore(decodeURIComponent(parts[1] || ""));
    if (path === "note") return noteDetail(parts[1]);
    if (path === "chat") return chat(decodeURIComponent(parts[1] || ""));
    if (path === "plan") return plan();
    (routes[path] || space)();
  }

  /* ============================================================
   * 事件委托
   * ============================================================ */
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-act]");
    if (!a) return;
    const act = a.dataset.act, p = a.dataset.p;
    switch (act) {
      case "go": if (a.dataset.reset) match = { sel: [], phase: "pick" }; go(p); break;
      case "cat": go("#/explore/" + encodeURIComponent(p)); break;
      case "toggleCreate": { const b = document.getElementById("createBox"); if (b) b.style.display = b.style.display === "none" ? "block" : "none"; break; }
      case "guidePick": {
        const el = a; STORE.currentGuide = (STORE.currentGuide === p ? "" : p);
        document.querySelectorAll("#guideChips .chip").forEach(c => c.classList.toggle("on", c.dataset.p === p && STORE.currentGuide === p));
        // 刷新攻略预览
        const g = genGuide(STORE.currentGuide || "量化交易");
        const prev = document.querySelector(".guide-preview");
        if (prev) { prev.querySelector(".gp-title").textContent = "📘 " + g.skill + " 学习攻略"; prev.querySelector(".gp-sum").textContent = g.tag + " · " + g.summary;
          prev.querySelectorAll(".res-row").forEach((row, i) => { if (g.resources[i]) row.querySelector(".rr-name").innerHTML = esc(g.resources[i].name) + g.resources[i].heat.map(k => `<span class="heat"><i style="background:${HEAT[k].color}"></i></span>`).join(""); });
          prev.querySelector(".path").innerHTML = g.path.map(s => `<span class="step">${esc(s)}</span>`).join("");
          prev.querySelector(".timeline").innerHTML = g.daily.map(d => `<div class="tl-item"><div class="tl-t">${esc(d.t)}</div><div class="tl-title">${esc(d.title)}</div><div class="tl-note">${esc(d.note)}</div></div>`).join("");
        }
        break;
      }
      case "spaceGen": {
        const days = (document.getElementById("guideDays") || {}).value || "21";
        const goal = (document.getElementById("guideGoal") || {}).value || "";
        if (!STORE.currentGuide) { toast("请先选一个想学的技能"); break; }
        STORE.guideDays = days; STORE.guideGoal = goal; persist();
        toast("攻略已生成，查看完整版 →"); go("#/guide"); break;
      }
      case "guideShare": toast("已生成攻略长图，去社区分享吧 📤"); break;
      case "addRes": toast("已加入清单：第 " + (STORE.themes.length + 1) + " 项资源（演示）"); break;
      case "joinTheme": openJoinSheet(p); break;
      case "feedNext": {
        const n = buildFeedPool().length;
        if (!n) { toast("暂无更多推荐，先去发布技能档案吧"); break; }
        feedOffset = (feedOffset + FEED_PAGE) % n;
        renderHomeFeed();
        break;
      }
      case "jtTime": { const i = jtTime.indexOf(p); if (i >= 0) jtTime.splice(i, 1); else jtTime.push(p); a.classList.toggle("on"); break; }
      case "joinSubmit": joinSubmit(p); break;
      case "joinCancel": joinCancel(p); break;
      case "chatSend": chatSend(p); break;
      case "initiate": initiate(p); break;
      case "openFilter": openFilterSheet(); break;
      case "fsSel": {
        const [k, v] = p.split(":"); filterSel[k] = filterSel[k] === v ? "" : v;
        document.querySelectorAll(`#fs${k.charAt(0).toUpperCase() + k.slice(1)} .chip`).forEach(c => c.classList.toggle("on", c.dataset.p === p && filterSel[k] === v));
        break;
      }
      case "applyFilter": applyFilter(); break;
      case "aiSend": aiSend(); break;
      case "petPlay": petPlay(p); break;
      case "signIn": {
        const today = new Date().toISOString().slice(0, 10);
        if (STORE.signed === today) { toast("今天已签到啦"); break; }
        STORE.signed = today; STORE.integral += 5; STORE.pet.exp += 5; persist(); toast("签到成功，积分 +5"); mePage(); break;
      }
      case "joinChallenge": {
        const c = CHALLENGES.find(x => x.id === p);
        STORE.integral += 20; persist();
        toast("已参加，去发布你的挑战笔记吧 🎉");
        challenges();
        openNoteSheet(c);
        break;
      }
      case "pubSkill": { const [k, s] = p.split(":"); const arr = k === "want" ? pub.want : pub.teach; const i = arr.indexOf(s); if (i >= 0) arr.splice(i, 1); else arr.push(s);
        document.querySelectorAll(`#${k}Chips .chip`).forEach(c => c.classList.toggle("on", arr.includes(c.dataset.p.split(":")[1]))); break; }
      case "pubLevel": { const [k, l] = p.split(":"); if (k === "want") pub.wantLevel = l; else pub.teachLevel = l; document.querySelectorAll(`#${k}LevelSeg .opt`).forEach(o => o.classList.toggle("on", o.dataset.p === p)); break; }
      case "pubTime": { const i = pub.time.indexOf(p); if (i >= 0) pub.time.splice(i, 1); else pub.time.push(p); a.classList.toggle("on"); break; }
      case "pubMode": pub.mode = p; document.querySelectorAll("#modeSeg .opt").forEach(o => o.classList.toggle("on", o.dataset.p === p)); break;
      case "matchSel": { const i = match.sel.indexOf(p); if (i >= 0) match.sel.splice(i, 1); else match.sel.push(p); a.classList.toggle("on"); const btn = document.querySelector('[data-act="matchStart"]'); if (btn) btn.textContent = `开始匹配（${match.sel.length}）`; break; }
      case "matchStart": if (!match.sel.length) { toast("请至少选择一个想学的技能"); break; } match.phase = "calc"; matchPage(); break;
      case "exAdv": { const [ac, id] = p.split(":"); exAdv(ac, id); break; }
      case "star": { const ex = findEx(curExId); if (!ex) break; ex._rating = +p; document.querySelectorAll("#stars .s").forEach(s => s.classList.toggle("on", +s.dataset.p <= ex._rating)); break; }
      case "postType": postType = p; community(); break;
      case "like": { const note = NOTES.find(x => x.id === p); note.liked = !note.liked; if (note.liked) { STORE.liked.push(p); STORE.integral += 50; STORE.pet.exp += 15; toast("已赞，积分 +50"); } else { STORE.liked = STORE.liked.filter(x => x !== p); } persist();
        if (location.hash.indexOf("#/note/") >= 0) noteDetail(p); else renderNotes(); break; }
      case "npType": window.__npType = p; document.querySelectorAll("#npType .chip").forEach(c => c.classList.toggle("on", c.dataset.p === p)); break;
      case "back": goBack(); break;
      case "closeSheet": closeSheets(); break;
      case "nsTopic": nsTopicSel = p; document.querySelectorAll("#noteSheet .chip").forEach(c => c.classList.toggle("on", c.dataset.p === p)); break;
      case "nsPublish": nsPublish(); break;
      case "toast": toast(p); break;
    }
  });

  document.addEventListener("submit", e => {
    e.preventDefault();
    if (e.target.id === "pubForm") {
      pub.bio = (document.getElementById("bioInput") || {}).value || "";
      if (!pub.want.length || !pub.teach.length) { toast("请至少各选一项想学 / 能教"); return; }
      const m = me();
      m.want = pub.want.map(s => ({ s, level: pub.wantLevel, time: [], mode: "线上" }));
      m.teach = pub.teach.map(s => ({ s, level: pub.teachLevel, time: pub.time.length ? pub.time : ["周末白天"], mode: pub.mode }));
      m.bio = pub.bio;
      STORE.demands.unshift({ id: "d" + Date.now(), want: pub.want, teach: pub.teach, time: pub.time, mode: pub.mode, bio: pub.bio, status: "生效" });
      persist(); toast("已发布，去学习空间看看攻略吧"); go("#/space");
    }
    if (e.target.id === "postForm") {
      const topic = (document.getElementById("npTopic") || {}).value || "学习";
      const text = (document.getElementById("npText") || {}).value || "";
      if (!text.trim()) { toast("写点内容再发布吧"); return; }
      NOTES.unshift({ id: "p" + Date.now(), type: window.__npType, topic, author: me().name, avatar: me().avatar, color: me().color, time: "刚刚", cover: "✏️", text, likes: 0, comments: 0, liked: false, poi: me().city });
      STORE.integral += 50; STORE.pet.exp += 15; persist();
      toast("发布成功，积分 +50"); go("#/community");
    }
  });

  document.addEventListener("input", e => {
    const t = e.target;
    if (t.dataset.search) {
      const q = t.value.trim().toLowerCase();
      const box = document.getElementById(t.dataset.search);
      if (!box) return;
      box.querySelectorAll("[data-st]").forEach(c => { c.style.display = c.getAttribute("data-st").toLowerCase().includes(q) ? "" : "none"; });
    }
  });

  window.addEventListener("hashchange", router);
  const $fab = document.querySelector(".fab");
  if ($fab) $fab.innerHTML = ICON.plus;
  router();
})();
