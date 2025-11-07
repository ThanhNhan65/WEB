const IMPORTS_KEY = 'imports_list_v1';
const RECEIPT_KEY = 'app_receipts';
const INV_THRESHOLD_KEY = 'inv_low_threshold_v1';

document.addEventListener('DOMContentLoaded', function(){
    initInventoryManager();
});

// ====== localStorage helpers ======
function isBalancedJson(s){
    var stack = [];
    for(var i = 0; i < s.length; i++){
        var ch = s.charAt(i);
        if(ch === '{' || ch === '[') stack.push(ch);
        else if(ch === '}'){ if(stack.length === 0 || stack.pop() !== '{') return false; }
        else if(ch === ']'){ if(stack.length === 0 || stack.pop() !== '[') return false; }
    }
    return stack.length === 0;
}
function getLS(key, def){
    var raw = localStorage.getItem(key);
    if(!raw) return def;
    var s = raw.trim();
    var ok = ((s.charAt(0) === '{' && s.charAt(s.length-1) === '}') ||
             (s.charAt(0) === '[' && s.charAt(s.length-1) === ']')) &&
             isBalancedJson(s);
    if(!ok){
        localStorage.setItem(key, JSON.stringify(def));
        return def;
    }
    return JSON.parse(raw);
}
function setLS(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

// ====== Init ======
function initInventoryManager(){
    window.importsKey = IMPORTS_KEY;
    var btnShowAll = document.getElementById('btnShowAll');
    if(btnShowAll) btnShowAll.addEventListener('click', ()=> renderInventoryTable());

    var btnLowStock = document.getElementById('btnLowStock');
    if(btnLowStock) btnLowStock.addEventListener('click', ()=> renderLowStock());

    var btnSaveThreshold = document.getElementById('btnSaveThreshold');
    if(btnSaveThreshold) btnSaveThreshold.addEventListener('click', saveThreshold);

    var btnApply = document.getElementById('btnApplyFilter');
    if(btnApply) btnApply.addEventListener('click', renderInventoryTable);

    var btnReset = document.getElementById('btnResetFilter');
    if(btnReset) btnReset.addEventListener('click', function(){
        var el = document.getElementById('invTypeFilter'); if(el) el.value='';
        var s = document.getElementById('invSearch'); if(s) s.value='';
        renderInventoryTable();
    });

    var btnPoint = document.getElementById('btnPointLookup');
    if(btnPoint) btnPoint.addEventListener('click', pointLookup);

    var btnPeriod = document.getElementById('btnPeriodLookup');
    if(btnPeriod) btnPeriod.addEventListener('click', periodLookup);

    populateProductSelects();
    renderInventoryTable();
}

// ====== Populate selects ======
function populateProductSelects(){
    var products = getAllProducts();
    var selIds = ['pointProduct','periodProduct'];
    for(var si = 0; si < selIds.length; si++){
        var id = selIds[si];
        var sel = document.getElementById(id);
        if(!sel) continue;
        sel.innerHTML = '<option value="">--Bỏ qua--</option>';
        for(var i = 0; i < products.length; i++){
            var p = products[i];
            if(!p) continue;
            var o = document.createElement('option');
            o.value = p.id;
            o.textContent = p.name;
            sel.appendChild(o);
        }
    }
}

// ====== Tính tồn kho đến thời điểm ======
function computeStockUpTo(productId, atTime){
    var imports = getLS(IMPORTS_KEY, []);
    var receipts = getLS(RECEIPT_KEY, []);
    var products = getAllProducts();
    var prod = null;
    for(var i = 0; i < products.length; i++){
        if(products[i].id === productId){
            prod = products[i];
            break;
        }
    }
    if(!prod) prod = {};
    var baseStock = Number(prod.initialStock || prod.stock || prod.qty || 0) || 0;
    var inQty = 0, outQty = 0;

    // ==== Cộng nhập ====
    for(var i = 0; i < imports.length; i++){
        var im = imports[i];
        var d = new Date(im.date);
        if(atTime && d > atTime) continue;
        var items = im.items || [];
        for(var j = 0; j < items.length; j++){
            var it = items[j];
            if(it.code === productId || it.name === productId){
                inQty += Number(it.qty) || 0;
            }
        }
    }

    // ==== Trừ xuất ====
    for(var r = 0; r < receipts.length; r++){
        var rc = receipts[r];
        var d2 = new Date(rc.date);
        if(atTime && d2 > atTime) continue;
        var ritems = rc.items || [];
        for(var k = 0; k < ritems.length; k++){
            var it2 = ritems[k];
            if(it2.code === productId || it2.name === productId){
                outQty += Number(it2.qty) || 0;
            }
        }
    }

    return (baseStock + inQty - outQty);
}

// ====== Hiển thị tồn kho ======
function renderInventoryTable(){
    var body = document.getElementById('invTableBody');
    if(!body) return;

    var typeFilter = document.getElementById('invTypeFilter') ? document.getElementById('invTypeFilter').value : '';
    var q = document.getElementById('invSearch') ? document.getElementById('invSearch').value.toLowerCase() : '';

    var products = getAllProducts();
    var rows = [];

    for(var i = 0; i < products.length; i++){
        var p = products[i];
        if(!p) continue;
        var pType = p.type ? p.type : (p.brand ? p.brand : '');
        if(typeFilter && pType && pType.toLowerCase() !== typeFilter.toLowerCase()) continue;
        if(q && (!p.name || !p.name.toLowerCase().includes(q))) continue;

        var stock = computeStockUpTo(p.id, null);
        var threshold = getLS(INV_THRESHOLD_KEY, 5);
        var status = (stock <= 0) ? 'Hết' : (stock < threshold ? 'Sắp hết' : 'Còn');
        rows.push({ code: p.id, name: p.name, type: pType, unit: 'cái', stock: stock, status: status });
    }

    body.innerHTML = '';
    if(rows.length === 0){
        body.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#777">Không có sản phẩm</td></tr>';
        return;
    }

    for(var ri = 0; ri < rows.length; ri++){
        var r = rows[ri];
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + r.code + '</td><td>' + r.name + '</td><td>' + (r.type||'') + '</td><td>' + r.unit + '</td><td>' + r.stock + '</td><td>' + r.status + '</td>';
        body.appendChild(tr);
    }

    syncProductStocks();
}

// ====== Lưu ngưỡng cảnh báo ======
function saveThreshold(){
    var v = Number(document.getElementById('lowThreshold').value) || 5;
    setLS(INV_THRESHOLD_KEY, v);
    var el = document.getElementById('thresholdSaved');
    if(el){
        el.style.display = '';
        setTimeout(()=> el.style.display='none', 1500);
    }
}

// ====== Hiển thị hàng sắp hết ======
function renderLowStock(){
    var body = document.getElementById('invTableBody');
    if(!body) return;
    var threshold = getLS(INV_THRESHOLD_KEY, 5);
    var products = getAllProducts();
    var rows = [];
    for(var i = 0; i < products.length; i++){
        var p = products[i];
        if(!p) continue;
        var s = computeStockUpTo(p.id, null);
        if(s <= threshold){
            rows.push({code:p.id,name:p.name,type:(p.type||p.brand||''),stock:s});
        }
    }
    body.innerHTML = '';
    if(rows.length === 0){
        body.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#777">Không có sản phẩm sắp hết</td></tr>';
        return;
    }
    for(var ri = 0; ri < rows.length; ri++){
        var r = rows[ri];
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + r.code + '</td><td>' + r.name + '</td><td>' + (r.type||'') + '</td><td>cái</td><td>' + r.stock + '</td><td>Sắp hết</td>';
        body.appendChild(tr);
    }
}

// ====== Đồng bộ tồn kho vào danh mục ======
function syncProductStocks(){
    var prods = getAllProducts();
    if(!prods || prods.length === 0) return;
    var changed = false;
    for(var i = 0; i < prods.length; i++){
        var p = prods[i];
        if(!p) continue;
        var s = computeStockUpTo(p.id, null);
        if(p.currentStock !== s){ p.currentStock = s; changed = true; }
    }
    if(changed){
        try {
            localStorage.setItem('app_products', JSON.stringify(prods));
            var ev = new Event('productsUpdated');
            window.dispatchEvent(ev);
        } catch(e){}
    }
}

// ====== Tra cứu tồn tại thời điểm ======
function pointLookup(){
    var pid = document.getElementById('pointProduct') ? document.getElementById('pointProduct').value : '';
    var type = document.getElementById('pointType') ? document.getElementById('pointType').value : '';
    var time = document.getElementById('pointTime') ? document.getElementById('pointTime').value : '';
    var out = document.getElementById('pointResult');
    if(!out) return;
    out.innerHTML = '';

    var at = time ? new Date(time) : new Date();
    if(pid){
        var s = computeStockUpTo(pid, at);
        out.innerHTML = 'Tồn tại sản phẩm ' + pid + ' tại ' + at.toLocaleDateString() + ': <strong>' + s + '</strong>';
        return;
    }
    if(type){
        var prods = getAllProducts();
        var lines = [];
        for(var i = 0; i < prods.length; i++){
            var p = prods[i];
            if(!p) continue;
            var pType = p.type ? p.type : (p.brand ? p.brand : '');
            if(pType && pType.toLowerCase() === type.toLowerCase()){
                lines.push('<div>' + p.name + ': ' + computeStockUpTo(p.id, at) + '</div>');
            }
        }
        out.innerHTML = lines.join('');
        return;
    }
    out.innerHTML = 'Vui lòng chọn sản phẩm hoặc loại để tra cứu';
}

function periodLookup(){
    var pid = document.getElementById('periodProduct') ? document.getElementById('periodProduct').value : '';
    var type = document.getElementById('periodType') ? document.getElementById('periodType').value : '';
    var from = document.getElementById('periodFrom') ? document.getElementById('periodFrom').value : '';
    var to = document.getElementById('periodTo') ? document.getElementById('periodTo').value : '';
    var out = document.getElementById('periodResult');
    if(!out) return;
    out.innerHTML = '';

    if(!from || !to){
        out.innerHTML = 'Vui lòng chọn khoảng thời gian';
        return;
    }

    var f = new Date(from);
    var t = new Date(to);
    t.setHours(23,59,59,999);

    var imports = getLS(IMPORTS_KEY, []);
    var receipts = getLS(RECEIPT_KEY, []);
    var map = {};

    for(var i = 0; i < imports.length; i++){
        var im = imports[i];
        var d = new Date(im.date);
        if(d < f || d > t) continue;
        var items = im.items || [];
        for(var j = 0; j < items.length; j++){
            var it = items[j];
            if(pid && it.code !== pid) continue;
            if(type){
                var pType = getProductType(it.code);
                if(pType.toLowerCase() !== type.toLowerCase()) continue;
            }
            if(!map[it.code]) map[it.code] = {code: it.code, name: it.name, in:0, out:0};
            map[it.code].in += Number(it.qty)||0;
        }
    }
    for(var r = 0; r < receipts.length; r++){
        var rc = receipts[r];
        var d2 = new Date(rc.date);
        if(d2 < f || d2 > t) continue;
        var items2 = rc.items || [];
        for(var j = 0; j < items2.length; j++){
            var it = items2[j];
            if(pid && it.code !== pid) continue;
            if(type){
                var pType2 = getProductType(it.code);
                if(pType2.toLowerCase() !== type.toLowerCase()) continue;
            }
            if(!map[it.code]) map[it.code] = {code: it.code, name: it.name, in:0, out:0};
            map[it.code].out += Number(it.qty)||0;
        }
    }

    var lines = [];
    var keys = Object.keys(map);
    for(var m = 0; m < keys.length; m++){
        var k = keys[m];
        var e = map[k];
        var stock = computeStockUpTo(k, new Date());
        lines.push('<div style="margin-bottom:6px"><strong>' + (e.name || e.code) + '</strong> - Nhập: ' + e.in + ' | Xuất: ' + e.out + ' | Tồn hiện tại: ' + stock + '</div>');
    }
    out.innerHTML = lines.join('') || 'Không có dữ liệu trong khoảng thời gian';
}

function getProductType(code){
    var products = getAllProducts();
    for(var i = 0; i < products.length; i++){
        if(products[i].id === code){
            return products[i].type || products[i].brand || '';
        }
    }
    return '';
}

// ====== Update inventory from an order (public API) ======
// This records a sale receipt into RECEIPT_KEY and updates product stock
// Usage: window.updateInventoryFromOrder(order)
function updateInventoryFromOrder(order){
    if(!order) return;
    try{
        var receipts = getLS(RECEIPT_KEY, []);
        var rc = {
            id: 'rc_' + Date.now(),
            date: new Date().toISOString(),
            items: (order.items || []).map(function(it){
                return { code: (it.productId||it.code||it.id), name: it.name||it.productName||'', qty: Number(it.qty||0) };
            }),
            total: Number(order.total||0),
            type: 'sale',
            orderId: order.id || null
        };
        receipts.unshift(rc);
        setLS(RECEIPT_KEY, receipts);

        // Update products immediately for UI consistency (also kept for history via receipts)
        var prods = getAllProducts();
        if(prods && prods.length){
            for(var i = 0; i < rc.items.length; i++){
                var it = rc.items[i];
                for(var j = 0; j < prods.length; j++){
                    if(!prods[j]) continue;
                    if(prods[j].id === it.code){
                        var oldQty = Number(prods[j].stock || prods[j].qty || prods[j].initialStock || 0) || 0;
                        var newQty = oldQty - Number(it.qty || 0);
                        if(newQty < 0) newQty = 0;
                        if('stock' in prods[j]) prods[j].stock = newQty;
                        else if('qty' in prods[j]) prods[j].qty = newQty;
                        else prods[j].initialStock = newQty;
                        break;
                    }
                }
            }
            try{ localStorage.setItem('app_products', JSON.stringify(prods)); }catch(e){}
            try{ window.dispatchEvent(new Event('productsUpdated')); }catch(e){}
        }
    }catch(e){
        console.error('updateInventoryFromOrder error:', e);
    }
}

// expose for other scripts
window.updateInventoryFromOrder = updateInventoryFromOrder;

// ====== React to cross-tab/local updates ======
// When receipts or products change in another tab, refresh table (if present) else just sync stocks
window.addEventListener('storage', function(e){
    if(!e || !e.key) return;
    if(e.key === RECEIPT_KEY || e.key === 'app_products' || e.key === IMPORTS_KEY){
        if(document.getElementById('invTableBody')){
            renderInventoryTable();
        } else {
            syncProductStocks();
        }
    }
});

// Also listen to the custom productsUpdated event (dispatched after order placement)
window.addEventListener('productsUpdated', function(){
    if(document.getElementById('invTableBody')){
        renderInventoryTable();
    }
});
