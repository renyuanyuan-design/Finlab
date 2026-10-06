/* ============================================================
 * 金融研习社 FinLab · 数据层（mock + 匹配引擎）
 * 由「技能互换平台」金融化改造：全部学习内容迁移为金融领域
 * 保留：匹配引擎 / 交换状态机 / 信用反哺 / 积分 / 成长宠物
 * ============================================================ */

/* 两级技能词库（金融领域版） */
const SKILL_TREE = [
  { cat: "投资入门", items: ["基金定投", "股票基础", "ETF 指数", "可转债", "资产配置"] },
  { cat: "进阶交易", items: ["技术分析", "价值投资", "量化交易", "期权", "期货"] },
  { cat: "财务技能", items: ["财报分析", "估值建模", "金融 Excel", "行业研究", "金融英语"] },
  { cat: "考证提升", items: ["CFA", "FRM", "CPA", "证券从业", "基金从业"] },
  { cat: "风控合规", items: ["风险管理", "合规实务", "信用分析", "反洗钱"] },
  { cat: "理财规划", items: ["保险规划", "税务筹划", "养老金规划", "现金流管理"] },
  { cat: "金融科技", items: ["Python 金融", "区块链", "大数据风控", "智能投顾"] },
];

/* 全部标准标签扁平化，便于检索 */
const ALL_SKILLS = SKILL_TREE.flatMap(s => s.items);

/* 时间片与时间档位 */
const TIME_SLOTS = ["工作日白天", "工作日晚上", "周末白天", "周末晚上"];
const MODES = ["线上", "线下", "均可"];
const LEVELS = ["入门", "进阶", "熟练"];

/* 头像色板 */
const AVATAR_COLORS = ["#0f4c81", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2", "#ca8a04", "#dc2626"];

/* mock 用户研习档案（teach: 能教  want: 想学  含 level / time / mode / credit / active） */
const USERS = [
  {
    id: "u1", name: "林晚", avatar: "林", color: "#0f4c81", city: "上海", bio: "券商研究所，爱拆年报也爱咖啡",
    credit: 92, active: 0.9,
    teach: [{ s: "财报分析", level: "熟练", time: ["工作日晚上", "周末白天"], mode: "线上" },
            { s: "行业研究", level: "进阶", time: ["周末白天"], mode: "均可" }],
    want:  [{ s: "量化交易", level: "入门" }, { s: "Python 金融", level: "入门" }],
  },
  {
    id: "u2", name: "阿哲", avatar: "哲", color: "#ea580c", city: "杭州", bio: "定投五年，穿越牛熊的老基民",
    credit: 88, active: 0.85,
    teach: [{ s: "基金定投", level: "熟练", time: ["周末白天", "周末晚上"], mode: "均可" }],
    want:  [{ s: "技术分析", level: "入门" }, { s: "金融 Excel", level: "入门" }],
  },
  {
    id: "u3", name: "Momo", avatar: "M", color: "#7c3aed", city: "深圳", bio: "30 岁投行分析师，分享即快乐",
    credit: 95, active: 0.95,
    teach: [{ s: "估值建模", level: "熟练", time: ["工作日晚上"], mode: "线上" },
            { s: "价值投资", level: "进阶", time: ["周末白天"], mode: "均可" }],
    want:  [{ s: "风险管理", level: "进阶" }, { s: "CFA", level: "进阶" }],
  },
  {
    id: "u4", name: "小陈", avatar: "陈", color: "#16a34a", city: "北京", bio: "24 届应届生，Excel 建模小能手",
    credit: 80, active: 0.7,
    teach: [{ s: "金融 Excel", level: "熟练", time: ["工作日晚上", "周末白天"], mode: "线上" },
            { s: "基金从业", level: "进阶", time: ["周末白天"], mode: "线上" }],
    want:  [{ s: "量化交易", level: "入门" }, { s: "财报分析", level: "入门" }],
  },
  {
    id: "u5", name: "K先生", avatar: "K", color: "#0891b2", city: "广州", bio: "量化工程师，乐于带新人入坑",
    credit: 90, active: 0.8,
    teach: [{ s: "Python 金融", level: "熟练", time: ["工作日晚上", "周末晚上"], mode: "线上" },
            { s: "量化交易", level: "熟练", time: ["周末晚上"], mode: "线上" }],
    want:  [{ s: "估值建模", level: "入门" }, { s: "财报分析", level: "入门" }],
  },
  {
    id: "u6", name: "精算姐", avatar: "算", color: "#db2777", city: "成都", bio: "精算师，治愈系家庭保障规划",
    credit: 86, active: 0.75,
    teach: [{ s: "保险规划", level: "熟练", time: ["工作日白天", "周末白天"], mode: "均可" }],
    want:  [{ s: "Python 金融", level: "入门" }, { s: "财报分析", level: "入门" }],
  },
  {
    id: "u7", name: "老周", avatar: "周", color: "#ca8a04", city: "武汉", bio: "银行十年，资产配置不焦虑",
    credit: 84, active: 0.7,
    teach: [{ s: "资产配置", level: "熟练", time: ["工作日晚上", "周末白天"], mode: "均可" }],
    want:  [{ s: "估值建模", level: "入门" }, { s: "CFA", level: "入门" }],
  },
  {
    id: "u8", name: "Coco", avatar: "C", color: "#dc2626", city: "南京", bio: "CFA + FRM 双证，陪你啃书上岸",
    credit: 91, active: 0.85,
    teach: [{ s: "CFA", level: "熟练", time: ["工作日晚上", "周末白天"], mode: "线上" },
            { s: "FRM", level: "进阶", time: ["周末白天"], mode: "线上" }],
    want:  [{ s: "Python 金融", level: "入门" }, { s: "估值建模", level: "入门" }],
  },
  {
    id: "u9", name: "阿May", avatar: "M", color: "#7c3aed", city: "西安", bio: "可转债玩家，低风险教学 3 年",
    credit: 83, active: 0.72,
    teach: [{ s: "可转债", level: "熟练", time: ["周末白天", "周末晚上"], mode: "均可" }],
    want:  [{ s: "财报分析", level: "入门" }, { s: "金融 Excel", level: "入门" }],
  },
];

/* 当前登录用户（可在发布页编辑档案） */
const CURRENT_USER = {
  id: "me", name: "我", avatar: "我", color: "#0f4c81", city: "我的城市", bio: "刚加入，想用金融 Excel 换量化交易",
  credit: 70, active: 0.6,
  teach: [{ s: "金融 Excel", level: "熟练", time: ["工作日晚上", "周末白天"], mode: "线上" }],
  want:  [{ s: "量化交易", level: "入门" }],
};

/* 资源库 mock */
const RESOURCES = [
  { id: "r1", type: "视频课程", title: "Python 量化入门 12 讲", cat: "金融科技", author: "K先生", cover: "#0f4c81", collected: false, hot: 1280 },
  { id: "r2", type: "图文教程", title: "财报分析三步法图解", cat: "财务技能", author: "小陈", cover: "#16a34a", collected: false, hot: 960 },
  { id: "r3", type: "工具模板", title: "DCF 估值建模模板合集", cat: "财务技能", author: "Momo", cover: "#0891b2", collected: false, hot: 740 },
  { id: "r4", type: "书单清单", title: "价值投资必读 8 本书", cat: "投资入门", author: "阿哲", cover: "#ea580c", collected: false, hot: 610 },
  { id: "r5", type: "视频课程", title: "CFA 一级 21 天冲刺", cat: "考证提升", author: "Coco", cover: "#7c3aed", collected: false, hot: 880 },
  { id: "r6", type: "图文教程", title: "家庭资产四笔钱实操", cat: "理财规划", author: "老周", cover: "#ca8a04", collected: false, hot: 530 },
  { id: "r7", type: "视频课程", title: "可转债打新实战课", cat: "进阶交易", author: "阿May", cover: "#dc2626", collected: false, hot: 700 },
  { id: "r8", type: "工具模板", title: "基金定投计划表模板", cat: "理财规划", author: "精算姐", cover: "#db2777", collected: false, hot: 450 },
];

/* 社区帖子 mock */
const POSTS = [
  { id: "p1", type: "成果展示", topic: "量化交易", author: "小陈", avatar: "陈", color: "#16a34a", time: "2 小时前",
    text: "用金融 Excel 换了 3 节量化，今天跑通了第一个回测！研习互换真香 🎉", likes: 32, comments: 8, liked: false },
  { id: "p2", type: "问答互助", topic: "基金定投", author: "阿哲", avatar: "哲", color: "#ea580c", time: "5 小时前",
    text: "新手定投求推荐入门书，预算 100 内，指数基金方向，谢谢各位大佬～", likes: 18, comments: 21, liked: false },
  { id: "p3", type: "学习打卡", topic: "财报分析", author: "老周", avatar: "周", color: "#ca8a04", time: "昨天",
    text: "连续打卡第 12 天，用金融 Excel 换的财报课见效了，拆完第一份完整年报 💪", likes: 45, comments: 6, liked: false },
  { id: "p4", type: "经验分享", topic: "估值建模", author: "Momo", avatar: "M", color: "#7c3aed", time: "昨天",
    text: "分享我的带教节奏：每次 1 小时，先演示再让对方动手搭模型，留作业下次复盘。互教互学效率最高。", likes: 56, comments: 12, liked: false },
  { id: "p5", type: "成果展示", topic: "CFA", author: "Coco", avatar: "C", color: "#dc2626", time: "2 天前",
    text: "用财报分析换的 CFA 一级网课结课啦，Mock 冲到 75%，来接好运～", likes: 40, comments: 9, liked: false },
  { id: "p6", type: "问答互助", topic: "技术分析", author: "阿May", avatar: "M", color: "#7c3aed", time: "2 天前",
    text: "总是追涨杀跌？试试「先写交易计划再下单」，每天 10 分钟复盘，两周见效。有一起打卡的吗？", likes: 29, comments: 15, liked: false },
];

/* ---------- 匹配引擎 ---------- */
/* 强匹配：A想学 ⊆ B能教 且 A能教 ⊆ B想学
 * 弱匹配：仅一个方向满足
 * 匹配分 = 技能契合度 + 时间重叠 + 方式一致 + 信用分 + 活跃度
 */
function skillNames(arr) { return arr.map(x => x.s); }

function computeMatches(me, candidates) {
  const myWant = skillNames(me.want);
  const myTeach = skillNames(me.teach);
  const results = [];

  candidates.forEach(b => {
    const bTeach = skillNames(b.teach);
    const bWant = skillNames(b.want);

    const wantHit = myWant.filter(s => bTeach.includes(s));   // B 能教我想要的
    const teachHit = myTeach.filter(s => bWant.includes(s));  // B 想要我会的

    if (wantHit.length === 0 && teachHit.length === 0) return; // 无交集，跳过

    let type = "弱";
    if (myWant.length && myTeach.length &&
        myWant.every(s => bTeach.includes(s)) &&
        myTeach.every(s => bWant.includes(s))) {
      type = "强";
    }

    // 时间重叠：取双方可用时间交集数量
    const myTime = me.teach.flatMap(t => t.time);
    const bTime = b.teach.flatMap(t => t.time);
    const timeOverlap = myTime.filter(t => bTime.includes(t)).length;

    // 方式一致：双方任一 teach 方式含"均可"或相同
    const myModes = me.teach.map(t => t.mode);
    const bModes = b.teach.map(t => t.mode);
    let modeMatch = 0;
    for (const m of myModes) {
      if (m === "均可" || bModes.includes(m) || bModes.includes("均可")) { modeMatch = 1; break; }
    }

    const fitScore = (wantHit.length + teachHit.length) * 15;
    const timeScore = timeOverlap * 6;
    const modeScore = modeMatch ? 8 : 0;
    const creditScore = (b.credit / 100) * 10;
    const activeScore = b.active * 8;
    const total = Math.round(fitScore + timeScore + modeScore + creditScore + activeScore);

    results.push({
      user: b, type, total,
      wantHit, teachHit, timeOverlap, modeMatch,
    });
  });

  results.sort((a, b) => b.total - a.total);
  return results;
}

/* ---------- 分类图标（首页金刚区，金融领域分类） ---------- */
const CATEGORY_ICONS = {
  "投资入门": "💰", "进阶交易": "📈", "财务技能": "📊", "考证提升": "🎓",
  "风控合规": "🛡️", "理财规划": "🏦", "金融科技": "🤖",
};

/* ---------- 主题研习局（金融主题组队互教互学） ---------- */
const THEME_GROUPS = [
  { id: "t1", title: "量化换财报局", skills: "Python 量化 ⇄ 财报分析", desc: "零基础入门，6 人小班互教互学", time: "每周三 20:00", place: "线上会议室", joined: 4, total: 6, tag: "热门", hot: true },
  { id: "t2", title: "CFA 备考局", skills: "财报分析 ⇄ CFA", desc: "用你的财报功底换持证经验", time: "周末 10:00", place: "线上 + 同城", joined: 3, total: 8, tag: "招募中", hot: false },
  { id: "t3", title: "定投换估值局", skills: "基金定投 ⇄ 估值建模", desc: "定投达人对阵建模高手", time: "每周五 19:30", place: "线上", joined: 5, total: 6, tag: "仅剩 1 席", hot: false },
  { id: "t4", title: "可转债换 Excel 局", skills: "可转债 ⇄ 金融 Excel", desc: "低风险与高效率，各取所需", time: "周日 15:00", place: "线上", joined: 2, total: 6, tag: "新人友好", hot: false },
];

/* ---------- 学习计划 / 排期 ---------- */
const PLANS = [
  { id: "p1", with: "K先生", skill: "量化入门", time: "周三 20:00", mode: "线上", status: "已约定", next: "今晚 20:00" },
  { id: "p2", with: "小陈", skill: "估值建模带教", time: "周六 10:00", mode: "线上", status: "进行中", next: "本周六" },
  { id: "p3", with: "阿哲", skill: "财报共读", time: "周日 14:00", mode: "均可", status: "待确认", next: "待对方确认" },
];

/* ============================================================
 * 研习攻略生成库（想学技能 → 攻略：热门资源 + 学习路径 + 每日计划）
 * ============================================================ */

/* 资源平台热度三色（B站粉 / 雪球蓝 / 小红书红） */
const HEAT = [
  { name: "B站", color: "#fb7299" },
  { name: "雪球", color: "#1e6ee5" },
  { name: "小红书", color: "#ff2442" },
];

const SKILL_GUIDES = {
  "基金定投": {
    tag: "投资入门", summary: "0→1 搭建定投体系，21 天养成纪律",
    resources: [
      { name: "B站·指数基金入门到实操（免费）", price: "免费", heat: [0, 2] },
      { name: "雪球·基金定投实战专栏", price: "¥99", heat: [1] },
      { name: "《指数基金投资指南》", price: "¥45", heat: [2] },
    ],
    path: ["认识指数", "挑选基金", "定投策略", "估值买入", "止盈纪律", "复盘迭代"],
    daily: [
      { t: "Day1-3", title: "认识宽基指数", note: "搞懂沪深 300 与中证 500 的区别" },
      { t: "Day4-7", title: "估值方法", note: "学会看 PE / PB 历史百分位" },
      { t: "Day8-14", title: "搭建定投计划", note: "用「四笔钱」法规划每月工资" },
      { t: "Day15-21", title: "模拟盘实操", note: "按计划完成 3 次模拟定投" },
    ],
  },
  "财报分析": {
    tag: "财务技能", summary: "从三大报表到拆年报，3 周读懂一家公司",
    resources: [
      { name: "B站·财报三表入门（免费）", price: "免费", heat: [0] },
      { name: "雪球·手把手教你读财报专栏", price: "免费", heat: [2] },
      { name: "《手把手教你读财报》", price: "¥58", heat: [2] },
    ],
    path: ["三大报表", "偿债能力", "营运效率", "盈利质量", "估值应用", "年报实战"],
    daily: [
      { t: "Week1", title: "三大报表", note: "找一家熟悉的公司对照读原表" },
      { t: "Week2", title: "财务比率", note: "算 5 个核心比率并写出解读" },
      { t: "Week3", title: "年报拆解", note: "输出一页纸分析报告" },
    ],
  },
  "量化交易": {
    tag: "金融科技", summary: "Python + 行情数据，21 天跑通第一个回测",
    resources: [
      { name: "B站·Python 量化入门（免费）", price: "免费", heat: [0, 2] },
      { name: "掘金量化·策略研究平台", price: "免费额度", heat: [1] },
      { name: "《Python for Finance》", price: "¥128", heat: [2] },
    ],
    path: ["Python 基础", "数据获取", "技术指标", "回测框架", "策略实战", "风险控制"],
    daily: [
      { t: "Day1-3", title: "环境 & 数据", note: "用 akshare 拉取 A 股行情数据" },
      { t: "Day4-7", title: "技术指标", note: "用 pandas 实现 MA / RSI" },
      { t: "Day8-14", title: "回测框架", note: "跑通双均线策略回测" },
      { t: "Day15-21", title: "策略实战", note: "加入止损与仓位管理，输出复盘报告" },
    ],
  },
  "CFA": {
    tag: "考证提升", summary: "一级 10 门课，90 天三轮冲刺规划",
    resources: [
      { name: "B站·CFA 一级知识点串讲（免费）", price: "免费", heat: [0] },
      { name: "Kaplan Schweser Notes（一级）", price: "¥680", heat: [1] },
      { name: "CFA 官方 Mock 题库", price: "免费", heat: [2] },
    ],
    path: ["职业伦理", "数量方法", "经济学", "财务报表", "权益投资", "固定收益"],
    daily: [
      { t: "Day1-30", title: "第一轮过知识点", note: "跟 Notes 顺序推进，每天 2 小时" },
      { t: "Day31-60", title: "第二轮刷题", note: "原版书课后题 + 错题本" },
      { t: "Day61-90", title: "冲刺模考", note: "官方 Mock 3 套，按考试时间掐表" },
    ],
  },
};
function genGuide(skill) {
  const g = SKILL_GUIDES[skill];
  if (g) return Object.assign({ skill }, g);
  // 通用模板（未覆盖技能）
  return {
    skill, tag: "通用", summary: `围绕「${skill}」定制 21 天研习计划`,
    resources: [
      { name: `B站·${skill} 入门教程`, price: "免费", heat: [0] },
      { name: `小红书·${skill} 经验合集`, price: "免费", heat: [2] },
      { name: `雪球·${skill} 系统专栏`, price: "¥129", heat: [1] },
    ],
    path: ["基础认知", "核心概念", "模拟实操", "复盘迭代"],
    daily: [
      { t: "Day1-5", title: "打基础", note: `了解 ${skill} 的全貌与术语` },
      { t: "Day6-14", title: "刻意练", note: "每天 1 小时专项突破" },
      { t: "Day15-21", title: "做输出", note: "产出一页纸学习成果" },
    ],
  };
}

/* 社区瀑布流笔记（12 篇，含封面 emoji） */
const NOTES = [
  { id: "n1", type: "成果展示", topic: "量化交易", author: "我", avatar: "我", color: "#0f4c81", time: "2 小时前", cover: "📈", text: "用金融 Excel 换了 3 节量化，今天跑通了第一个回测！研习互换真香", likes: 32, comments: 8, liked: false, poi: "线上" },
  { id: "n2", type: "学习打卡", topic: "基金定投", author: "老周", avatar: "周", color: "#ca8a04", time: "昨天", cover: "💰", text: "连续打卡第 12 天，定投计划纪律执行完毕，第一次不看盘也不焦虑", likes: 45, comments: 6, liked: false, poi: "武汉" },
  { id: "n3", type: "问答互助", topic: "财报分析", author: "阿哲", avatar: "哲", color: "#ea580c", time: "5 小时前", cover: "📊", text: "新手读年报求推荐入门书，预算 100 内，主要看消费行业", likes: 18, comments: 21, liked: false, poi: "杭州" },
  { id: "n4", type: "经验分享", topic: "估值建模", author: "我", avatar: "我", color: "#0f4c81", time: "昨天", cover: "🧮", text: "我的带教节奏：先拆三表，再动手搭模型，留作业下次复盘", likes: 56, comments: 12, liked: false, poi: "深圳" },
  { id: "n5", type: "成果展示", topic: "CFA", author: "阿May", avatar: "M", color: "#7c3aed", time: "2 天前", cover: "🎓", text: "用财报分析换的 CFA 网课结课啦，一级 Mock 冲到 75%", likes: 40, comments: 9, liked: false, poi: "西安" },
  { id: "n6", type: "问答互助", topic: "技术分析", author: "Coco", avatar: "C", color: "#dc2626", time: "2 天前", cover: "📉", text: "总是追涨杀跌？试试「先写交易计划再下单」，每天 10 分钟复盘", likes: 29, comments: 15, liked: false, poi: "南京" },
  { id: "n7", type: "学习打卡", topic: "资产配置", author: "小陈", avatar: "陈", color: "#16a34a", time: "3 天前", cover: "🏦", text: "家庭资产配置表做出来了，四笔钱终于理清楚了", likes: 22, comments: 4, liked: false, poi: "北京" },
  { id: "n8", type: "经验分享", topic: "保险规划", author: "精算姐", avatar: "算", color: "#db2777", time: "4 天前", cover: "🛡️", text: "保险配置避坑：先保障后理财，先大人后小孩", likes: 38, comments: 7, liked: false, poi: "成都" },
  { id: "n9", type: "成果展示", topic: "期权", author: "Momo", avatar: "M", color: "#7c3aed", time: "5 天前", cover: "🧾", text: "和量化搭子互教，搭出了第一个期权定价模型", likes: 51, comments: 11, liked: false, poi: "深圳" },
  { id: "n10", type: "问答互助", topic: "可转债", author: "老周", avatar: "周", color: "#ca8a04", time: "6 天前", cover: "💳", text: "可转债打新从哪开始？求不踩坑的顺序", likes: 17, comments: 19, liked: false, poi: "武汉" },
  { id: "n11", type: "学习打卡", topic: "FRM", author: "Coco", avatar: "C", color: "#dc2626", time: "1 周前", cover: "📚", text: "第 30 天打卡，VaR 和压力测试终于搞懂了", likes: 60, comments: 13, liked: false, poi: "南京" },
  { id: "n12", type: "经验分享", topic: "Python 金融", author: "Coco", avatar: "C", color: "#dc2626", time: "1 周前", cover: "🤖", text: "量化回测三个被低估的指标，新手必学", likes: 44, comments: 10, liked: false, poi: "南京" },
];

/* 话题挑战赛 */
const CHALLENGES = [
  { id: "c1", tag: "#100天金融学习打卡", title: "100 天，养成一个硬技能", desc: "每天 1 小时，记录你的成长曲线", joined: 1280 },
  { id: "c2", tag: "#财报共读计划", title: "一起拆解上市公司年报", desc: "每周一家公司，输出一页纸报告", joined: 430 },
  { id: "c3", tag: "#小众金融技能发现", title: "发现冷门但好玩的技能", desc: "可转债 / 期权 / 量化，宝藏分享", joined: 256 },
  { id: "c4", tag: "#研习成果展", title: "晒出你换来的成果", desc: "用你懂的，换来了什么？", joined: 612 },
];

/* 成长宠物（金融版「招财兽」） */
const PET_STAGES = [
  { min: 0, name: "金蛋蛋", emoji: "🥚" },
  { min: 60, name: "小金鸡", emoji: "🐣" },
  { min: 150, name: "精算狐", emoji: "🦊" },
  { min: 300, name: "金牛龙", emoji: "🐲" },
  { min: 600, name: "富贵凰", emoji: "🦚" },
];
function petStage(exp) {
  let s = PET_STAGES[0];
  for (const st of PET_STAGES) if (exp >= st.min) s = st;
  return s;
}

/* AI 研习搭子语料 */
const AI_REPLIES = [
  { kw: ["攻略", "计划", "怎么学", "路径", "入门"], reply: "我可以帮你生成研习攻略～在「学习空间」输入想学的金融技能，一键生成资源清单 + 学习路径 + 每日计划。想先学哪个？" },
  { kw: ["资源", "课程", "书", "教程", "哪里学"], reply: "在攻略页的「热门资源」里，我按 B站 / 雪球 / 小红书 三个平台给你打了热度分，免费优先，按需加入清单即可 📚" },
  { kw: ["进度", "记账", "坚持", "放弃", "没动力"], reply: "学习像记账一样要看得见积累。每天打卡 +5 积分，连续打卡会触发招财兽升级，把坚持变成游戏 🎮" },
  { kw: ["搭子", "找人", "一起", "匹配", "互换"], reply: "去「消息」页的「找研习搭子」，按想学技能 / 城市 / MBTI 筛选，弹幕墙会飘过合适的伙伴，打个招呼约起来～" },
  { kw: ["宠物", "灵兽", "招财", "升级", "经验"], reply: "你的招财兽会随打卡、完成互换、发笔记升级。喂食 / 散步 / 玩耍都能 +经验，去宠物页撸它吧 🐾" },
  { kw: ["积分", "挑战赛", "奖励", "权益"], reply: "签到 +5、发笔记 +50、发起互换 +20、完成挑战赛 +20。积分可在创作者中心换专属徽章与曝光位 🏅" },
  { kw: ["荐股", "带单", "稳赚", "暴富", "内幕"], reply: "本社区只聊学习，不荐股、不带单、不承诺收益哦～投资有风险，咱们一起把知识学扎实再谈实战 📖" },
  { kw: ["你好", "在吗", "hi", "hello"], reply: "我是你的 AI 研习搭子 🤖 想规划学习、找搭子、还是撸招财兽？都听你的～" },
];
function aiReply(text) {
  const t = (text || "").toLowerCase();
  for (const r of AI_REPLIES) if (r.kw.some(k => t.includes(k.toLowerCase()))) return r.reply;
  return "这个问题我还在学 🤔 你可以试试在「学习空间」生成攻略，或去「消息」找研习搭子，我也在努力变聪明～";
}

/* 积分规则 */
const INTEGRAL_RULES = [
  { act: "每日签到", pts: 5 }, { act: "发布笔记", pts: 50 }, { act: "发布研习攻略", pts: 50 },
  { act: "邀请好友", pts: 40 }, { act: "参加挑战赛", pts: 20 }, { act: "完成互换打卡", pts: 20 },
];

/* 好友 / 消息列表 */
const FRIEND_MSGS = [
  { who: "K先生", avatar: "K", color: "#0891b2", last: "明晚 8 点量化课准时开，记得装好 Python 环境～", time: "10:24", unread: 2 },
  { who: "小陈", avatar: "陈", color: "#16a34a", last: "财报分析的模板我发你微信啦", time: "昨天", unread: 0 },
  { who: "阿哲", avatar: "哲", color: "#ea580c", last: "周末财报共读局还差 1 人，来不来？", time: "昨天", unread: 1 },
  { who: "Momo", avatar: "M", color: "#7c3aed", last: "你的 DCF 模型我超喜欢！", time: "周一", unread: 0 },
  { who: "Coco", avatar: "C", color: "#dc2626", last: "CFA 备考群组了个群，拉你", time: "周一", unread: 3 },
];

/* 找搭子筛选维度 */
const MATCH_OPTIONS = {
  skill: ["量化交易", "财报分析", "CFA", "基金定投", "估值建模", "Python 金融", "可转债", "资产配置"],
  city: ["上海", "杭州", "深圳", "北京", "广州", "成都", "武汉", "南京", "西安"],
  mbti: ["INTJ", "ENFP", "INFJ", "ESTP", "ISFJ", "ENTJ"],
  hobby: ["投资", "理财", "编程", "阅读", "健身", "旅行", "美食", "写作"],
};

/* 给 mock 用户补充社交属性（找搭子筛选 / 展示用，确定性派生） */
const _MBTI = ["INTJ", "ENFP", "INFJ", "ESTP", "ISFJ", "ENTJ"];
const _HOBBY = ["投资", "理财", "编程", "阅读", "健身", "旅行", "美食", "写作"];
const _STAR = ["白羊", "金牛", "双子", "巨蟹", "狮子", "处女", "天秤", "天蝎"];
USERS.forEach((u, i) => {
  u.mbti = _MBTI[i % _MBTI.length];
  u.hobby = _HOBBY[i % _HOBBY.length];
  u.star = _STAR[i % _STAR.length];
  u.gender = i % 2 === 0 ? "男" : "女";
  u.age = 22 + (i * 2) % 16;
});
