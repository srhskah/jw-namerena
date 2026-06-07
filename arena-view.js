(function () {
  "use strict";

  var PAD = 36;
  var PARTICLE_R = 14;
  var BOSS_R = 20;

  var KEYWORDS = [
    { re: /冰河时代|Ice Age/i, kind: "ice", color: "#77ddff" },
    { re: /能量释放|Energy/i, kind: "lightning", color: "#ffee33" },
    { re: /心灵控制|Mind Control|Control/i, kind: "charm", color: "#ff55ff" },
    { re: /推理|Thinking|真相只有一个|凶手就是你/i, kind: "charge", color: "#aaccff" },
    { re: /死亡笔记|Death Note/i, kind: "deathnote", color: "#444444" },
    { re: /火球术|火球|Fire Ball|火焰花|fire ball/i, kind: "fire", color: "#ff7722" },
    { re: /雷击术|雷击|Thunder|thunder/i, kind: "lightning", color: "#ffe033" },
    { re: /冰冻术|冰冻|Ice|freeze/i, kind: "ice", color: "#55ccff" },
    { re: /地裂术|地裂|Quake|earth/i, kind: "quake", color: "#c98a54" },
    { re: /治愈魔法|治愈|Heal|heal|回复|苏生术|苏生|Revive|revive|复活|满血复活/i, kind: "heal", color: "#33ee88" },
    { re: /加速术|加速|Haste|haste|疾走/i, kind: "haste", color: "#ffff55" },
    { re: /减速术|减速|Slow|slow|迟缓/i, kind: "slow", color: "#6666ff" },
    { re: /会心一击|会心|Critical/i, kind: "crit", color: "#ff2266" },
    { re: /狂暴攻击|Berserk Attack/i, kind: "berserk", color: "#ff3333" },
    { re: /狂暴术|Berserk/i, kind: "berserk", color: "#ff3333" },
    { re: /连击|Rapid|rapid/i, kind: "rapid", color: "#ffffff" },
    { re: /吸血|Absorb|Life Drain|Drain/i, kind: "absorb", color: "#cc2244" },
    { re: /背刺|Backstab|潜行|Sneak/i, kind: "melee", color: "#ff6699" },
    { re: /反击|Counter/i, kind: "counter", color: "#ffaa44" },
    { re: /生命之轮|Wheel of Lift|Exchanged|互换/i, kind: "exchange", color: "#dd88ff" },
    { re: /投毒|Poison|poison|毒性发作|中毒/i, kind: "poison", color: "#99ff33" },
    { re: /自爆|Explode|explode/i, kind: "explode", color: "#ff1100" },
    { re: /分裂|Split|Spawn|spawned/i, kind: "spawn", color: "#cc77ff" },
    { re: /瘟疫|Half|Plague|体力减少/i, kind: "plague", color: "#aa6644" },
    { re: /魅惑|Charm|charm/i, kind: "charm", color: "#ff66ff" },
    { re: /诅咒|Curse|curse/i, kind: "curse", color: "#9933ff" },
    { re: /铁壁|Iron|iron/i, kind: "shield", color: "#88bbdd" },
    { re: /防御|defend|Defend/i, kind: "shield", color: "#88bbdd" },
    { re: /聚气|Accumul|蓄力|Charge|charge/i, kind: "charge", color: "#ffcc00" },
    { re: /攻击力上升|属性上升|所有属性上升|Merged|merged/i, kind: "upgrade", color: "#ffaa55" },
    { re: /分身|Clone|clone|幻术|Shadow|shadow|召唤|Summon|summon|亡灵|Zombie|zombie|使魔|Minion|血祭|附体|Possess|丧尸/i, kind: "spawn", color: "#cc77ff" },
    { re: /净化|Disperse|dispel/i, kind: "dispel", color: "#aaeeff" },
    { re: /隐匿|Hide|hide/i, kind: "hide", color: "#888899" },
    { re: /吞噬|Merge|merge/i, kind: "merge", color: "#aa5533" },
    { re: /守护|Protect|protect/i, kind: "protect", color: "#66ffcc" },
    { re: /伤害反弹|Reflect|reflect/i, kind: "reflect", color: "#aaaaff" },
    { re: /护身符|Reraise|reraise/i, kind: "reraise", color: "#eedd88" },
    { re: /垂死|Upgrade|upgrade/i, kind: "upgrade", color: "#ff8844" },
    { re: /回避|dodge|Dodge/i, kind: "dodge", color: "#cccccc" },
    { re: /Steam|守望先锋|文明6|英雄联盟|微博|朋友圈|什么也没做/i, kind: "idle", color: "#888888" },
    { re: /懒癌|肺炎|新冠|感染|隔离|ICU|重症监护|自我隔离/i, kind: "plague", color: "#aa8866" },
    { re: /密室|尸体|奇数伤害|变异|信用卡|砍下/i, kind: "buff", color: "#ccccff" },
    { re: /蘑菇|奖命|Kick|Shoot|Strike/i, kind: "buff", color: "#ffcc66" },
    { re: /属性修改器|Modifier|购买|武器/i, kind: "buff", color: "#ccccff" },
    { re: /发起攻击|发起\[|casts|cast|uses|使用|发动|开始\[/i, kind: "melee", color: "#ff9966" },
    { re: /攻击|attack|Attack|Magic Attack/i, kind: "melee", color: "#ff9966" },
    { re: /受到.*伤害|damage|点伤害/i, kind: "hit", color: "#ff5555" },
    { re: /被击倒|knocked|die|Die|消失|vanished|minion|尸体|离开.*战场/i, kind: "death", color: "#888888" },
    { re: /获得胜利|\bwin\b/i, kind: "win", color: "#ffd700" }
  ];

  var STYLES = {
    fire:       { beam: true,  lineWidth: 4, dash: [],       speed: 9,  projR: 8,  shape: "circle",  trail: true },
    lightning:  { beam: true,  lineWidth: 5, dash: [2, 4],   speed: 0,  projR: 0,  shape: "bolt",    trail: false },
    ice:        { beam: true,  lineWidth: 3, dash: [8, 6],   speed: 7,  projR: 6,  shape: "diamond", trail: true },
    quake:      { beam: false, lineWidth: 6, dash: [12, 6],  speed: 0,  projR: 0,  shape: "wave",    trail: false },
    crit:       { beam: true,  lineWidth: 7, dash: [],       speed: 12, projR: 10, shape: "star",    trail: true },
    berserk:    { beam: true,  lineWidth: 5, dash: [4, 2],   speed: 10, projR: 7,  shape: "triangle", trail: true },
    rapid:      { beam: true,  lineWidth: 2, dash: [3, 5],   speed: 11, projR: 4,  shape: "circle",  trail: true },
    melee:      { beam: true,  lineWidth: 3, dash: [10, 4],  speed: 8,  projR: 5,  shape: "slash",   trail: false },
    heal:       { beam: false, lineWidth: 3, dash: [],       speed: 0,  projR: 0,  shape: "heal",    trail: false },
    poison:     { beam: true,  lineWidth: 2, dash: [2, 3],   speed: 6,  projR: 5,  shape: "circle",  trail: true },
    explode:    { beam: false, lineWidth: 8, dash: [],       speed: 0,  projR: 0,  shape: "wave",    trail: false },
    plague:     { beam: false, lineWidth: 5, dash: [6, 6],  speed: 0,  projR: 0,  shape: "wave",    trail: false },
    charm:      { beam: true,  lineWidth: 2, dash: [5, 5],   speed: 5,  projR: 5,  shape: "heart",   trail: false },
    curse:      { beam: true,  lineWidth: 3, dash: [1, 5],   speed: 6,  projR: 6,  shape: "diamond", trail: true },
    shield:     { beam: false, lineWidth: 4, dash: [],       speed: 0,  projR: 0,  shape: "ring",    trail: false },
    haste:      { beam: false, lineWidth: 2, dash: [4, 4],   speed: 0,  projR: 0,  shape: "ring",    trail: false },
    slow:       { beam: false, lineWidth: 2, dash: [8, 4],   speed: 0,  projR: 0,  shape: "ring",    trail: false },
    charge:     { beam: false, lineWidth: 3, dash: [],       speed: 0,  projR: 0,  shape: "ring",    trail: false },
    spawn:      { beam: false, lineWidth: 2, dash: [],       speed: 0,  projR: 0,  shape: "spawn",   trail: false },
    dispel:     { beam: true,  lineWidth: 2, dash: [6, 3],   speed: 7,  projR: 4,  shape: "circle",  trail: false },
    dodge:      { beam: false, lineWidth: 1, dash: [3, 3],   speed: 0,  projR: 0,  shape: "dash",    trail: false },
    upgrade:    { beam: false, lineWidth: 3, dash: [],       speed: 0,  projR: 0,  shape: "ring",    trail: false },
    reflect:    { beam: false, lineWidth: 3, dash: [4, 4],   speed: 0,  projR: 0,  shape: "ring",    trail: false },
    protect:    { beam: true,  lineWidth: 2, dash: [8, 4],   speed: 5,  projR: 4,  shape: "circle",  trail: false },
    deathnote:  { beam: true,  lineWidth: 4, dash: [1, 6],   speed: 7,  projR: 6,  shape: "cross",   trail: true },
    death:      { beam: false, lineWidth: 4, dash: [],       speed: 0,  projR: 0,  shape: "cross",   trail: false },
    absorb:     { beam: true,  lineWidth: 3, dash: [5, 3],   speed: 7,  projR: 6,  shape: "triangle", trail: true },
    exchange:   { beam: true,  lineWidth: 4, dash: [10, 6], speed: 6,  projR: 5,  shape: "diamond", trail: false },
    counter:    { beam: true,  lineWidth: 4, dash: [],       speed: 9,  projR: 6,  shape: "slash",   trail: false },
    hide:       { beam: false, lineWidth: 2, dash: [2, 6],   speed: 0,  projR: 0,  shape: "dash",    trail: false },
    merge:      { beam: true,  lineWidth: 5, dash: [],       speed: 8,  projR: 7,  shape: "circle",  trail: true },
    reraise:    { beam: false, lineWidth: 3, dash: [4, 4],   speed: 0,  projR: 0,  shape: "ring",    trail: false },
    buff:       { beam: false, lineWidth: 3, dash: [],       speed: 0,  projR: 0,  shape: "ring",    trail: false },
    idle:       { beam: false, lineWidth: 1, dash: [2, 8],   speed: 0,  projR: 0,  shape: "dash",    trail: false },
    hit:        { beam: false, lineWidth: 2, dash: [],       speed: 0,  projR: 0,  shape: "ring",    trail: false },
    win:        { beam: false, lineWidth: 4, dash: [],       speed: 0,  projR: 0,  shape: "burst",   trail: false },
    generic:    { beam: true,  lineWidth: 3, dash: [6, 4],   speed: 7,  projR: 5,  shape: "circle",  trail: true }
  };

  var TEAM_COLORS = ["#42a8d7", "#e85d5d", "#7bc96f", "#c9a0dc", "#f0ad4e", "#5bc0de"];
  var RANDOM_MOTION_KEY = "namerenaArenaRandomMotion";
  var TONE_KEY = "namerenaArenaTone";
  var PALETTE_KEY = "namerenaArenaPalette";
  var DIE_FADE_SEC = 2.5;

  var THEME_PALETTES = {
    dark: [
      { id: "ocean", label: "海洋", swatch: "#42a8d7" },
      { id: "blaze", label: "赤焰", swatch: "#ff4422" },
      { id: "volt", label: "电光", swatch: "#d4ff44" },
      { id: "jade", label: "翠玉", swatch: "#3de8a8" }
    ],
    light: [
      { id: "snow", label: "雪白", swatch: "#1565b8" },
      { id: "coral", label: "珊瑚", swatch: "#c43a20" },
      { id: "ink", label: "墨印", swatch: "#000000" },
      { id: "mint", label: "青柠", swatch: "#0a7a50" }
    ]
  };

  var DEFAULT_PALETTE = { dark: "ocean", light: "snow" };

  function clampNum(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function ArenaView(doc) {
    this.doc = doc;
    this.canvas = doc.getElementById("arenaCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.root = doc.getElementById("arenaViewRoot");
    this.logEl = null;
    this.logFollow = true;
    this.statsMode = "live";
    this._logScrollBound = false;
    this.randomMotion = localStorage.getItem(RANDOM_MOTION_KEY) !== "false";
    this.winner = null;
    this.battleEnded = false;
    this._fastForwardSent = false;
    this.crownPhase = 0;
    this.players = {};
    this.playerList = [];
    this.projectiles = [];
    this.effects = [];
    this.labels = [];
    this.running = false;
    this.lastTime = 0;
    this.w = 0;
    this.h = 0;
    this.dpr = 1;
    this._boundResize = this.resize.bind(this);
    this._boundFrame = this.frame.bind(this);
    this.canvasTheme = null;
    this.tone = "dark";
    this.palette = "ocean";
    this._floatReady = false;
  }

  ArenaView.prototype.attachDraggable = function (el, opts) {
    if (!el || el._arenaDrag) return;
    el._arenaDrag = true;
    opts = opts || {};
    var win = this.doc.defaultView;
    var threshold = opts.threshold || 5;
    var state = null;

    if (opts.x != null) el.style.left = opts.x + "px";
    if (opts.y != null) el.style.top = opts.y + "px";
    el.classList.add("arena-draggable");

    function readPos() {
      return {
        l: parseFloat(el.style.left) || 0,
        t: parseFloat(el.style.top) || 0
      };
    }

    function onDown(e) {
      if (opts.ignore && e.target.closest(opts.ignore)) return;
      if (e.target.closest(".arena-float-close")) return;
      if (opts.handle) {
        if (!e.target.closest(opts.handle)) return;
      } else if (!opts.dragAnywhere) {
        var tag = e.target.tagName;
        if (tag === "BUTTON" || tag === "INPUT" || tag === "SELECT" || tag === "LABEL") return;
      }
      var pos = readPos();
      state = {
        id: e.pointerId,
        sx: e.clientX,
        sy: e.clientY,
        ox: pos.l,
        oy: pos.t,
        moved: false
      };
      if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
      e.preventDefault();
    }

    function onMove(e) {
      if (!state || state.id !== e.pointerId) return;
      var dx = e.clientX - state.sx;
      var dy = e.clientY - state.sy;
      if (!state.moved && (Math.abs(dx) > threshold || Math.abs(dy) > threshold)) {
        state.moved = true;
        el.classList.add("arena-dragging");
      }
      if (state.moved) {
        el.style.left = clampNum(state.ox + dx, 0, win.innerWidth - el.offsetWidth) + "px";
        el.style.top = clampNum(state.oy + dy, 0, win.innerHeight - el.offsetHeight) + "px";
      }
    }

    function onUp(e) {
      if (!state || state.id !== e.pointerId) return;
      el._lastDragMoved = state.moved;
      el.classList.remove("arena-dragging");
      if (el.releasePointerCapture) el.releasePointerCapture(e.pointerId);
      state = null;
    }

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
  };

  ArenaView.prototype.start = function () {
    if (this.running) return;
    this.doc.body.classList.add("arena-mode");
    this.loadThemePrefs();
    this.applyTheme(this.tone, this.palette);
    this.logEl = this.doc.querySelector("#md5 .pbody");
    this.setupFloatingPanels();
    this.setupSidebar();
    this.setupArenaControls();
    this.setupThemePanel();
    this.setupLogScroll();
    this.resize();
    window.addEventListener("resize", this._boundResize);
    this.observe();
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this._boundFrame);
  };

  ArenaView.prototype.ensureSidebar = function () {
    var plist = this.doc.querySelector("#md5 .plist");
    var pbody = this.doc.querySelector("#md5 .pbody");
    this.setupFloatingPanels();
    if (this.root && !this.root.querySelector(".arena-controls")) {
      this.setupArenaControls();
    }
    if (this.root && !this.root.querySelector(".arena-theme-panel")) {
      this.setupThemePanel();
    }
    if (pbody && pbody !== this.logEl) {
      this.logEl = pbody;
      this.logFollow = true;
      this._logScrollBound = false;
      this.setupLogScroll();
    }
    if (plist && !plist.querySelector(".arena-plist-header")) {
      this.setupSidebar();
    } else if (pbody && !pbody.querySelector(".arena-log-header")) {
      var logHeader = this.doc.createElement("div");
      logHeader.className = "arena-log-header";
      logHeader.innerHTML =
        '<span class="arena-log-title">战场动向</span>' +
        '<span class="arena-log-hint">可上下滚动</span>';
      pbody.insertBefore(logHeader, pbody.firstChild);
    }
  };

  ArenaView.prototype.setupSidebar = function () {
    var plist = this.doc.querySelector("#md5 .plist");
    if (!plist || plist.querySelector(".arena-plist-header")) return;

    var header = this.doc.createElement("div");
    header.className = "arena-plist-header";
    header.innerHTML =
      '<span class="arena-plist-title">选手状态</span>' +
      '<div class="arena-stats-toggle">' +
      '<button type="button" data-mode="init">初始</button>' +
      '<button type="button" data-mode="live" class="active">实时</button>' +
      '</div>';
    plist.insertBefore(header, plist.firstChild);

    var logHeader = this.doc.createElement("div");
    logHeader.className = "arena-log-header";
    logHeader.innerHTML =
      '<span class="arena-log-title">战场动向</span>' +
      '<span class="arena-log-hint">可上下滚动</span>';
    if (this.logEl) {
      this.logEl.insertBefore(logHeader, this.logEl.firstChild);
    }

    var self = this;
    header.querySelectorAll(".arena-stats-toggle button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        self.setStatsMode(btn.getAttribute("data-mode"));
      });
    });
    this.setStatsMode(this.statsMode);
  };

  ArenaView.prototype.loadThemePrefs = function () {
    var tone = localStorage.getItem(TONE_KEY);
    var palette = localStorage.getItem(PALETTE_KEY);
    this.tone = tone === "light" ? "light" : "dark";
    if (!palette || !this.paletteValid(this.tone, palette)) {
      palette = DEFAULT_PALETTE[this.tone];
    }
    this.palette = palette;
  };

  ArenaView.prototype.paletteValid = function (tone, palette) {
    var list = THEME_PALETTES[tone] || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === palette) return true;
    }
    return false;
  };

  ArenaView.prototype.applyTheme = function (tone, palette) {
    tone = tone === "light" ? "light" : "dark";
    if (!this.paletteValid(tone, palette)) {
      palette = DEFAULT_PALETTE[tone];
    }
    this.tone = tone;
    this.palette = palette;
    var body = this.doc.body;
    body.classList.remove("arena-tone-dark", "arena-tone-light");
    var ids = THEME_PALETTES.dark.concat(THEME_PALETTES.light);
    for (var i = 0; i < ids.length; i++) {
      body.classList.remove("arena-palette-" + ids[i].id);
    }
    body.classList.add(tone === "light" ? "arena-tone-light" : "arena-tone-dark");
    body.classList.add("arena-palette-" + palette);
    try {
      localStorage.setItem(TONE_KEY, tone);
      localStorage.setItem(PALETTE_KEY, palette);
    } catch (e) { /* ignore */ }
    this.canvasTheme = null;
    this.syncThemePanel();
  };

  ArenaView.prototype.readCanvasTheme = function () {
    if (this.canvasTheme) return this.canvasTheme;
    var s = this.doc.defaultView.getComputedStyle(this.doc.body);
    this.canvasTheme = {
      grid: s.getPropertyValue("--arena-grid").trim() || "rgba(66,168,215,0.12)",
      frame: s.getPropertyValue("--arena-frame").trim() || "rgba(66,168,215,0.4)",
      labelBg: s.getPropertyValue("--arena-label-bg").trim() || "rgba(8,16,28,0.75)",
      labelText: s.getPropertyValue("--arena-label-text").trim() || "#f0f6ff",
      labelBoss: s.getPropertyValue("--arena-label-boss").trim() || "#ffe566",
      labelStroke: s.getPropertyValue("--arena-sidebar-border").trim() || "rgba(255,255,255,0.25)",
      hp1: s.getPropertyValue("--arena-hp-1").trim() || "#3dcc66",
      hp2: s.getPropertyValue("--arena-hp-2").trim() || "#7bc96f",
      hpTrack: s.getPropertyValue("--arena-snap-hpbar").trim() || "rgba(0,0,0,0.45)",
      hpLow: "#ff4444"
    };
    return this.canvasTheme;
  };

  ArenaView.prototype.setupFloatingPanels = function () {
    if (this._floatReady) return;
    var md5 = this.doc.getElementById("md5");
    var plist = md5 && md5.querySelector(".plist");
    var pbody = md5 && md5.querySelector(".pbody");
    if (!md5 || !plist || !pbody || !this.root) return;

    var self = this;
    var win = this.doc.defaultView;

    function wrapPanel(contentEl, type) {
      if (contentEl.closest(".arena-float-panel")) return contentEl.closest(".arena-float-panel");
      var panel = self.doc.createElement("div");
      panel.className = "arena-float-panel arena-float-" + type + " collapsed";
      panel.innerHTML =
        '<div class="arena-float-head">' +
        '<span class="arena-widget-drag" title="拖动">⠿</span>' +
        '<span class="arena-float-title"></span>' +
        '<button type="button" class="arena-float-close" aria-label="关闭">×</button>' +
        "</div>";
      contentEl.parentNode.insertBefore(panel, contentEl);
      panel.appendChild(contentEl);
      panel.querySelector(".arena-float-close").addEventListener("click", function () {
        self.setFloatPanelOpen(type, false);
      });
      self.attachDraggable(panel, { handle: ".arena-float-head" });
      return panel;
    }

    this._panelPlist = wrapPanel(plist, "plist");
    this._panelLog = wrapPanel(pbody, "log");

    function makeToggle(cls, label, type, x, y) {
      if (self.root.querySelector("." + cls)) return self.root.querySelector("." + cls);
      var btn = self.doc.createElement("button");
      btn.type = "button";
      btn.className = "arena-panel-toggle " + cls;
      btn.textContent = label;
      self.root.appendChild(btn);
      self.attachDraggable(btn, { x: x, y: y, dragAnywhere: true });
      btn.addEventListener("click", function () {
        if (btn._lastDragMoved) {
          btn._lastDragMoved = false;
          return;
        }
        self.toggleFloatPanel(type);
      });
      return btn;
    }

    this._togglePlist = makeToggle("arena-toggle-plist", "选手状态", "plist", 8, 72);
    this._toggleLog = makeToggle("arena-toggle-log", "战场动向", "log", 8, 112);
    this._floatReady = true;
  };

  ArenaView.prototype.getFloatPanel = function (type) {
    return type === "plist" ? this._panelPlist : this._panelLog;
  };

  ArenaView.prototype.getFloatToggle = function (type) {
    return type === "plist" ? this._togglePlist : this._toggleLog;
  };

  ArenaView.prototype.positionPanelNearToggle = function (panel, toggle) {
    if (!panel || !toggle) return;
    var win = this.doc.defaultView;
    var tr = toggle.getBoundingClientRect();
    var pw = panel.offsetWidth || 260;
    var left = clampNum(tr.left, 8, win.innerWidth - pw - 8);
    var top = tr.bottom + 6;
    if (top + 180 > win.innerHeight) top = Math.max(8, tr.top - 180);
    panel.style.left = left + "px";
    panel.style.top = top + "px";
  };

  ArenaView.prototype.setFloatPanelOpen = function (type, open) {
    var panel = this.getFloatPanel(type);
    var toggle = this.getFloatToggle(type);
    if (!panel || !toggle) return;
    if (open) {
      panel.classList.remove("collapsed");
      toggle.classList.add("active");
      this.positionPanelNearToggle(panel, toggle);
    } else {
      panel.classList.add("collapsed");
      toggle.classList.remove("active");
    }
  };

  ArenaView.prototype.toggleFloatPanel = function (type) {
    var panel = this.getFloatPanel(type);
    if (!panel) return;
    this.setFloatPanelOpen(type, panel.classList.contains("collapsed"));
  };

  ArenaView.prototype.setupThemePanel = function () {
    if (!this.root || this.root.querySelector(".arena-theme-panel")) return;
    var panel = this.doc.createElement("div");
    panel.className = "arena-theme-panel";
    panel.innerHTML =
      '<span class="arena-widget-drag" title="拖动">⠿</span>' +
      '<div class="arena-theme-body">' +
      '<div class="arena-theme-tones">' +
      '<button type="button" data-tone="dark">深色</button>' +
      '<button type="button" data-tone="light">淡色</button>' +
      "</div>" +
      '<div class="arena-theme-palettes"></div>' +
      "</div>";
    this.root.appendChild(panel);
    var win = this.doc.defaultView;
    panel.style.left = Math.max(8, win.innerWidth - 220) + "px";
    panel.style.top = "8px";
    this.attachDraggable(panel, { handle: ".arena-widget-drag" });
    var self = this;
    panel.querySelectorAll(".arena-theme-tones button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = btn.getAttribute("data-tone") === "light" ? "light" : "dark";
        var p = self.paletteValid(t, self.palette) ? self.palette : DEFAULT_PALETTE[t];
        self.applyTheme(t, p);
      });
    });
    this._themePanel = panel;
    this.renderPaletteButtons();
    this.syncThemePanel();
  };

  ArenaView.prototype.renderPaletteButtons = function () {
    var host = this._themePanel && this._themePanel.querySelector(".arena-theme-palettes");
    if (!host) return;
    host.innerHTML = "";
    var list = THEME_PALETTES[this.tone] || [];
    var self = this;
    for (var i = 0; i < list.length; i++) {
      (function (item) {
        var btn = self.doc.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-palette", item.id);
        btn.innerHTML =
          '<span class="arena-theme-swatch" style="background:' + item.swatch + '"></span>' +
          item.label;
        btn.addEventListener("click", function () {
          self.applyTheme(self.tone, item.id);
        });
        host.appendChild(btn);
      })(list[i]);
    }
  };

  ArenaView.prototype.syncThemePanel = function () {
    if (!this._themePanel) return;
    this._themePanel.querySelectorAll(".arena-theme-tones button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-tone") === this.tone);
    }.bind(this));
    this.renderPaletteButtons();
    this._themePanel.querySelectorAll(".arena-theme-palettes button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-palette") === this.palette);
    }.bind(this));
  };

  ArenaView.prototype.setupArenaControls = function () {
    if (!this.root || this.root.querySelector(".arena-controls")) return;
    var bar = this.doc.createElement("div");
    bar.className = "arena-controls";
    bar.innerHTML =
      '<span class="arena-widget-drag" title="拖动">⠿</span>' +
      '<label class="arena-ctrl-random">' +
      '<input type="checkbox" id="arenaRandomMotion"' + (this.randomMotion ? " checked" : "") + ">" +
      "随机运动</label>";
    this.root.appendChild(bar);
    var win = this.doc.defaultView;
    bar.style.left = "8px";
    bar.style.top = Math.max(8, win.innerHeight - 48) + "px";
    this.attachDraggable(bar, { handle: ".arena-widget-drag" });
    var cb = bar.querySelector("#arenaRandomMotion");
    var self = this;
    cb.addEventListener("change", function () {
      self.randomMotion = cb.checked;
      try {
        localStorage.setItem(RANDOM_MOTION_KEY, cb.checked ? "true" : "false");
      } catch (e) { /* ignore */ }
    });
  };

  ArenaView.prototype.resetArena = function () {
    this.winner = null;
    this.battleEnded = false;
    this._fastForwardSent = false;
    this.playerList = [];
    this.players = {};
    this.projectiles = [];
    this.effects = [];
    this.labels = [];
  };

  ArenaView.prototype.setStatsMode = function (mode) {
    this.statsMode = mode === "init" ? "init" : "live";
    var plist = this.doc.querySelector("#md5 .plist");
    if (plist) {
      plist.classList.toggle("arena-stats-init", this.statsMode === "init");
      plist.classList.toggle("arena-stats-live", this.statsMode === "live");
    }
    var header = this.doc.querySelector(".arena-plist-header");
    if (header) {
      header.querySelectorAll(".arena-stats-toggle button").forEach(function (btn) {
        btn.classList.toggle("active", btn.getAttribute("data-mode") === this.statsMode);
      }.bind(this));
    }
    for (var i = 0; i < this.playerList.length; i++) {
      this.updateSnapshot(this.playerList[i]);
    }
  };

  ArenaView.prototype.setupLogScroll = function () {
    var el = this.logEl || this.doc.querySelector("#md5 .pbody");
    if (!el) return;
    this.logEl = el;
    if (this._logScrollBound && el === this._logScrollEl) return;
    this._logScrollEl = el;
    this._logScrollBound = true;
    var self = this;
    el.addEventListener("scroll", function () {
      var gap = el.scrollHeight - el.scrollTop - el.clientHeight;
      self.logFollow = gap < 48;
    }, { passive: true });
  };

  ArenaView.prototype.scrollLog = function () {
    if (!this.logFollow) return;
    var el = this.logEl || this.doc.querySelector("#md5 .pbody");
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  ArenaView.prototype.hpToDisplay = function (px) {
    return Math.max(0, Math.round((px || 0) / 4));
  };

  ArenaView.prototype.updateSnapshot = function (p) {
    if (!p || !p.el) return;
    if (p.initialMaxHp == null) return;

    var snap = p.el.querySelector(".arena-snapshot");
    if (!snap) {
      snap = this.doc.createElement("div");
      snap.className = "arena-snapshot";
      p.el.appendChild(snap);
    }

    var hpPct = p.initialMaxHp > 0 ? Math.round(p.initialHp / p.initialMaxHp * 100) : 100;
    var hpText = "HP " + this.hpToDisplay(p.initialHp) + " / " + this.hpToDisplay(p.initialMaxHp);
    var detail = p.initialDetail || "（无详细参数）";

    snap.innerHTML =
      '<div class="arena-snap-hpbar">' +
      '<div class="arena-snap-hpfill" style="width:' + hpPct + '%"></div></div>' +
      '<div class="arena-snap-hptext">' + hpText + '</div>' +
      '<div class="arena-snap-detail">' + detail + '</div>';
  };

  ArenaView.prototype.captureInitialStats = function (p, el) {
    if (p.initialCaptured) return;
    if (p.maxHp <= 0) return;
    p.initialCaptured = true;
    p.initialHp = p.hp;
    p.initialMaxHp = p.maxHp;
    p.initialDetail = p.detail || (el.querySelector(".detail") || {}).textContent || "";
    if (p.initialDetail) p.initialDetail = p.initialDetail.replace(/\s+/g, " ").trim();
    this.updateSnapshot(p);
  };

  ArenaView.prototype.stop = function () {
    this.running = false;
    window.removeEventListener("resize", this._boundResize);
    this.doc.body.classList.remove("arena-mode");
    var ids = THEME_PALETTES.dark.concat(THEME_PALETTES.light);
    this.doc.body.classList.remove("arena-tone-dark", "arena-tone-light");
    for (var i = 0; i < ids.length; i++) {
      this.doc.body.classList.remove("arena-palette-" + ids[i].id);
    }
  };

  ArenaView.prototype.resize = function () {
    var rect = (this.root || this.canvas.parentElement).getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(200, rect.width);
    this.h = Math.max(200, rect.height);
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.battleEnded && this.winner) {
      var wc = this.clamp(this.w / 2, this.h / 2, this.winner.r + 4);
      this.winner.x = wc.x;
      this.winner.y = wc.y;
    } else {
      this.layoutPlayers(false);
    }
  };

  ArenaView.prototype.clamp = function (x, y, r) {
    return {
      x: Math.max(PAD + r, Math.min(this.w - PAD - r, x)),
      y: Math.max(PAD + r, Math.min(this.h - PAD - r, y))
    };
  };

  ArenaView.prototype.layoutPlayers = function (force) {
    var alive = this.playerList.filter(function (p) { return p.alive; });
    var n = alive.length;
    if (!n) return;
    var cx = this.w / 2;
    var cy = this.h / 2;
    var rx = Math.max(60, (this.w - PAD * 2) / 2 - 20);
    var ry = Math.max(60, (this.h - PAD * 2) / 2 - 20);
    for (var i = 0; i < n; i++) {
      var p = alive[i];
      if (!force && p.placed) continue;
      var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      p.x = cx + Math.cos(angle) * rx * (0.65 + (i % 3) * 0.08);
      p.y = cy + Math.sin(angle) * ry * (0.65 + (i % 2) * 0.1);
      var c = this.clamp(p.x, p.y, p.r);
      p.x = c.x;
      p.y = c.y;
      p.placed = true;
    }
  };

  ArenaView.prototype.colorForTeam = function (team) {
    return TEAM_COLORS[Math.abs(team | 0) % TEAM_COLORS.length];
  };

  ArenaView.prototype.registerPlayer = function (el) {
    if (this.battleEnded) return;
    var nameEl = el.querySelector(".name");
    if (!nameEl) return;
    var name = nameEl.textContent.replace(/\s+/g, " ").trim();
    if (!name) return;
    var pidClass = "";
    var body = el.querySelector(".plr_body");
    if (body && body.className) {
      var m = body.className.match(/pid\d+/);
      if (m) pidClass = m[0];
    }
    var key = pidClass || name;
    if (this.players[key]) {
      this.syncHp(this.players[key], el);
      return;
    }
    var detailEl = el.querySelector(".detail");
    var isBoss = detailEl != null;
    var team = 0;
    var parent = el.parentElement;
    while (parent) {
      if (parent.classList && parent.classList.contains("plrg_list")) {
        team = Array.prototype.indexOf.call(parent.parentElement.children, parent);
        break;
      }
      parent = parent.parentElement;
    }
    var p = {
      key: key,
      name: name,
      el: el,
      detail: detailEl ? detailEl.textContent.replace(/\s+/g, " ").trim() : "",
      x: this.w / 2,
      y: this.h / 2,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: isBoss ? BOSS_R : PARTICLE_R,
      hp: 1,
      maxHp: 1,
      alive: true,
      placed: false,
      team: team,
      color: this.colorForTeam(team),
      aura: null,
      dying: false,
      dieTimer: 0,
      flash: 0,
      isBoss: isBoss,
      isWinner: false
    };
    this.players[key] = p;
    this.playerList.push(p);
    this.syncHp(p, el);
    this.captureInitialStats(p, el);
    this.layoutPlayers(true);
  };

  ArenaView.prototype.syncHp = function (p, el) {
    if (!p || !el) return;
    var maxEl = el.querySelector(".maxhp");
    var hpNodes = el.querySelectorAll(".hp");
    var hpEl = hpNodes.length ? hpNodes[hpNodes.length - 1] : el.querySelector(".hp");
    if (maxEl) {
      var mw = parseFloat(maxEl.style.width) || 0;
      if (mw > 0) p.maxHp = mw;
    }
    if (hpEl) {
      var hw = parseFloat(hpEl.style.width) || 0;
      if (hw >= 0) p.hp = hw;
    }
    var detailEl = el.querySelector(".detail");
    if (detailEl) p.detail = detailEl.textContent.replace(/\s+/g, " ").trim();
    this.captureInitialStats(p, el);
    if (this.isDomDead(el)) {
      this.killPlayer(p, false);
    }
  };

  ArenaView.prototype.isDomDead = function (el) {
    if (!el) return false;
    if (el.querySelector(".name.namedie")) return true;
    var op = parseFloat(el.style.opacity);
    if (!isNaN(op) && op > 0 && op < 0.99) return true;
    var hpNodes = el.querySelectorAll(".hp");
    if (!hpNodes.length) return false;
    var hpStyle = hpNodes[hpNodes.length - 1].style.width;
    if (!hpStyle) return false;
    if (parseFloat(hpStyle) <= 0) return true;
    return false;
  };

  ArenaView.prototype.resolvePlayerFromNode = function (node) {
    if (!node) return null;
    var body = node.closest ? node.closest(".plr_body") : null;
    if (body) {
      var m = (body.className || "").match(/pid\d+/);
      if (m && this.players[m[0]]) return this.players[m[0]];
    }
    var list = node.closest ? node.closest(".plr_list") : null;
    if (list) {
      var body2 = list.querySelector(".plr_body");
      if (body2) {
        var m2 = (body2.className || "").match(/pid\d+/);
        if (m2 && this.players[m2[0]]) return this.players[m2[0]];
      }
      var nm = list.querySelector(".name");
      if (nm) return this.findPlayerByName(nm.textContent);
    }
    return this.findPlayerByName(node.textContent || "");
  };

  ArenaView.prototype.scanDeadPlayers = function () {
    if (this.battleEnded) return;
    for (var i = 0; i < this.playerList.length; i++) {
      var p = this.playerList[i];
      if (!p.alive || p.dying || p.isWinner || !p.el) continue;
      if (this.isDomDead(p.el)) this.killPlayer(p, false);
    }
  };

  ArenaView.prototype.findPlayerByName = function (text) {
    if (!text) return null;
    var t = text.replace(/\s+/g, " ").trim();
    var best = null;
    var bestLen = 0;
    for (var i = 0; i < this.playerList.length; i++) {
      var p = this.playerList[i];
      if (!p.alive && !p.dying) continue;
      if (t.indexOf(p.name) >= 0 && p.name.length > bestLen) {
        best = p;
        bestLen = p.name.length;
      }
    }
    return best;
  };

  ArenaView.prototype.findPlayersFromNode = function (node) {
    var found = [];
    var used = {};
    if (node && node.querySelectorAll) {
      var bodies = node.querySelectorAll(".plr_body");
      for (var i = 0; i < bodies.length; i++) {
        var cls = bodies[i].className || "";
        var m = cls.match(/pid\d+/);
        if (m && this.players[m[0]] && !used[m[0]]) {
          found.push(this.players[m[0]]);
          used[m[0]] = true;
        }
      }
      if (!found.length) {
        var names = node.querySelectorAll(".name");
        for (var j = 0; j < names.length; j++) {
          var p = this.findPlayerByName(names[j].textContent);
          if (p && !used[p.key]) {
            found.push(p);
            used[p.key] = true;
          }
        }
      }
    }
    if (found.length) return found;
    return this.findPlayersInText((node && node.textContent) || "");
  };

  ArenaView.prototype.parseActionFromNode = function (node, text) {
    var skillEl = node.querySelector(".sctext");
    if (skillEl) {
      var fromSkill = this.parseAction(skillEl.textContent || "");
      if (fromSkill) return fromSkill;
      return { kind: "generic", color: "#66aaff" };
    }
    var buffEl = node.querySelector(".stext");
    if (buffEl) {
      var fromBuff = this.parseAction(buffEl.textContent || "");
      if (fromBuff) return fromBuff;
      return { kind: "buff", color: "#ccccff" };
    }
    return this.parseAction(text);
  };

  ArenaView.prototype.findPlayersInText = function (text) {
    var found = [];
    var sorted = this.playerList.slice().sort(function (a, b) {
      return b.name.length - a.name.length;
    });
    var used = {};
    for (var i = 0; i < sorted.length; i++) {
      var p = sorted[i];
      if ((!p.alive && !p.dying) || used[p.key]) continue;
      if (text.indexOf(p.name) >= 0) {
        found.push(p);
        used[p.key] = true;
      }
    }
    return found;
  };

  ArenaView.prototype.killPlayer = function (p, showLabel) {
    if (!p || p.dying || p.isWinner) return;
    p.dying = true;
    p.dieTimer = DIE_FADE_SEC;
    p.fadeDuration = DIE_FADE_SEC;
    p.alive = false;
    p.aura = null;
    p.vx = 0;
    p.vy = 0;
    if (showLabel !== false) {
      this.labels.push({
        text: "阵亡",
        x: p.x,
        y: p.y - p.r - 18,
        life: 2.2,
        color: "#ff4466",
        size: 15
      });
    }
    this.effects.push({
      kind: "death",
      x: p.x,
      y: p.y,
      r: p.r,
      life: 1.2,
      maxLife: 1.2,
      color: "#ff2244",
      lineWidth: 4
    });
  };

  ArenaView.prototype.declareWinner = function (p) {
    if (!p) return;
    this.winner = p;
    p.isWinner = true;
    p.dying = false;
    p.alive = true;
    p.aura = { kind: "win", color: "#ffd700", life: 9999 };
    this.effects.push({
      kind: "burst", x: p.x, y: p.y, r: p.r,
      maxR: Math.min(this.w, this.h) * 0.35,
      life: 1.0, maxLife: 1.0, color: "#ffd700", lineWidth: 5
    });
    this.labels.push({
      text: "胜利！",
      x: p.x,
      y: p.y - p.r - 36,
      life: 4.5,
      color: "#ffd700",
      size: 18
    });
  };

  ArenaView.prototype.requestFastForward = function () {
    if (this._fastForwardSent) return;
    this._fastForwardSent = true;
    var tryClick = function () {
      try {
        var w = window.parent;
        if (!w || w === window) return;
        var btn = w.document.getElementById("fastBtn");
        if (btn) btn.click();
      } catch (e) { /* cross-origin or unavailable */ }
    };
    tryClick();
    setTimeout(tryClick, 80);
    setTimeout(tryClick, 320);
  };

  ArenaView.prototype.endBattle = function (winner) {
    if (this.battleEnded || !winner) return;
    this.battleEnded = true;
    this.declareWinner(winner);
    this.randomMotion = false;
    var cb = this.doc.getElementById("arenaRandomMotion");
    if (cb) cb.checked = false;
    this.projectiles = [];
    winner.vx = 0;
    winner.vy = 0;
    var cx = this.w / 2;
    var cy = this.h / 2;
    var c = this.clamp(cx, cy, winner.r + 4);
    winner.x = c.x;
    winner.y = c.y;
    winner.r = Math.max(winner.r, winner.isBoss ? BOSS_R + 6 : PARTICLE_R + 6);
    for (var i = this.playerList.length - 1; i >= 0; i--) {
      var p = this.playerList[i];
      if (p === winner) continue;
      if (p.alive || p.dying) {
        p.dying = true;
        p.alive = false;
        p.aura = null;
        p.dieTimer = 0.8;
        p.fadeDuration = 0.8;
        p.vx = 0;
        p.vy = 0;
      }
    }
    this.labels.push({
      text: "比赛结束",
      x: cx,
      y: PAD + 8,
      life: 5,
      color: "#ffd700",
      size: 16
    });
    this.requestFastForward();
  };

  ArenaView.prototype.findWinnerInText = function (text, actors, node) {
    if (node && node.querySelectorAll) {
      var bodies = node.querySelectorAll(".plr_body");
      for (var i = 0; i < bodies.length; i++) {
        var m = (bodies[i].className || "").match(/pid\d+/);
        if (m && this.players[m[0]]) return this.players[m[0]];
      }
      var names = node.querySelectorAll(".name");
      for (var j = 0; j < names.length; j++) {
        var byName = this.resolvePlayerFromNode(names[j]);
        if (byName) return byName;
      }
    }
    if (actors && actors.length) return actors[0];
    var sorted = this.playerList.slice().sort(function (a, b) {
      return b.name.length - a.name.length;
    });
    for (var k = 0; k < sorted.length; k++) {
      var p = sorted[k];
      if (text.indexOf(p.name) >= 0) return p;
    }
    return null;
  };

  ArenaView.prototype.scanForWinner = function () {
    if (this.battleEnded) return;
    var pbody = this.doc.querySelector("#md5 .pbody");
    if (!pbody) return;
    var us = pbody.querySelectorAll("u");
    for (var i = us.length - 1; i >= 0; i--) {
      var row = us[i];
      var txt = row.textContent || "";
      if (!/获得胜利|\bwin\b/i.test(txt)) continue;
      var winP = this.findWinnerInText(txt, this.findPlayersFromNode(row), row);
      if (winP) {
        this.endBattle(winP);
        return;
      }
    }
  };

  ArenaView.prototype.parseAction = function (text) {
    for (var i = 0; i < KEYWORDS.length; i++) {
      if (KEYWORDS[i].re.test(text)) return KEYWORDS[i];
    }
    return null;
  };

  ArenaView.prototype.getStyle = function (kind) {
    return STYLES[kind] || STYLES.generic;
  };

  ArenaView.prototype.spawnBeam = function (from, to, color, style) {
    if (!from || !to || !style.beam) return;
    this.effects.push({
      kind: "beam",
      x1: from.x, y1: from.y,
      x2: to.x, y2: to.y,
      color: color,
      lineWidth: style.lineWidth,
      dash: style.dash,
      shape: style.shape,
      life: 0.35,
      maxLife: 0.35
    });
  };

  ArenaView.prototype.spawnProjectile = function (from, to, color, style) {
    if (!style.speed) return;
    var dx = to.x - from.x;
    var dy = to.y - from.y;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    this.projectiles.push({
      x: from.x,
      y: from.y,
      vx: (dx / len) * style.speed,
      vy: (dy / len) * style.speed,
      target: to,
      color: color || "#ffffff",
      r: style.projR || 5,
      shape: style.shape,
      trail: style.trail,
      life: 2.0
    });
  };

  ArenaView.prototype.applyActionVisual = function (action, caster, target) {
    var style = this.getStyle(action.kind);
    var color = action.color;

    if (target && target !== caster) {
      this.spawnBeam(caster, target, color, style);
      this.spawnProjectile(caster, target, color, style);
      caster.vx += (target.x - caster.x) * 0.025;
      caster.vy += (target.y - caster.y) * 0.025;
    } else if (target === caster || !target) {
      this.effects.push({
        kind: "ring", x: caster.x, y: caster.y, r: caster.r, maxR: caster.r * 2.4,
        life: 0.45, maxLife: 0.45, color: color, lineWidth: style.lineWidth || 2
      });
    }

    switch (action.kind) {
      case "lightning":
        if (target) {
          this.effects.push({
            kind: "bolt", x: target.x, y: PAD, tx: target.x, ty: target.y,
            color: color, lineWidth: 5, life: 0.5, maxLife: 0.5
          });
          target.flash = 0.55;
        }
        break;
      case "ice":
      case "poison":
      case "charm":
      case "curse":
      case "slow":
        if (target) {
          target.aura = { kind: action.kind, color: color, life: 2.5 };
          this.effects.push({
            kind: "ring", x: target.x, y: target.y, r: target.r, maxR: target.r * 3.5,
            life: 0.7, maxLife: 0.7, color: color, lineWidth: style.lineWidth, dash: style.dash
          });
        }
        break;
      case "quake":
      case "explode":
      case "plague":
        this.effects.push({
          kind: "wave", x: caster.x, y: caster.y, r: 10,
          maxR: Math.min(this.w, this.h) * 0.38,
          life: 0.9, maxLife: 0.9, color: color, lineWidth: style.lineWidth, dash: style.dash
        });
        if (action.kind === "explode") this.killPlayer(caster, true);
        break;
      case "heal":
        this.effects.push({
          kind: "healwave", x: caster.x, y: caster.y, r: caster.r, maxR: caster.r * 4,
          life: 0.8, maxLife: 0.8, color: color, lineWidth: 3
        });
        if (target) target.aura = { kind: "heal", color: color, life: 1.2 };
        break;
      case "shield":
        caster.aura = { kind: "shield", color: color, life: 2.0 };
        this.effects.push({
          kind: "shield", x: caster.x, y: caster.y, r: caster.r,
          life: 0.9, maxLife: 0.9, color: color, lineWidth: style.lineWidth
        });
        this.labels.push({
          text: "防御", x: caster.x, y: caster.y - caster.r - 22,
          life: 1.0, color: "#88ccff", size: 13
        });
        break;
      case "reflect":
      case "protect":
        caster.aura = { kind: "shield", color: color, life: 2.0 };
        this.effects.push({
          kind: "ring", x: caster.x, y: caster.y, r: caster.r, maxR: caster.r * 2.8,
          life: 0.55, maxLife: 0.55, color: color, lineWidth: style.lineWidth
        });
        break;
      case "haste":
      case "charge":
      case "upgrade":
        caster.aura = { kind: action.kind, color: color, life: 2.0 };
        this.effects.push({
          kind: "ring", x: caster.x, y: caster.y, r: caster.r, maxR: caster.r * 2.2,
          life: 0.45, maxLife: 0.45, color: color, lineWidth: 2, dash: [4, 4]
        });
        break;
      case "spawn":
        this.effects.push({
          kind: "spawn", x: caster.x + 24, y: caster.y - 12,
          life: 0.9, maxLife: 0.9, color: color, lineWidth: 3
        });
        break;
      case "dodge":
        caster.vx += (Math.random() - 0.5) * 8;
        caster.vy += (Math.random() - 0.5) * 8;
        this.effects.push({
          kind: "dash", x: caster.x, y: caster.y, r: caster.r,
          life: 0.4, maxLife: 0.4, color: "#aaaacc", lineWidth: 2
        });
        this.labels.push({ text: "回避", x: caster.x, y: caster.y - caster.r - 20, life: 0.9, color: "#ddd", size: 13 });
        break;
      case "dispel":
        if (target) target.aura = null;
        break;
      case "crit":
      case "berserk":
      case "win":
        this.effects.push({
          kind: "burst", x: caster.x, y: caster.y, r: caster.r,
          maxR: caster.r * (action.kind === "win" ? 6 : 5), life: 0.55, maxLife: 0.55,
          color: color, lineWidth: style.lineWidth
        });
        break;
      case "hide":
        caster.aura = { kind: "hide", color: color, life: 1.8 };
        this.effects.push({
          kind: "dash", x: caster.x, y: caster.y, r: caster.r + 10,
          life: 0.6, maxLife: 0.6, color: color, lineWidth: 2
        });
        break;
      case "merge":
      case "absorb":
        if (target && target !== caster) {
          target.aura = { kind: action.kind, color: color, life: 1.2 };
        }
        break;
      case "exchange":
        if (target && target !== caster) {
          this.effects.push({
            kind: "beam", x1: target.x, y1: target.y, x2: caster.x, y2: caster.y,
            color: color, lineWidth: 3, dash: [8, 6], shape: "diamond",
            life: 0.45, maxLife: 0.45
          });
          this.effects.push({
            kind: "ring", x: (caster.x + target.x) / 2, y: (caster.y + target.y) / 2,
            r: 8, maxR: 40, life: 0.5, maxLife: 0.5, color: color, lineWidth: 3
          });
        }
        break;
      case "counter":
        if (target) target.flash = 0.35;
        break;
      case "buff":
      case "reraise":
      case "idle":
        caster.aura = { kind: action.kind, color: color, life: 2.0 };
        this.effects.push({
          kind: "ring", x: caster.x, y: caster.y, r: caster.r, maxR: caster.r * 2.5,
          life: 0.5, maxLife: 0.5, color: color, lineWidth: style.lineWidth, dash: style.dash
        });
        break;
      case "hit":
        if (target) {
          target.flash = 0.35;
          this.effects.push({
            kind: "ring", x: target.x, y: target.y, r: target.r, maxR: target.r * 2.2,
            life: 0.35, maxLife: 0.35, color: color, lineWidth: 3
          });
        }
        break;
      case "fire":
      case "rapid":
      case "melee":
        if (target && target !== caster) {
          this.labels.push({
            text: "攻击", x: caster.x, y: caster.y - caster.r - 22,
            life: 0.85, color: "#ffaa77", size: 13
          });
        } else {
          caster.vx += (Math.random() - 0.5) * 3;
          caster.vy += (Math.random() - 0.5) * 3;
          this.labels.push({
            text: "攻击", x: caster.x, y: caster.y - caster.r - 22,
            life: 0.85, color: "#ffaa77", size: 13
          });
        }
        break;
      case "deathnote":
        break;
      default:
        if (!target || target === caster) {
          this.effects.push({
            kind: "ring", x: caster.x, y: caster.y, r: caster.r, maxR: caster.r * 2.2,
            life: 0.4, maxLife: 0.4, color: color, lineWidth: style.lineWidth || 2
          });
        }
        break;
    }
  };

  ArenaView.prototype.applyFallbackVisual = function (text, node, caster, target, actors) {
    var skillEl = node.querySelector(".sctext");
    var color = "#66aaff";
    var style = STYLES.generic;

    if (!caster && actors.length) caster = actors[0];
    if (!target) target = actors.length > 1 ? actors[1] : actors[0];
    if (!caster) return;

    if (target && target !== caster) {
      this.spawnBeam(caster, target, color, style);
      this.spawnProjectile(caster, target, color, style);
    } else {
      this.effects.push({
        kind: "ring", x: caster.x, y: caster.y, r: caster.r, maxR: caster.r * 2.8,
        life: 0.55, maxLife: 0.55, color: color, lineWidth: 3, dash: [5, 4]
      });
    }

    if (skillEl) {
      var label = skillEl.textContent.replace(/[\[\]]/g, "").trim();
      if (label) {
        this.labels.push({
          text: label,
          x: caster.x,
          y: caster.y - caster.r - 24,
          life: 1.1,
          color: "#99ccff",
          size: 11
        });
      }
    } else if (text.length < 40) {
      this.labels.push({
        text: "·",
        x: caster.x,
        y: caster.y - caster.r - 20,
        life: 0.6,
        color: "#888",
        size: 14
      });
    }
  };

  ArenaView.prototype.handleRow = function (node) {
    var text = node.textContent || "";
    if (!text.trim()) return;
    if (this.battleEnded) return;

    if (/获得胜利/.test(text) || /\bwin\b/i.test(text)) {
      var earlyActors = this.findPlayersFromNode(node);
      var earlyWin = this.findWinnerInText(text, earlyActors, node);
      if (earlyWin) {
        this.endBattle(earlyWin);
        return;
      }
    }

    var self = this;
    setTimeout(function () { self.scrollLog(); }, 30);

    var dmgEl = node.querySelector(".damage");
    var recEl = node.querySelector(".recover");
    var namedie = node.querySelector(".namedie");

    var actors = this.findPlayersFromNode(node);
    var caster = actors[0] || null;
    var target = actors.length > 1 ? actors[1] : (actors[0] || null);

    if (namedie) {
      var dead = this.resolvePlayerFromNode(namedie);
      if (dead) this.killPlayer(dead, true);
    }

    if (dmgEl && target) {
      var dmg = parseInt(dmgEl.textContent, 10) || 0;
      target.flash = 0.45;
      this.effects.push({
        kind: "hit", x: target.x, y: target.y - target.r - 8,
        life: 0.5, maxLife: 0.5, color: "#ff5555", text: "-" + dmg, lineWidth: 3
      });
      if (caster && caster !== target) {
        this.spawnBeam(caster, target, "#ff6666", { beam: true, lineWidth: 2, dash: [4, 4], shape: "slash" });
      }
    }

    if (recEl && target) {
      var healAmt = parseInt(recEl.textContent, 10) || 0;
      this.effects.push({
        kind: "heal", x: target.x, y: target.y - target.r - 8,
        life: 0.7, maxLife: 0.7, color: "#44ff99", text: "+" + healAmt, lineWidth: 2
      });
    }

    var action = this.parseActionFromNode(node, text);

    if (action && action.kind === "death") {
      if (target) this.killPlayer(target, true);
      else if (caster) this.killPlayer(caster, true);
      return;
    }

    if (action && action.kind === "win") {
      var winP = this.findWinnerInText(text, actors, node);
      if (winP) this.endBattle(winP);
      return;
    }

    if (action) {
      if (!caster && actors.length) caster = actors[0];
      if (!target && actors.length > 1) target = actors[1];
      if (caster) {
        this.applyActionVisual(action, caster, target || caster);
      } else {
        this.applyFallbackVisual(text, node, caster, target, actors);
      }
    } else {
      this.applyFallbackVisual(text, node, caster, target, actors);
    }
  };

  ArenaView.prototype.observe = function () {
    var self = this;
    var md5 = this.doc.getElementById("md5");
    if (!md5) return;

    var scanPlayers = function (root) {
      var lists = root.querySelectorAll(".plr_list");
      for (var i = 0; i < lists.length; i++) self.registerPlayer(lists[i]);
    };

    scanPlayers(md5);
    this.ensureSidebar();

    this._plistObs = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        for (var i = 0; i < m.addedNodes.length; i++) {
          var n = m.addedNodes[i];
          if (n.nodeType !== 1) continue;
          if (n.classList && n.classList.contains("plr_list")) self.registerPlayer(n);
          else scanPlayers(n);
        }
      });
      self.ensureSidebar();
    });
    var plistHost = md5.querySelector(".plist") || md5;
    this._plistObs.observe(plistHost, { childList: true, subtree: true });

    this._bodyObs = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        for (var i = 0; i < m.addedNodes.length; i++) {
          var n = m.addedNodes[i];
          if (n.nodeType !== 1) continue;
          if (n.classList && n.classList.contains("pbody")) self.ensureSidebar();
          if (n.classList && (n.classList.contains("welcome") || n.classList.contains("welcome2"))) {
            self.resetArena();
          }
          if (n.tagName === "U") self.handleRow(n);
          else {
            var us = n.querySelectorAll ? n.querySelectorAll("u") : [];
            for (var j = 0; j < us.length; j++) self.handleRow(us[j]);
          }
        }
        if (m.type === "attributes" && m.target.classList && m.target.classList.contains("name")) {
          if (m.target.classList.contains("namedie")) {
            var p = self.resolvePlayerFromNode(m.target);
            if (p) self.killPlayer(p, true);
          }
        }
        if (m.type === "attributes" && m.target.classList &&
            (m.target.classList.contains("hp") || m.target.classList.contains("oldhp") ||
             m.target.classList.contains("plr_list"))) {
          var pl2 = m.target.closest(".plr_list");
          if (pl2) {
            var nm2 = pl2.querySelector(".name");
            if (nm2) {
              var p2 = self.findPlayerByName(nm2.textContent);
              if (p2) self.syncHp(p2, pl2);
            }
          }
        }
      });
    });
    var pbody = md5.querySelector(".pbody") || md5;
    this._bodyObs.observe(pbody, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

    this._hpObs = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        var pl = null;
        if (m.target.closest) pl = m.target.closest(".plr_list");
        if (!pl && m.type === "childList") {
          for (var i = 0; i < m.addedNodes.length; i++) {
            var n = m.addedNodes[i];
            if (n.nodeType !== 1) continue;
            if (n.classList && n.classList.contains("plr_list")) pl = n;
            else if (n.closest) pl = n.closest(".plr_list");
            if (pl) break;
          }
        }
        if (!pl) return;
        var nm = pl.querySelector(".name");
        if (!nm) return;
        var p = self.findPlayerByName(nm.textContent);
        if (p) self.syncHp(p, pl);
      });
    });
    this._hpObs.observe(plistHost, {
      attributes: true,
      subtree: true,
      childList: true,
      attributeFilter: ["style", "class"]
    });
  };

  ArenaView.prototype.updatePhysics = function (dt) {
    this.crownPhase += dt * 3;
    this._deathScanAcc = (this._deathScanAcc || 0) + dt;
    if (this._deathScanAcc >= 0.25) {
      this._deathScanAcc = 0;
      this.scanDeadPlayers();
      this.scanForWinner();
    }
    var alive = this.playerList.filter(function (p) { return p.alive; });
    for (var i = 0; i < alive.length; i++) {
      var p = alive[i];
      if (this.battleEnded && p !== this.winner) continue;
      if (this.randomMotion && !p.isWinner) {
        p.vx += (Math.random() - 0.5) * 0.65;
        p.vy += (Math.random() - 0.5) * 0.65;
        var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (sp > 2.8) {
          p.vx = (p.vx / sp) * 2.8;
          p.vy = (p.vy / sp) * 2.8;
        }
      }
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;

      for (var j = i + 1; j < alive.length; j++) {
        var q = alive[j];
        var dx = q.x - p.x;
        var dy = q.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        var min = p.r + q.r + 4;
        if (dist < min) {
          var push = (min - dist) / dist * 0.5;
          p.vx -= dx * push * 0.15;
          p.vy -= dy * push * 0.15;
          q.vx += dx * push * 0.15;
          q.vy += dy * push * 0.15;
        }
      }

      var c = this.clamp(p.x, p.y, p.r);
      if (c.x !== p.x) p.vx *= -0.3;
      if (c.y !== p.y) p.vy *= -0.3;
      p.x = c.x;
      p.y = c.y;

      if (p.flash > 0) p.flash -= dt;
      if (p.aura && p.aura.life != null) {
        p.aura.life -= dt;
        if (p.aura.life <= 0) p.aura = null;
      }
    }

    for (var k = this.playerList.length - 1; k >= 0; k--) {
      var d = this.playerList[k];
      if (d.dying) {
        d.dieTimer -= dt;
        if (d.dieTimer <= 0) {
          d.dying = false;
          this.playerList.splice(k, 1);
          delete this.players[d.key];
        }
      }
    }

    for (var pi = this.projectiles.length - 1; pi >= 0; pi--) {
      var proj = this.projectiles[pi];
      proj.life -= dt;
      proj.x += proj.vx * dt * 60;
      proj.y += proj.vy * dt * 60;
      var pc = this.clamp(proj.x, proj.y, proj.r);
      proj.x = pc.x;
      proj.y = pc.y;
      if (proj.target && proj.target.alive) {
        var tdx = proj.target.x - proj.x;
        var tdy = proj.target.y - proj.y;
        if (tdx * tdx + tdy * tdy < (proj.target.r + proj.r + 4) * (proj.target.r + proj.r + 4)) {
          proj.target.flash = 0.3;
          this.projectiles.splice(pi, 1);
          continue;
        }
      }
      if (proj.life <= 0) this.projectiles.splice(pi, 1);
    }

    for (var ei = this.effects.length - 1; ei >= 0; ei--) {
      this.effects[ei].life -= dt;
      if (this.effects[ei].life <= 0) this.effects.splice(ei, 1);
    }

    for (var li = this.labels.length - 1; li >= 0; li--) {
      this.labels[li].life -= dt;
      this.labels[li].y -= dt * 16;
      if (this.labels[li].life <= 0) this.labels.splice(li, 1);
    }
  };

  ArenaView.prototype.drawShape = function (ctx, shape, x, y, r, color, rotation) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    rotation = rotation || 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    if (shape === "triangle") {
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(-r * 0.7, r * 0.8);
      ctx.lineTo(-r * 0.7, -r * 0.8);
      ctx.closePath();
      ctx.fill();
    } else if (shape === "diamond") {
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.7, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.7, 0);
      ctx.closePath();
      ctx.fill();
    } else if (shape === "star") {
      ctx.beginPath();
      for (var s = 0; s < 5; s++) {
        var a = (s * 4 * Math.PI) / 5 - Math.PI / 2;
        var rr = s % 2 === 0 ? r : r * 0.45;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
    } else if (shape === "cross") {
      ctx.lineWidth = Math.max(2, r * 0.35);
      ctx.beginPath();
      ctx.moveTo(-r, 0);
      ctx.lineTo(r, 0);
      ctx.moveTo(0, -r);
      ctx.lineTo(0, r);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  ArenaView.prototype.drawBeam = function (ctx, ef, alpha) {
    ctx.strokeStyle = ef.color;
    ctx.lineWidth = ef.lineWidth || 3;
    ctx.globalAlpha = alpha;
    if (ef.dash && ef.dash.length) ctx.setLineDash(ef.dash);
    else ctx.setLineDash([]);

    if (ef.shape === "slash") {
      var mx = (ef.x1 + ef.x2) / 2;
      var my = (ef.y1 + ef.y2) / 2;
      var dx = ef.x2 - ef.x1;
      var dy = ef.y2 - ef.y1;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var px = -dy / len * 12;
      var py = dx / len * 12;
      ctx.beginPath();
      ctx.moveTo(mx - px, my - py);
      ctx.lineTo(mx + px, my + py);
      ctx.stroke();
    } else if (ef.shape === "bolt") {
      ctx.beginPath();
      ctx.moveTo(ef.x1, ef.y1);
      ctx.lineTo((ef.x1 + ef.x2) / 2 + 15, (ef.y1 + ef.y2) / 2 - 10);
      ctx.lineTo((ef.x1 + ef.x2) / 2 - 10, (ef.y1 + ef.y2) / 2 + 8);
      ctx.lineTo(ef.x2, ef.y2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(ef.x1, ef.y1);
      ctx.lineTo(ef.x2, ef.y2);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  ArenaView.prototype.drawCrown = function (ctx, x, y, r, alpha, phase) {
    ctx.save();
    ctx.translate(x, y - r - 12);
    ctx.globalAlpha = alpha;
    ctx.translate(0, Math.sin(phase) * 2.5);
    var w = Math.max(12, r * 1.05);
    ctx.fillStyle = "#ffd700";
    ctx.strokeStyle = "#b8860b";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-w, 5);
    ctx.lineTo(-w * 0.75, -7);
    ctx.lineTo(-w * 0.38, 3);
    ctx.lineTo(0, -10);
    ctx.lineTo(w * 0.38, 3);
    ctx.lineTo(w * 0.75, -7);
    ctx.lineTo(w, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ff4466";
    ctx.beginPath();
    ctx.arc(-w * 0.38, -2, 2.5, 0, Math.PI * 2);
    ctx.arc(0, -5, 2.5, 0, Math.PI * 2);
    ctx.arc(w * 0.38, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  ArenaView.prototype.drawHpRing = function (ctx, p, alpha) {
    if (p.dying || p.isWinner) return;
    var ratio = p.maxHp > 0 ? Math.max(0, Math.min(1, p.hp / p.maxHp)) : 1;
    var th = this.readCanvasTheme();
    var ringR = p.r + 6;
    var start = -Math.PI / 2;
    var hpColor = ratio <= 0.25 ? th.hpLow : (ratio <= 0.55 ? th.hp2 : th.hp1);

    ctx.globalAlpha = alpha * 0.45;
    ctx.strokeStyle = th.hpTrack;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
    ctx.stroke();

    if (ratio > 0.001) {
      ctx.globalAlpha = alpha * 0.92;
      ctx.strokeStyle = hpColor;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      if (ratio >= 0.998) {
        ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
      } else {
        ctx.arc(p.x, p.y, ringR, start, start - ratio * Math.PI * 2, true);
      }
      ctx.stroke();

      ctx.globalAlpha = alpha * 0.24;
      ctx.fillStyle = hpColor;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      if (ratio >= 0.998) {
        ctx.arc(p.x, p.y, p.r * 0.88, 0, Math.PI * 2);
      } else {
        ctx.arc(p.x, p.y, p.r * 0.88, start, start - ratio * Math.PI * 2, true);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = alpha;
  };

  ArenaView.prototype.drawNameLabel = function (ctx, p, alpha) {
    var th = this.readCanvasTheme();
    var label = p.name.length > 8 ? p.name.substring(0, 7) + "…" : p.name;
    ctx.font = (p.isBoss ? "bold 12px" : "11px") + " Microsoft YaHei, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    var nameY = p.y - p.r - 6;
    var tw = ctx.measureText(label).width + 10;
    ctx.globalAlpha = alpha * 0.85;
    ctx.fillStyle = th.labelBg;
    ctx.strokeStyle = p.isBoss ? th.labelBoss : th.labelStroke;
    ctx.lineWidth = p.isBoss ? 1.5 : 1;
    var rx = 4;
    var bx = p.x - tw / 2;
    var by = nameY - 15;
    ctx.beginPath();
    ctx.moveTo(bx + rx, by);
    ctx.lineTo(bx + tw - rx, by);
    ctx.quadraticCurveTo(bx + tw, by, bx + tw, by + 15);
    ctx.lineTo(bx + rx, by + 15);
    ctx.quadraticCurveTo(bx, by + 15, bx, by);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.isBoss ? th.labelBoss : th.labelText;
    ctx.fillText(label, p.x, nameY);
  };

  ArenaView.prototype.draw = function () {
    var ctx = this.ctx;
    var th = this.readCanvasTheme();
    ctx.clearRect(0, 0, this.w, this.h);

    ctx.strokeStyle = th.grid;
    ctx.lineWidth = 1;
    var grid = 40;
    for (var gx = PAD; gx < this.w - PAD; gx += grid) {
      ctx.beginPath();
      ctx.moveTo(gx, PAD);
      ctx.lineTo(gx, this.h - PAD);
      ctx.stroke();
    }
    for (var gy = PAD; gy < this.h - PAD; gy += grid) {
      ctx.beginPath();
      ctx.moveTo(PAD, gy);
      ctx.lineTo(this.w - PAD, gy);
      ctx.stroke();
    }

    ctx.strokeStyle = th.frame;
    ctx.lineWidth = 2;
    ctx.strokeRect(PAD, PAD, this.w - PAD * 2, this.h - PAD * 2);

    for (var e = 0; e < this.effects.length; e++) {
      var ef = this.effects[e];
      var alpha = Math.max(0, ef.life / (ef.maxLife || 1));
      ctx.globalAlpha = alpha;

      if (ef.kind === "beam") {
        this.drawBeam(ctx, ef, alpha);
      } else if (ef.kind === "ring" || ef.kind === "wave" || ef.kind === "healwave") {
        var prog = 1 - ef.life / ef.maxLife;
        var radius = ef.r + (ef.maxR - ef.r) * prog;
        ctx.beginPath();
        ctx.arc(ef.x, ef.y, Math.min(radius, Math.min(this.w, this.h) / 2), 0, Math.PI * 2);
        ctx.strokeStyle = ef.color;
        ctx.lineWidth = ef.lineWidth || (ef.kind === "wave" ? 5 : 3);
        if (ef.dash) ctx.setLineDash(ef.dash);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (ef.kind === "burst") {
        var bprog = 1 - ef.life / ef.maxLife;
        var br = ef.r + (ef.maxR - ef.r) * bprog;
        for (var bi = 0; bi < 8; bi++) {
          var ba = (bi / 8) * Math.PI * 2;
          ctx.strokeStyle = ef.color;
          ctx.lineWidth = ef.lineWidth || 4;
          ctx.beginPath();
          ctx.moveTo(ef.x + Math.cos(ba) * ef.r, ef.y + Math.sin(ba) * ef.r);
          ctx.lineTo(ef.x + Math.cos(ba) * br, ef.y + Math.sin(ba) * br);
          ctx.stroke();
        }
      } else if (ef.kind === "bolt") {
        ctx.strokeStyle = ef.color;
        ctx.lineWidth = ef.lineWidth || 5;
        ctx.shadowColor = ef.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(ef.tx, ef.y);
        ctx.lineTo(ef.tx + 14, ef.y + (ef.ty - ef.y) * 0.35);
        ctx.lineTo(ef.tx - 10, ef.y + (ef.ty - ef.y) * 0.65);
        ctx.lineTo(ef.tx, ef.ty);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (ef.kind === "hit" || ef.kind === "heal") {
        ctx.fillStyle = ef.color;
        ctx.font = "bold 15px Microsoft YaHei, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(ef.text || "", ef.x, ef.y - 12 * (1 - alpha));
      } else if (ef.kind === "death") {
        ctx.strokeStyle = ef.color;
        ctx.lineWidth = ef.lineWidth || 4;
        ctx.beginPath();
        ctx.moveTo(ef.x - ef.r, ef.y - ef.r);
        ctx.lineTo(ef.x + ef.r, ef.y + ef.r);
        ctx.moveTo(ef.x + ef.r, ef.y - ef.r);
        ctx.lineTo(ef.x - ef.r, ef.y + ef.r);
        ctx.stroke();
      } else if (ef.kind === "spawn") {
        ctx.strokeStyle = ef.color;
        ctx.lineWidth = ef.lineWidth || 3;
        ctx.beginPath();
        ctx.arc(ef.x, ef.y, 12 * alpha, 0, Math.PI * 2);
        ctx.stroke();
        this.drawShape(ctx, "diamond", ef.x, ef.y, 6 * alpha, ef.color, 0);
      } else if (ef.kind === "dash") {
        ctx.strokeStyle = ef.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(ef.x, ef.y, ef.r + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (ef.kind === "shield") {
        var sprog = 1 - ef.life / ef.maxLife;
        ctx.strokeStyle = ef.color;
        ctx.lineWidth = ef.lineWidth || 4;
        ctx.beginPath();
        ctx.arc(ef.x, ef.y, ef.r + 10 + sprog * 6, -Math.PI * 0.85, Math.PI * 0.85);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ef.x, ef.y, ef.r + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    for (var pi = 0; pi < this.projectiles.length; pi++) {
      var pr = this.projectiles[pi];
      if (pr.trail) {
        ctx.strokeStyle = pr.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(pr.x - pr.vx * 1.2, pr.y - pr.vy * 1.2);
        ctx.lineTo(pr.x, pr.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      var rot = Math.atan2(pr.vy, pr.vx);
      this.drawShape(ctx, pr.shape || "circle", pr.x, pr.y, pr.r, pr.color, rot);
    }

    for (var i = 0; i < this.playerList.length; i++) {
      var p = this.playerList[i];
      if (!p.alive && !p.dying) continue;
      if (this.battleEnded && p !== this.winner && !p.dying) continue;
      var fadeDur = p.fadeDuration || DIE_FADE_SEC;
      var alpha = p.dying ? Math.max(0, p.dieTimer / fadeDur) : 1;
      ctx.globalAlpha = alpha;

      if (p.aura) {
        ctx.strokeStyle = p.aura.color;
        ctx.lineWidth = p.aura.kind === "win" ? 4 : 3;
        ctx.setLineDash(p.aura.kind === "slow" ? [6, 4] : (p.aura.kind === "win" ? [6, 3] : []));
        ctx.globalAlpha = alpha * (p.aura.kind === "win" ? 0.85 : 0.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + (p.aura.kind === "win" ? 12 : 8), 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = alpha;
      }

      if (p.flash > 0) {
        ctx.fillStyle = "rgba(255,60,60,0.5)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!p.dying) this.drawHpRing(ctx, p, alpha);

      var grad = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 1, p.x, p.y, p.r);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.35, p.isWinner ? "#ffe566" : p.color);
      grad.addColorStop(1, this.shadeColor(p.isWinner ? "#ffd700" : p.color, -40));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = p.isWinner ? "#ffd700" : (p.isBoss ? "#ffd700" : "rgba(255,255,255,0.6)");
      ctx.lineWidth = p.isWinner ? 4 : (p.isBoss ? 3 : 2);
      ctx.stroke();

      if (!p.dying) {
        this.drawNameLabel(ctx, p, alpha);
        if (p.isWinner) {
          this.drawCrown(ctx, p.x, p.y, p.r, alpha, this.crownPhase);
        }
      }
      ctx.globalAlpha = 1;
    }

    for (var l = 0; l < this.labels.length; l++) {
      var lb = this.labels[l];
      ctx.globalAlpha = Math.min(1, lb.life);
      ctx.fillStyle = lb.color;
      ctx.font = "bold " + lb.size + "px Microsoft YaHei, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(lb.text, lb.x, lb.y);
      ctx.globalAlpha = 1;
    }
  };

  ArenaView.prototype.shadeColor = function (hex, amount) {
    var num = parseInt(hex.replace("#", ""), 16);
    var r = Math.max(0, Math.min(255, (num >> 16) + amount));
    var g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
    var b = Math.max(0, Math.min(255, (num & 0xff) + amount));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  ArenaView.prototype.frame = function (now) {
    if (!this.running) return;
    var dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    this.updatePhysics(dt);
    this.draw();
    requestAnimationFrame(this._boundFrame);
  };

  function boot() {
    if (window.__arenaView) return;
    var view = new ArenaView(document);
    window.__arenaView = view;
    view.start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
