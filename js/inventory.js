// Hàm hiển thị tab Hàng Tồn (ẩn tab khác)
function hienthihangton() {
  document.querySelectorAll(".content > div").forEach(div => (div.style.display = "none"));
  document.getElementById("inventory-manager").style.display = "block";
}

// -------------------- DỮ LIỆU MẪU --------------------
let invProducts = [
  { id: 1, name: "Casio MTP-1374D", brand: "Casio", unit: "chiếc" },
  { id: 2, name: "Casio A168", brand: "Casio", unit: "chiếc" },
  { id: 3, name: "Casio Edifice EFR-539", brand: "Casio", unit: "chiếc" },
  { id: 4, name: "Casio G-Shock GA-2100", brand: "Casio", unit: "chiếc" },
  { id: 5, name: "Citizen BM7100", brand: "Citizen", unit: "chiếc" },
  { id: 6, name: "Citizen Tsuyosa Automatic", brand: "Citizen", unit: "chiếc" },
];

// Key lưu trong localStorage
const LS_INV_MOVES = "inv_movements";
const LS_INV_THRESHOLD = "inv_threshold";

// Seed dữ liệu mẫu nhập/xuất (chỉ tạo 1 lần)
(function seedDemoData() {
  if (!localStorage.getItem(LS_INV_MOVES)) {
    const now = new Date();
    const d = (days) => new Date(now.getTime() + days * 86400000).toISOString();
    const moves = [
      { id: "m1", pid: 1, type: "in", qty: 10, at: d(-20) },
      { id: "m2", pid: 2, type: "in", qty: 15, at: d(-18) },
      { id: "m3", pid: 3, type: "in", qty: 7, at: d(-15) },
      { id: "m4", pid: 4, type: "in", qty: 12, at: d(-12) },
      { id: "m5", pid: 5, type: "in", qty: 9, at: d(-10) },
      { id: "m6", pid: 6, type: "in", qty: 11, at: d(-8) },
      { id: "m7", pid: 2, type: "out", qty: 3, at: d(-5) },
      { id: "m8", pid: 4, type: "out", qty: 5, at: d(-3) },
      { id: "m9", pid: 6, type: "out", qty: 4, at: d(-1) },
    ];
    localStorage.setItem(LS_INV_MOVES, JSON.stringify(moves));
  }
  if (!localStorage.getItem(LS_INV_THRESHOLD)) {
    localStorage.setItem(LS_INV_THRESHOLD, "5");
  }
})();

// -------------------- CÁC HÀM TÍNH TOÁN --------------------
function getMoves() {
  try {
    return JSON.parse(localStorage.getItem(LS_INV_MOVES)) || [];
  } catch {
    return [];
  }
}

function calcStockNow(pid) {
  return getMoves()
    .filter(m => m.pid === pid)
    .reduce((sum, m) => sum + (m.type === "in" ? m.qty : -m.qty), 0);
}

function calcStockAt(pid, time) {
  const t = new Date(time).getTime();
  return getMoves()
    .filter(m => m.pid === pid && new Date(m.at).getTime() <= t)
    .reduce((sum, m) => sum + (m.type === "in" ? m.qty : -m.qty), 0);
}

function calcReport(pid, from, to) {
  const start = new Date(from);
  const end = new Date(to);
  const moves = getMoves().filter(m => m.pid === pid);
  const open = calcStockAt(pid, new Date(start.getTime() - 1000));
  let inSum = 0, outSum = 0;
  for (const m of moves) {
    const date = new Date(m.at);
    if (date >= start && date <= end) {
      if (m.type === "in") inSum += m.qty;
      else outSum += m.qty;
    }
  }
  return { open, inSum, outSum, close: open + inSum - outSum };
}

// -------------------- GIAO DIỆN CHÍNH --------------------
document.addEventListener("DOMContentLoaded", () => {
  const threshold = Number(localStorage.getItem(LS_INV_THRESHOLD) || 5);
  const tbody = document.getElementById("invTableBody");

  // ✅ FIX 1: tách phần đổ dropdown ra khỏi renderTable()
  const pointProduct = document.getElementById("pointProduct");
  const periodProduct = document.getElementById("periodProduct");
  const pointBrand = document.getElementById("pointBrand");
  const periodBrand = document.getElementById("periodBrand");

  if (pointProduct && periodProduct) {
    const options = '<option value="">--Chọn sản phẩm--</option>' +
      invProducts.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    pointProduct.innerHTML = options;
    periodProduct.innerHTML = options;
  }

  // ✅ FIX 2: chặn chọn đồng thời sản phẩm & brand
  if (pointProduct && pointBrand) {
    pointProduct.addEventListener("change", () => {
      if (pointProduct.value) pointBrand.value = "";
    });
    pointBrand.addEventListener("change", () => {
      if (pointBrand.value) pointProduct.value = "";
    });
  }

  if (periodProduct && periodBrand) {
    periodProduct.addEventListener("change", () => {
      if (periodProduct.value) periodBrand.value = "";
    });
    periodBrand.addEventListener("change", () => {
      if (periodBrand.value) periodProduct.value = "";
    });
  }

  // ✅ FIX 3: Đưa renderTable và các sự kiện ra sau cùng để 2 nút bấm hoạt động
  function renderTable(mode = "all") {
    const brand = document.getElementById("invBrandFilter").value;
    const keyword = document.getElementById("invSearch").value.trim().toLowerCase();
    let list = invProducts.filter(p =>
      (!brand || p.brand.toLowerCase() === brand.toLowerCase()) &&
      (!keyword || p.name.toLowerCase().includes(keyword))
    );

    if (mode === "low") {
      list = list.filter(p => calcStockNow(p.id) < threshold);
    }

    tbody.innerHTML = list.map(p => {
      const qty = calcStockNow(p.id);
      const low = qty < threshold;
      return `
        <tr class="${low ? 'low-row' : ''}">
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.brand}</td>
          <td>${p.unit}</td>
          <td class="num">${qty}</td>
          <td>${low ? '<span class="pill pill-warn">Sắp hết hàng</span>' : '<span class="pill pill-ok">Đủ hàng</span>'}</td>
        </tr>`;
    }).join('') || `<tr><td colspan="6" class="empty">Không có dữ liệu</td></tr>`;
  }

  // Sự kiện cho nút
  document.getElementById("btnShowAll").addEventListener("click", () => renderTable("all"));
  document.getElementById("btnLowStock").addEventListener("click", () => renderTable("low"));
  document.getElementById("btnApplyFilter").addEventListener("click", () => renderTable());
  document.getElementById("btnResetFilter").addEventListener("click", () => {
    document.getElementById("invBrandFilter").value = "";
    document.getElementById("invSearch").value = "";
    renderTable();
  });

  // Lưu ngưỡng cảnh báo
  document.getElementById("btnSaveThreshold").onclick = () => {
    const val = Math.max(1, Number(document.getElementById("lowThreshold").value || 1));
    localStorage.setItem(LS_INV_THRESHOLD, val);
    document.getElementById("thresholdSaved").style.display = "inline";
    setTimeout(() => (document.getElementById("thresholdSaved").style.display = "none"), 1000);
    renderTable();
  };

  // Tra cứu tại thời điểm
  document.getElementById("btnPointLookup").onclick = () => {
    const at = document.getElementById("pointTime").value;
    const pid = Number(document.getElementById("pointProduct").value);
    const brand = document.getElementById("pointBrand").value;
    const result = document.getElementById("pointResult");

    if (!at) return (result.innerHTML = `<div class="note error">Chọn thời điểm!</div>`);

    if (pid) {
      const p = invProducts.find(x => x.id === pid);
      result.innerHTML = `<div class="stat">
        <b>${p.name}</b><br>Tồn tại ${new Date(at).toLocaleString()}: <b>${calcStockAt(pid, at)}</b> ${p.unit}
      </div>`;
    } else if (brand) {
      const list = invProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase())
        .map(p => `<div>${p.name}: <b>${calcStockAt(p.id, at)}</b></div>`).join('');
      result.innerHTML = list || `<div class="note">Không có sản phẩm thuộc brand này.</div>`;
    } else result.innerHTML = `<div class="note">Chọn sản phẩm hoặc brand!</div>`;
  };

  // Báo cáo nhập – xuất – tồn theo kỳ
  document.getElementById("btnPeriodLookup").onclick = () => {
    const from = document.getElementById("periodFrom").value;
    const to = document.getElementById("periodTo").value;
    const pid = Number(document.getElementById("periodProduct").value);
    const brand = document.getElementById("periodBrand").value;
    const result = document.getElementById("periodResult");

    if (!from || !to) return (result.innerHTML = `<div class="note error">Chọn đủ khoảng thời gian!</div>`);

    if (pid) {
      const p = invProducts.find(x => x.id === pid);
      const r = calcReport(pid, from, to);
      result.innerHTML = `
        <div class="kpis">
          <div class="kpi"><div class="kpi-label">Tồn đầu</div><div class="kpi-value">${r.open}</div></div>
          <div class="kpi"><div class="kpi-label">Nhập</div><div class="kpi-value">${r.inSum}</div></div>
          <div class="kpi"><div class="kpi-label">Xuất</div><div class="kpi-value">${r.outSum}</div></div>
          <div class="kpi"><div class="kpi-label">Tồn cuối</div><div class="kpi-value">${r.close}</div></div>
        </div>`;
    } else if (brand) {
      const rows = invProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase()).map(p => {
        const r = calcReport(p.id, from, to);
        return `<tr>
          <td>${p.id}</td><td>${p.name}</td>
          <td class="num">${r.open}</td><td class="num">${r.inSum}</td>
          <td class="num">${r.outSum}</td><td class="num">${r.close}</td>
        </tr>`;
      }).join('');
      result.innerHTML = `<table class="inv-table">
        <thead><tr><th>Mã</th><th>Tên</th><th>Tồn đầu</th><th>Nhập</th><th>Xuất</th><th>Tồn cuối</th></tr></thead>
        <tbody>${rows}</tbody></table>`;
    } else result.innerHTML = `<div class="note">Chọn sản phẩm hoặc brand!</div>`;
  };

  // ✅ cuối cùng: render bảng mặc định
  renderTable();
});
