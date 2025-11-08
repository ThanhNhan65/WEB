(function () {
  const KEY = 'app_products';

  function genId() {
    return 'p' + Date.now();
  }
  function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function escapeAttr(s){ return String(s||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function resolveImagePath(src){
    if (!src) return '';
    var s = String(src);
    if (/^(https?:)?\/\//.test(s) || s.startsWith('data:') || s.startsWith('blob:')) return s;
    if (s.startsWith('/')) return s;
    var isAdmin = location.pathname.indexOf('/admin/') !== -1;
    if (isAdmin && !s.startsWith('../')) return '../' + s;
    return s;
  }

  function getWatchTypes(){
    var raw = localStorage.getItem('watchTypes');
    return raw ? JSON.parse(raw) : [];
  }

  function populateTypeSelect(){
    var sel = document.getElementById('prod-type-select');
    if (!sel) return;
    var types = getWatchTypes().filter(function(t){ return !t.hidden; });
    var prev = sel.value;
    sel.innerHTML = '<option value="">-- Chọn loại --</option>';
    types.forEach(function(t){
      var o = document.createElement('option'); o.value = t.name; o.textContent = t.name; sel.appendChild(o);
    });
    if (prev) sel.value = prev;
  }

  document.addEventListener('watchTypesUpdated', function(){ populateTypeSelect(); });

  function getProducts() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveProducts(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
    document.dispatchEvent(new CustomEvent('productsUpdated', { detail: list }));
    renderProductList();
  }

  function renderProductList() {
    var prods = getProducts();
    var qEl = document.getElementById('search-product-admin');
    var q = qEl ? qEl.value.trim().toLowerCase() : '';
    if (q) {
      prods = prods.filter(function(p){
        return (p.name && p.name.toLowerCase().includes(q)) || (p.code && p.code.toLowerCase().includes(q)) || (p.type && p.type.toLowerCase().includes(q));
      });
    }
    const tbody = document.getElementById('product-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      if (prods.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td'); td.colSpan = 7; td.style.padding = '12px'; td.style.color = '#666'; td.textContent = 'Chưa có sản phẩm.';
        tr.appendChild(td); tbody.appendChild(tr);
      } else {
        prods.forEach(function(p){
          const tr = document.createElement('tr');
          const imgSrc = resolveImagePath(p.image);
          const imgHtml = p.image ? ('<img src="'+escapeAttr(imgSrc)+'" style="height:48px;object-fit:cover"/>') : '';
          const status = p.hidden ? '<span class="status-badge muted">Đã ẩn</span>' : '<span class="status-badge active">Hoạt động</span>';
          tr.innerHTML = '<td>'+escapeHtml(p.code || p.id || '')+'</td>'+
                         '<td>'+escapeHtml(p.name||'')+'</td>'+
                         '<td>'+escapeHtml(p.type||'')+'</td>'+
                         '<td>'+imgHtml+'</td>'+
                         '<td>'+(p.price?Number(p.price).toLocaleString('vi-VN')+' ₫':'')+'</td>'+
                         '<td>'+status+'</td>'+
                         '<td>'+
                           '<button class="btn small edit">Sửa</button> '+
                           '<button class="btn ghost toggle">'+(p.hidden?'Hiện':'Ẩn')+'</button> '+
                           '<button class="btn warn del">Xóa</button>'+
                         '</td>';
          tr.querySelector('.edit').addEventListener('click', function(){ editProduct(p.id); });
          tr.querySelector('.toggle').addEventListener('click', function(){ toggleHidden(p.id); });
          tr.querySelector('.del').addEventListener('click', function(){ if(confirm('Xóa sản phẩm này?')) deleteProduct(p.id); });
          tbody.appendChild(tr);
        });
      }
    } else {
      let list = document.getElementById('product-list');
      if (!list) list = document.getElementById('product-list-pricing');
      if (!list) return;
      list.innerHTML = '';
      if (prods.length === 0) {
        list.innerHTML = '<div style="padding:12px;color:#666">Chưa có sản phẩm.</div>';
      }
      prods.forEach(function(p){
        const row = document.createElement('div');
        row.className = 'prod-row';
  var imgSrc2 = resolveImagePath(p.image);
  row.innerHTML = '<div class="col name"><b>'+escapeHtml(p.name||'')+'</b> ('+escapeHtml(p.code||'')+')</div>'+
                        '<div class="col type">'+escapeHtml(p.type||'')+'</div>'+
      '<div class="col img">'+(p.image?('<img src="'+escapeAttr(imgSrc2)+'" height="40">'):'')+'</div>'+
                        '<div class="col desc">'+escapeHtml(p.description||'')+'</div>'+
                        '<div class="col act">'+
                          '<button class="btn small edit">Sửa</button> '+
                          '<button class="btn ghost toggle">'+(p.hidden?'Hiện':'Ẩn')+'</button> '+
                          '<button class="btn warn del">Xóa</button>'+
                        '</div>';
        row.querySelector('.edit').addEventListener('click', function(){ editProduct(p.id); });
        row.querySelector('.toggle').addEventListener('click', function(){ toggleHidden(p.id); });
        row.querySelector('.del').addEventListener('click', function(){ if(confirm('Xóa sản phẩm này?')) deleteProduct(p.id); });
        list.appendChild(row);
      });
    }
    var countEl = document.getElementById('product-count');
    if (countEl) countEl.textContent = prods.length;
  }
  window.saveProduct = function () {
    const id = document.getElementById('prod-id').value.trim();
    const code = document.getElementById('prod-code').value.trim();
    const name = document.getElementById('prod-name').value.trim();
    var type = '';
    var sel = document.getElementById('prod-type-select');
    var free = document.getElementById('prod-type-free');
    if (sel && sel.value) type = sel.value.trim();
    else if (free) type = free.value.trim();
    else {
      var old = document.getElementById('prod-type');
      if (old) type = old.value.trim();
    }
    const image = document.getElementById('prod-image').value.trim();
    const desc = document.getElementById('prod-desc').value.trim();
    var specCase = (document.getElementById('prod-spec-case')||{}).value || '';
    var specWater = (document.getElementById('prod-spec-water')||{}).value || '';
    var specMovement = (document.getElementById('prod-spec-movement')||{}).value || '';
    var specGender = (document.getElementById('prod-spec-gender')||{}).value || '';

    if (!code || !name) {
      alert('Mã và tên không được để trống!');
      return;
    }

    let prods = getProducts();

    if (id) {
      const idx = prods.findIndex(p => p.id === id);
      if (idx !== -1) {
        prods[idx] = { ...prods[idx], code, name, type, image, description: desc, specs: { caseMaterial: specCase, waterResistance: specWater, movement: specMovement, gender: specGender } };
      }
    } else {
      prods.push({
        id: genId(),
        code,
        name,
        type,
        image,
        description: desc,
        price: (document.getElementById('prod-price')||{}).value || '',
        specs: { caseMaterial: specCase, waterResistance: specWater, movement: specMovement, gender: specGender },
        hidden: false
      });
    }

    saveProducts(prods);
    resetForm();
    alert('Đã lưu sản phẩm!');
  };

  function editProduct(id) {
    const p = getProducts().find(p => p.id === id);
    if (!p) return;
    document.getElementById('prod-id').value = p.id;
    document.getElementById('prod-code').value = p.code || '';
    document.getElementById('prod-name').value = p.name || '';
    var sel = document.getElementById('prod-type-select');
    var free = document.getElementById('prod-type-free');
    if (sel) {
      var opt = Array.from(sel.options).some(function(o){ return o.value === (p.type||''); });
      if (opt) {
        sel.value = p.type || '';
        if (free) free.value = '';
      } else {
        sel.value = '';
        if (free) free.value = p.type || '';
      }
    } else {
      var old = document.getElementById('prod-type'); if (old) old.value = p.type || '';
    }
  document.getElementById('prod-image').value = p.image || '';
  document.getElementById('prod-desc').value = p.description || '';
  var specs = p.specs || {};
  var elCase = document.getElementById('prod-spec-case'); if (elCase) elCase.value = specs.caseMaterial || '';
  var elWater = document.getElementById('prod-spec-water'); if (elWater) elWater.value = specs.waterResistance || '';
  var elMove = document.getElementById('prod-spec-movement'); if (elMove) elMove.value = specs.movement || '';
  var elGender = document.getElementById('prod-spec-gender'); if (elGender) elGender.value = specs.gender || '';
  var priceEl = document.getElementById('prod-price'); if (priceEl) priceEl.value = p.price || '';
    document.getElementById('form-title').textContent = 'Sửa sản phẩm';
  }

  function deleteProduct(id) {
    const list = getProducts().filter(p => p.id !== id);
    saveProducts(list);
  }

  function toggleHidden(id) {
    const prods = getProducts();
    const idx = prods.findIndex(p => p.id === id);
    if (idx === -1) return;
    prods[idx].hidden = !prods[idx].hidden;
    saveProducts(prods);
  }

  window.resetForm = function () {
    ['prod-id', 'prod-code', 'prod-name', 'prod-image', 'prod-desc'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    var sel = document.getElementById('prod-type-select'); if (sel) sel.value = '';
    var free = document.getElementById('prod-type-free'); if (free) free.value = '';
    var old = document.getElementById('prod-type'); if (old) old.value = '';
    var s1 = document.getElementById('prod-spec-case'); if (s1) s1.value = '';
    var s2 = document.getElementById('prod-spec-water'); if (s2) s2.value = '';
    var s3 = document.getElementById('prod-spec-movement'); if (s3) s3.value = '';
    var s4 = document.getElementById('prod-spec-gender'); if (s4) s4.value = '';
    var priceEl = document.getElementById('prod-price'); if (priceEl) priceEl.value = '';
    document.getElementById('form-title').textContent = 'Thêm sản phẩm';
  };

  document.addEventListener('DOMContentLoaded', function(){
    populateTypeSelect();
    renderProductList();
  });
})();
