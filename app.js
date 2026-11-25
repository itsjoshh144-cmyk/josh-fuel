(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const byId = Object.fromEntries(RECIPES.map(r => [r.id, r]));
  const kcal = r => Math.round(4 * r.p + 4 * r.c + 9 * r.f);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("jf:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("jf:" + k, JSON.stringify(v)); } catch {} }
  };
  const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Image with graceful fallback: gradient + emoji shows if the photo fails.
  const ph = r => `<div class="ph">${r.emoji}<img src="${r.img}" alt="" loading="lazy" decoding="async" onload="this.classList.add('ok')" onerror="this.remove()"></div>`;
  const toast = msg => { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 1600); };
  const buzz = () => { try { navigator.vibrate && navigator.vibrate(8); } catch {} };

  const todayPlan = () => PLAN[new Date().getDay()];
  const planTotals = plan => SLOTS.reduce((a, [k]) => { const r = byId[plan[k]]; a.kcal += kcal(r); a.p += r.p; a.c += r.c; a.f += r.f; return a; }, { kcal: 0, p: 0, c: 0, f: 0 });

  /* ---------- HOME ---------- */
  function renderHome() {
    const plan = todayPlan(), t = planTotals(plan), d = new Date();
    const hr = d.getHours(), hi = hr < 12 ? "Morning" : hr < 18 ? "Afternoon" : "Evening";
    $("#s-home").innerHTML = `
      <div class="pad"><div class="sub">${DAYS[d.getDay()]} · ${d.getDate()} ${d.toLocaleString("en-GB", { month: "short" })}</div>
      <h1>${hi}, Josh.<br><em>Fuel up.</em></h1></div>
      <div class="totals">
        <div class="stat"><span>Calories</span><b>${t.kcal.toLocaleString()}<small> kcal</small></b><div class="bar"><i style="width:${Math.min(100, t.kcal / TARGET.kcal * 100)}%"></i></div></div>
        <div class="stat"><span>Protein</span><b>${t.p}<small> g</small></b><div class="bar"><i style="width:${Math.min(100, t.p / TARGET.p * 100)}%"></i></div></div>
      </div>
      <div class="macros3"><div><b>${t.c}g</b>Carbs</div><div><b>${t.f}g</b>Fat</div><div><b>${TARGET.p}g+</b>Target</div></div>
      <h2>Today's meals</h2>
      <div class="rail" id="rail">${SLOTS.map(([k, label]) => { const r = byId[plan[k]]; return `
        <button class="mcard" data-r="${r.id}">${ph(r)}<div class="shade"></div>
          <div class="info"><span class="slot">${label}</span><h3>${esc(r.name)}</h3>
          <div class="pills"><span class="pill g">${r.p}g protein</span><span class="pill">${kcal(r)} kcal</span><span class="pill">⏱ ${r.time} min</span></div></div>
        </button>`; }).join("")}</div>
      <div class="dots" id="dots">${SLOTS.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>
      <div class="banner" style="margin-top:22px"><b>${d.getDay() === 0 ? "It's prep day 🔥" : "Swipe for the next meal →"}</b>
      <span>${d.getDay() === 0 ? "Open the Sunday tab — 2 hours and your week is sorted." : "Tap any card for the full recipe, then log it in Track."}</span></div>`;
    const rail = $("#rail"), dots = [...$("#dots").children];
    rail.addEventListener("scroll", () => {
      const i = Math.round(rail.scrollLeft / (rail.firstElementChild.offsetWidth + 14));
      dots.forEach((d, j) => d.classList.toggle("on", i === j));
    }, { passive: true });
  }

  /* ---------- RECIPES ---------- */
  const FILTERS = [["all", "All"], ["breakfast", "Breakfast"], ["lunch", "Lunch"], ["dinner", "Dinner"], ["snack", "Snack"], ["prep", "Meal-prep friendly"]];
  let filter = "all";
  function renderRecipes() {
    const list = RECIPES.filter(r => filter === "all" || (filter === "prep" ? r.prep : r.cats.includes(filter)));
    $("#s-recipes").innerHTML = `
      <div class="pad"><div class="sub">${RECIPES.length} high-protein meals</div><h1>Recipes</h1></div>
      <div style="height:16px"></div>
      <div class="chips">${FILTERS.map(([k, l]) => `<button class="chip ${k === filter ? "on" : ""}" data-f="${k}">${l}</button>`).join("")}</div>
      <div class="grid">${list.map((r, i) => `
        <button class="rcard" data-r="${r.id}" style="animation-delay:${i * 35}ms">${ph(r)}<div class="shade"></div>
          ${r.prep ? `<span class="badge">Meal prep</span>` : ""}
          <div class="info"><h4>${esc(r.name)}</h4><div class="pills"><span class="pill g">${r.p}g P</span><span class="pill">${kcal(r)} kcal</span></div></div>
        </button>`).join("")}</div>`;
  }

  /* ---------- RECIPE SHEET ---------- */
  function openRecipe(id) {
    const r = byId[id]; if (!r) return;
    const eaten = getEaten();
    const isEaten = eaten.includes(id);
    $("#panel").innerHTML = `
      <div class="hero">${ph(r)}<div class="shade"></div><button class="close" data-close>✕</button>
        <div class="info"><div class="pills"><span class="pill">⏱ ${r.time} min</span>${r.cats.map(c => `<span class="pill">${c[0].toUpperCase() + c.slice(1)}</span>`).join("")}${r.prep ? `<span class="pill g">Meal prep</span>` : ""}</div>
        <h3>${esc(r.name)}</h3></div></div>
      <div class="mgrid"><div class="k"><b>${kcal(r)}</b>kcal</div><div><b>${r.p}g</b>Protein</div><div><b>${r.c}g</b>Carbs</div><div><b>${r.f}g</b>Fat</div></div>
      <div class="sec"><h5>Ingredients · 1 serving</h5><ul class="ing">${r.ing.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      <h5>Method</h5><ol class="steps">${r.steps.map((s, i) => `<li><i>${i + 1}</i><span>${esc(s)}</span></li>`).join("")}</ol>
      <div class="tip"><b>⚡ Batch prep for the week</b>${esc(r.batch)}</div></div>
      <button class="cta ${isEaten ? "done" : ""}" data-eat="${r.id}">${isEaten ? "✓ Logged today — tap to undo" : "I ate this — log it"}</button>`;
    $("#panel").scrollTop = 0;
    $("#sheet").classList.add("open");
  }
  const closeSheet = () => $("#sheet").classList.remove("open");

  /* ---------- SUNDAY PREP ---------- */
  function renderPrep() {
    const done = store.get("prep", []);
    $("#s-prep").innerHTML = `
      <div class="pad"><div class="sub">~2 hours · Mon–Fri sorted</div><h1>Sunday <em>Prep</em></h1></div>
      <div class="banner"><b>10 meals · 3 breakfasts · 12 snacks</b><span>3× burrito bowl, 2× egg fried rice, 2× chilli, 2× bolognese sauce, 3× overnight oats, 12 egg muffins. Friday's tuna bake is cooked fresh.</span></div>
      <h2>The plan</h2>
      <div class="tl">${PREP.map((s, i) => `
        <button class="tstep ${done.includes(i) ? "dn" : ""}" data-p="${i}">
          <div class="rail2"><span class="t">${s.t}</span>${i < PREP.length - 1 ? `<span class="ln"></span>` : ""}</div>
          <div class="bx"><h4>${esc(s.title)}<span class="tick">${done.includes(i) ? "✓" : ""}</span></h4><p>${esc(s.body)}</p></div>
        </button>`).join("")}</div>
      <button class="ghost" data-reset="prep">Reset prep checklist</button>
      <p class="note">Food safety: cool food within an hour of cooking, fridge or freeze it straight away, and reheat once until it's steaming hot all the way through.</p>`;
  }

  /* ---------- SHOPPING ---------- */
  function renderShop() {
    const ticks = store.get("shop", {});
    let week = 0, staples = 0, left = 0;
    SHOP.forEach(a => a.items.forEach(it => { it.staple ? staples += it.price : week += it.price; if (!ticks[it.n]) left++; }));
    $("#s-shop").innerHTML = `
      <div class="pad"><div class="sub">Aldi / Lidl · ${left} items left</div><h1>Shopping <em>List</em></h1></div>
      <div class="costs">
        <div class="stat"><span>This week</span><b>£${week.toFixed(0)}<small> est.</small></b></div>
        <div class="stat"><span>+ Staples (1st shop)</span><b>£${staples.toFixed(0)}<small> est.</small></b></div>
      </div>
      ${SHOP.map(a => { const sub = a.items.reduce((s, i) => s + i.price, 0); return `
        <div class="aisle"><h5>${esc(a.aisle)}<small>£${sub.toFixed(2)}</small></h5><div class="box">
        ${a.items.map(it => `<button class="it ${ticks[it.n] ? "dn" : ""}" data-i="${esc(it.n)}"><span class="tick">${ticks[it.n] ? "✓" : ""}</span>
          <span class="nm">${esc(it.n)}<small>${esc(it.q)}</small></span><span class="pr">£${it.price.toFixed(2)}</span></button>`).join("")}
        </div></div>`; }).join("")}
      <button class="ghost" data-reset="shop">↺ Reset for new week</button>
      <p class="note">Prices are rough Aldi/Lidl estimates and change week to week. Staples (peanut butter, spices, sauces) last several weeks.</p>`;
  }

  /* ---------- TRACKER ---------- */
  function getEaten() {
    const t = store.get("track", null);
    if (!t || t.day !== todayKey()) { store.set("track", { day: todayKey(), ids: [] }); return []; }
    return t.ids;
  }
  function setEaten(ids) { store.set("track", { day: todayKey(), ids }); }
  function toggleEaten(id) {
    const ids = getEaten(); const i = ids.indexOf(id);
    i >= 0 ? ids.splice(i, 1) : ids.push(id);
    setEaten(ids); buzz();
    toast(i >= 0 ? "Removed" : `+${byId[id].p}g protein 💪`);
  }
  let showAll = false;
  function renderTrack() {
    const ids = getEaten(), plan = todayPlan();
    const tot = ids.reduce((a, id) => { const r = byId[id]; if (r) { a.k += kcal(r); a.p += r.p; } return a; }, { k: 0, p: 0 });
    const pct = Math.min(1, tot.p / TARGET.p), C = 2 * Math.PI * 50;
    const planIds = SLOTS.map(([k]) => plan[k]);
    const extra = ids.filter(id => !planIds.includes(id));
    const others = RECIPES.filter(r => !planIds.includes(r.id) && !extra.includes(r.id));
    const row = (r, label) => `<button class="titem ${ids.includes(r.id) ? "dn" : ""}" data-t="${r.id}">
        <div class="th">${ph(r)}</div><span class="nm">${esc(r.name)}<small>${label ? label + " · " : ""}${r.p}g protein · ${kcal(r)} kcal</small></span><span class="tick">${ids.includes(r.id) ? "✓" : ""}</span></button>`;
    $("#s-track").innerHTML = `
      <div class="pad"><div class="sub">Resets every day</div><h1>Protein <em>Tracker</em></h1></div>
      <div class="ring">
        <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" stroke="#222" stroke-width="12" fill="none"/>
        <circle cx="60" cy="60" r="50" stroke="var(--acc)" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}" transform="rotate(-90 60 60)" style="transition:stroke-dashoffset .7s cubic-bezier(.2,.8,.2,1)"/>
        <text x="60" y="58" text-anchor="middle" fill="#fff" font-size="24" font-weight="900">${Math.round(pct * 100)}%</text><text x="60" y="76" text-anchor="middle" fill="#9a9ea6" font-size="11" font-weight="700">of ${TARGET.p}g</text></svg>
        <div><div class="big">${tot.p}<small>g protein</small></div><div class="big" style="font-size:26px;margin-top:8px">${tot.k.toLocaleString()}<small> kcal</small></div>
        <div style="color:var(--dim);font-size:13px;margin-top:6px;font-weight:700">${tot.p >= TARGET.p ? "Target smashed ✅" : `${TARGET.p - tot.p}g to go`}</div></div>
      </div>
      <h2>Today's plan</h2>
      <div class="pad">${SLOTS.map(([k, l]) => row(byId[plan[k]], l)).join("")}
      ${extra.map(id => row(byId[id], "Extra")).join("")}
      <button class="add" data-more>${showAll ? "− Hide other meals" : "+ Ate something else? Add a meal"}</button>
      ${showAll ? `<div style="margin-top:12px">${others.map(r => row(r, "")).join("")}</div>` : ""}</div>`;
  }

  /* ---------- NAV + EVENTS ---------- */
  const renders = { home: renderHome, recipes: renderRecipes, prep: renderPrep, shop: renderShop, track: renderTrack };
  let current = "home";
  function go(s) {
    current = s;
    document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.s === s));
    document.querySelectorAll(".screen").forEach(el => el.classList.toggle("on", el.id === "s-" + s));
    renders[s](); $("#main").scrollTop = 0; store.set("tab", s);
  }
  $("#nav").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { buzz(); go(b.dataset.s); } });

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-r],[data-f],[data-p],[data-i],[data-reset],[data-t],[data-more],[data-eat],[data-close],.sheet .bg");
    if (!t) return;
    if (t.matches(".sheet .bg") || t.dataset.close !== undefined) return closeSheet();
    if (t.dataset.r) return openRecipe(t.dataset.r);
    if (t.dataset.f) { filter = t.dataset.f; return renderRecipes(); }
    if (t.dataset.eat) { toggleEaten(t.dataset.eat); openRecipe(t.dataset.eat); if (current === "track") renderTrack(); return; }
    if (t.dataset.p !== undefined) {
      const d = store.get("prep", []), i = +t.dataset.p, k = d.indexOf(i);
      k >= 0 ? d.splice(k, 1) : d.push(i); store.set("prep", d); buzz(); return renderPrep();
    }
    if (t.dataset.i) { const s = store.get("shop", {}); s[t.dataset.i] ? delete s[t.dataset.i] : s[t.dataset.i] = 1; store.set("shop", s); buzz(); return renderShop(); }
    if (t.dataset.reset) {
      store.set(t.dataset.reset, t.dataset.reset === "shop" ? {} : []);
      toast(t.dataset.reset === "shop" ? "List reset — new week 🛒" : "Checklist reset");
      return t.dataset.reset === "shop" ? renderShop() : renderPrep();
    }
    if (t.dataset.t) { toggleEaten(t.dataset.t); return renderTrack(); }
    if (t.dataset.more !== undefined) { showAll = !showAll; return renderTrack(); }
  });

  // Swipe down on the sheet hero to close
  let y0 = null;
  $("#panel").addEventListener("touchstart", e => { y0 = $("#panel").scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
  $("#panel").addEventListener("touchend", e => { if (y0 !== null && e.changedTouches[0].clientY - y0 > 90) closeSheet(); y0 = null; }, { passive: true });

  // Refresh when coming back to the app (handles the daily tracker reset)
  document.addEventListener("visibilitychange", () => { if (!document.hidden) renders[current](); });

  const saved = store.get("tab", "home");
  go(renders[saved] ? saved : "home");

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
      navigator.serviceWorker.ready.then(reg => reg.active && reg.active.postMessage({ type: "warm", urls: RECIPES.map(r => r.img) }));
    });
  }
})();
