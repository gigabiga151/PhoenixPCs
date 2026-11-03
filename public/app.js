const $ = (s, el = document) => el.querySelector(s);
const usd = (n) => "$" + Number(n).toLocaleString("en-US");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const SLOT_LABELS = { cpu: "Processor", gpu: "Graphics", ram: "Memory", storage: "Storage", cooling: "Cooling", case: "Case & lighting" };
const STAGE_LABELS = ["Paid", "Building", "Stress testing", "Shipped"];

function replay(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth; // restart animation
  el.classList.add(cls);
  el.addEventListener("animationend", () => el.classList.remove(cls), { once: true });
}

// Neon ripple wherever a product, option, or card is clicked
document.addEventListener("pointerdown", (e) => {
  const el = e.target.closest(".model, .opt, .card");
  if (!el) return;
  const r = el.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.className = "ripple";
  dot.style.left = e.clientX - r.left + "px";
  dot.style.top = e.clientY - r.top + "px";
  el.appendChild(dot);
  dot.addEventListener("animationend", () => dot.remove());
});

let catalog;
let current = null; // { model, config }

document.querySelectorAll(".js-year").forEach((e) => (e.textContent = new Date().getFullYear()));

async function init() {
  try {
    const res = await fetch("/api/catalog");
    if (!res.ok) throw new Error();
    catalog = await res.json();
  } catch {
    $("#models").innerHTML = `<p class="error">Couldn't load the catalog. Please refresh.</p>`;
    return;
  }
  renderModels();
  renderPrebuilts();
  selectModel("pyre", false); // start with a popular build so the builder is never empty
  renderCartCount();
  handleCheckoutReturn();
}

function renderModels() {
  $("#models").innerHTML = catalog.base_models.map((m, i) => `
    <button class="model rise" style="--i:${i}" data-id="${m.id}">
      <img src="${m.image}" alt="${esc(m.name)}" loading="lazy" />
      <div class="body">
        <div class="tier">${esc(m.tier)}</div>
        <h3>${esc(m.name)}</h3>
        <p>${esc(m.tagline)}</p>
        <div class="from">From ${usd(m.base_price)} <span class="muted">· ${esc(m.best_for)}</span></div>
      </div>
    </button>`).join("");
  $("#models").addEventListener("click", (e) => {
    const btn = e.target.closest(".model");
    if (btn) selectModel(btn.dataset.id, true);
  });
}

function selectModel(id, scroll) {
  const model = catalog.base_models.find((m) => m.id === id);
  current = { model, config: { ...model.defaults } };
  document.querySelectorAll(".model").forEach((b) => b.classList.toggle("active", b.dataset.id === id));
  replay(document.querySelector(`.model[data-id="${id}"]`), "pop");
  const builder = $("#builder");
  const firstOpen = builder.hidden;
  builder.hidden = false;
  if (firstOpen) replay(builder, "reveal");
  renderBuilder();
  if (scroll) $("#builder").scrollIntoView({ behavior: "smooth", block: "start" });
}

function opt(slot, id) {
  return catalog.components[slot].find((o) => o.id === id);
}

function renderBuilder() {
  const { model, config } = current;
  $("#slots").innerHTML = Object.entries(catalog.components).map(([slot, options]) => `
    <div class="slot">
      <h4>${SLOT_LABELS[slot] ?? slot}</h4>
      ${catalog.slot_info?.[slot] ? `<p class="slot-info">${esc(catalog.slot_info[slot])}</p>` : ""}
      <div class="opts">
        ${options.map((o) => `
          <button class="opt ${config[slot] === o.id ? "active" : ""}" data-slot="${slot}" data-id="${o.id}">
            <span>${esc(o.name)}<small>${esc(o.spec)}</small></span>
            <span class="p">${o.price ? "+" + usd(o.price) : "Included"}</span>
          </button>`).join("")}
      </div>
    </div>`).join("");
  const img = $("#sum-img");
  if (img.getAttribute("src") !== model.image) { img.src = model.image; replay(img, "reveal"); }
  img.alt = `${model.name} RGB gaming PC`;
  $("#sum-tier").textContent = model.tier;
  $("#sum-name").textContent = model.name;
  $("#sum-desc").textContent = model.description || model.tagline;
  $("#sum-perf").innerHTML = `<span>Best for</span>${esc(model.best_for)}<span>Expected</span>${esc(model.performance || "")}`;
  $("#sum-list").innerHTML = Object.keys(catalog.components)
    .map((slot) => `<li><span>${SLOT_LABELS[slot] ?? slot}</span><span>${esc(opt(slot, config[slot]).name)}</span></li>`).join("");
  const el = $("#sum-total");
  const next = usd(total());
  if (el.textContent && el.textContent !== next) replay(el, "bump");
  el.textContent = next;
  $("#sum-monthly").textContent = `or about ${usd(Math.round(total() / 30))}/mo for 30 months with financing`;
}

function total() {
  return current.model.base_price + Object.entries(current.config).reduce((s, [slot, id]) => s + opt(slot, id).price, 0);
}

$("#slots").addEventListener("click", (e) => {
  const b = e.target.closest(".opt");
  if (!b) return;
  current.config[b.dataset.slot] = b.dataset.id;
  renderBuilder();
  replay(document.querySelector(`.opt[data-slot="${b.dataset.slot}"][data-id="${b.dataset.id}"]`), "pop");
});

function renderPrebuilts() {
  $("#prebuilt-grid").innerHTML = catalog.prebuilts.map((p, i) => `
    <article class="card rise" style="--i:${i}">
      <div class="imgwrap"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy" /><span class="badge">${esc(p.badge)}</span></div>
      <div class="body">
        <div class="tier">${esc(p.chipset)}</div>
        <h3>${esc(p.name)}</h3>
        ${p.blurb ? `<p class="blurb">${esc(p.blurb)}</p>` : ""}
        <p class="spec">${esc(p.gpu_chipset)}</p>
        <div class="price-row"><strong>${usd(p.price)}</strong><s>${usd(p.was_price)}</s></div>
        <div class="meta">★ ${p.rating} (${p.reviews} reviews) · or ${usd(p.monthly)}/mo</div>
        <button class="btn primary block" data-id="${p.id}">Add to cart</button>
      </div>
    </article>`).join("");
}

$("#prebuilt-grid").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-id]");
  if (!b) return;
  replay(b.closest(".card"), "pop");
  const p = catalog.prebuilts.find((x) => x.id === b.dataset.id);
  addToCart({ type: "prebuilt", id: p.id }, b);
});

$("#add-custom").addEventListener("click", (e) => {
  addToCart({ type: "custom", base_model: current.model.id, config: { ...current.config } }, e.currentTarget);
});

// ---- Cart (saved in this browser) ----
const CART_KEY = "phoenix-cart-v1";
const MAX_QTY = 5;
const MAX_LINES = 10;
let cart = loadCart();

function loadCart() {
  try {
    const c = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(c) ? c : [];
  } catch {
    return [];
  }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartCount();
}
const itemKey = (i) => (i.type === "prebuilt" ? `p:${i.id}` : `c:${i.base_model}:${JSON.stringify(i.config)}`);

// Price lookups use the catalog for display only; the server recalculates at checkout.
function describe(item) {
  if (item.type === "prebuilt") {
    const p = catalog.prebuilts.find((x) => x.id === item.id);
    return p && { name: p.name, detail: p.gpu_chipset, price: p.price, image: p.image };
  }
  const m = catalog.base_models.find((x) => x.id === item.base_model);
  if (!m) return null;
  let price = m.base_price;
  const names = [];
  for (const slot of Object.keys(catalog.components)) {
    const o = opt(slot, item.config[slot]);
    if (!o) return null;
    price += o.price;
    names.push(o.name);
  }
  return { name: `${m.name} (Custom)`, detail: names.join(" · "), price, image: m.image };
}

function addToCart(item, sourceEl) {
  const key = itemKey(item);
  const existing = cart.find((i) => itemKey(i) === key);
  if (existing) {
    if (existing.qty >= MAX_QTY) return toast(`Max ${MAX_QTY} of the same build per order`);
    existing.qty++;
  } else {
    if (cart.length >= MAX_LINES) return toast(`Your cart can hold up to ${MAX_LINES} different builds`);
    cart.push({ ...item, qty: 1 });
  }
  saveCart();
  replay($("#cart-open"), "pop");
  replay($("#cart-count"), "bump");
  if (sourceEl) {
    const label = sourceEl.textContent;
    sourceEl.textContent = "✓ Added";
    sourceEl.classList.add("added");
    setTimeout(() => { sourceEl.textContent = label; sourceEl.classList.remove("added"); }, 1400);
  }
  toast(`${describe(item)?.name ?? "Build"} added to cart`, true);
}

function renderCartCount() {
  const n = cart.reduce((s, i) => s + i.qty, 0);
  $("#cart-count").textContent = n;
  $("#cart-count").classList.toggle("zero", n === 0);
}

function renderCart() {
  // Drop anything that no longer exists in the catalog
  cart = cart.filter((i) => describe(i));
  saveCart();
  const list = $("#cart-items");
  list.innerHTML = cart.map((item, idx) => {
    const d = describe(item);
    return `
      <li class="cart-item">
        <img src="${d.image}" alt="" />
        <div class="ci-main">
          <strong>${esc(d.name)}</strong>
          <small>${esc(d.detail)}</small>
          <div class="ci-row">
            <div class="qty" data-idx="${idx}">
              <button type="button" data-d="-1" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button type="button" data-d="1" aria-label="Increase quantity">+</button>
            </div>
            <span class="ci-price">${usd(d.price * item.qty)}</span>
          </div>
          <button type="button" class="ci-remove" data-remove="${idx}">Remove</button>
        </div>
      </li>`;
  }).join("");
  const empty = cart.length === 0;
  $("#cart-empty").hidden = !empty;
  $("#checkout-form").hidden = empty;
  $("#cart-total").textContent = usd(cart.reduce((s, i) => s + describe(i).price * i.qty, 0));
}

$("#cart-items").addEventListener("click", (e) => {
  const rm = e.target.closest("[data-remove]");
  if (rm) {
    cart.splice(Number(rm.dataset.remove), 1);
    return renderCart();
  }
  const b = e.target.closest(".qty button");
  if (!b) return;
  const item = cart[Number(b.closest(".qty").dataset.idx)];
  item.qty = Math.min(MAX_QTY, item.qty + Number(b.dataset.d));
  if (item.qty < 1) cart.splice(cart.indexOf(item), 1);
  renderCart();
});

const cartDrawer = $("#cart");
function openCart() {
  if (!catalog) return;
  renderCart();
  $("#checkout-error").textContent = "";
  cartDrawer.showModal();
}
$("#cart-open").addEventListener("click", openCart);
$("#cart-close").addEventListener("click", () => cartDrawer.close());
$("#cart-shop").addEventListener("click", () => cartDrawer.close());
cartDrawer.addEventListener("click", (e) => { if (e.target === cartDrawer) cartDrawer.close(); });

$("#checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("#checkout-btn");
  btn.disabled = true;
  $("#checkout-error").textContent = "";
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(new FormData(e.target)), items: cart }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) throw new Error(data.error || "Couldn't start checkout. Please try again.");
    window.location.href = data.url; // Stripe's secure card page
  } catch (err) {
    $("#checkout-error").textContent = err.message;
    btn.disabled = false;
  }
});

let toastTimer;
function toast(msg, withLink) {
  const t = $("#toast");
  t.innerHTML = esc(msg) + (withLink ? ` <button type="button" id="toast-view">View cart</button>` : "");
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  $("#toast-view")?.addEventListener("click", () => { t.classList.remove("show"); openCart(); });
}

// ---- Return from Stripe ----
async function handleCheckoutReturn() {
  const params = new URLSearchParams(location.search);
  const state = params.get("checkout");
  if (!state) return;
  history.replaceState(null, "", location.pathname);
  if (state === "cancel") {
    toast("Checkout cancelled. Your cart is still saved.");
    return openCart();
  }
  const dlg = $("#confirm-dialog");
  const body = $("#confirm-body");
  body.innerHTML = `<p class="muted">Confirming your payment…</p>`;
  dlg.showModal();
  try {
    const res = await fetch(`/api/checkout/status?session_id=${encodeURIComponent(params.get("session_id") || "")}`);
    const d = await res.json();
    if (!res.ok) throw new Error(d.error);
    if (d.paid) { cart = []; saveCart(); }
    body.innerHTML = `
      <p class="eyebrow">${d.paid ? "Payment received" : "Payment processing"}</p>
      <h3>${d.paid ? "Thank you! Your build is in the queue." : "We're confirming your payment"}</h3>
      <p class="muted">${d.paid ? `We've charged ${usd(d.amount_total)}. A receipt is on its way to ${esc(d.email)}.` : "This can take a minute. We'll email you once it clears."}</p>
      <ul class="refs">${d.orders.map((o) => `<li><span>${esc(o.build_name)}${o.quantity > 1 ? ` ×${o.quantity}` : ""}</span><strong>${esc(o.order_ref)}</strong></li>`).join("")}</ul>
      <p class="fine left">Save your order reference${d.orders.length > 1 ? "s" : ""} to track your build below.</p>
      <button class="btn primary block" onclick="this.closest('dialog').close()">Done</button>`;
  } catch {
    body.innerHTML = `<h3>We couldn't confirm your payment</h3><p class="muted">If you were charged, your order is safe. Check your email for a receipt or contact us.</p>
      <button class="btn primary block" onclick="this.closest('dialog').close()">Close</button>`;
  }
}

// ---- Tracking ----
$("#track-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const out = $("#track-result");
  out.innerHTML = `<p class="muted">Looking up…</p>`;
  const qs = new URLSearchParams({ ref: fd.get("ref").trim(), email: fd.get("email").trim() });
  try {
    const res = await fetch(`/api/orders/track?${qs}`);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d.error || "Lookup failed");
    out.innerHTML = `
      <div class="track-card">
        <p class="eyebrow">Order ${esc(d.order_ref)}</p>
        <h3 style="margin:0">${esc(d.build_name)}</h3>
        <p class="muted" style="margin:4px 0 0">${d.quantity > 1 ? `×${d.quantity} · ` : ""}${usd(d.total_price)} · placed ${new Date(d.created_at).toLocaleDateString()}</p>
        <ol class="stages">${STAGE_LABELS.map((l, i) => `<li class="${i <= d.stage_index ? "done" : ""}">${l}</li>`).join("")}</ol>
      </div>`;
  } catch (err) {
    out.innerHTML = `<p class="error">${esc(err.message)}</p>`;
  }
});

init();
