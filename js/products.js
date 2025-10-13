(() => {
  const DATA_URL = "./data/products.json";

  // URL
  const params = new URLSearchParams(location.search);
  const brand = (params.get("brand") || "").trim().toLowerCase();

  // DOM
  const gridEl = document.getElementById("grid");
  const emptyEl = document.getElementById("empty");
  const pageTitleEl = document.getElementById("page-title");
  const countEl = document.getElementById("count");

  // Active tab 
  document.querySelectorAll('.brand-tabs a').forEach(a => {
    a.classList.toggle('active', (a.dataset.brand || '') === brand);
  });

  // Sort 
  let sortValue = "newest";
  document.querySelectorAll('input[name="sort"]').forEach(r => {
    if (r.checked) sortValue = r.value;
    r.addEventListener("change", () => { sortValue = r.value; render(); });
  });

  const fmtPrice = n => {
    try { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
    catch { return `$${n}`; }
  };
  const prettyBrand = s => (s || "").toUpperCase();

  let ALL = [];

  function applySort(list) {
    const arr = [...list];
    switch (sortValue) {
      case "price_asc": return arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case "price_desc": return arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      case "name_asc": return arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "newest":
      default: return arr.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)); 
    }
  }

  function render() {
    const filtered = brand ? ALL.filter(p => (p.brand || "").toLowerCase() === brand) : ALL;

    pageTitleEl.textContent = brand ? `Sản phẩm ${prettyBrand(brand)}` : "Tất cả";
    countEl.textContent = `${filtered.length} sản phẩm`;

    if (!filtered.length) {
      gridEl.innerHTML = ""; emptyEl.hidden = false; return;
    }
    emptyEl.hidden = true;

    const sorted = applySort(filtered);

    gridEl.innerHTML = sorted.map(p => {
      const href = `chitietsanpham.html?id=${encodeURIComponent(p.id)}`;
      const img = p.image || "./image/best-seller.png";
      const price = p.price != null ? fmtPrice(p.price) : "—";
      const old = p.old_price != null ? `<span>${fmtPrice(p.old_price)}</span>` : "";
      return `
        <a class="card" href="${href}" aria-label="${p.name}">
          <div class="thumb"><img src="${img}" alt="${p.name}"></div>
          <div class="content">
            <div class="brand">${prettyBrand(p.brand)}</div>
            <div class="name">${p.name}</div>
            <div class="price">${price} ${old}</div>
          </div>
        </a>`;
    }).join("");
  }

  async function main() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      ALL = await res.json();
      render();
    } catch (e) {
      console.error("Không thể tải dữ liệu:", e);
      emptyEl.hidden = false;
      emptyEl.textContent = "Không thể tải dữ liệu sản phẩm.";
    }
  }

  main();
})();
