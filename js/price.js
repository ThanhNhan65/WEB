'use strict';

/* ===============================
   QUẢN LÝ GIÁ BÁN SẢN PHẨM
   =============================== */

// ======= Key LocalStorage =======
const PRODUCTS_KEY = 'app_products';
const PROFIT_KEY   = 'app_profit'; // lưu % lợi nhuận theo loại

// ======= Hàm đọc & ghi LocalStorage =======
function getAllProducts(){
    var raw = localStorage.getItem(PRODUCTS_KEY);
    if(!raw) return [];
    return JSON.parse(raw);
}

function saveProducts(list){
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list || []));
}

function getProfitRates(){
    var raw = localStorage.getItem(PROFIT_KEY);
    if(!raw) return {};
    return JSON.parse(raw);
}

function saveProfitRates(obj){
    localStorage.setItem(PROFIT_KEY, JSON.stringify(obj || {}));
}

// ======= Hàm đồng bộ & khởi tạo =======
function syncProductsFromMain(){
    var raw = localStorage.getItem(PRODUCTS_KEY);
    if(!raw) return;
    var products = JSON.parse(raw);
    for(var i=0; i<products.length; i++){
        products[i].price = Number(products[i].price) || 0;
    }
    saveProducts(products);
}

function initPriceManager(){
    syncProductsFromMain();
    renderCategoryPricing();
    renderProductPricing();
    showPricingTab('category');
}

// run on load
document.addEventListener('DOMContentLoaded', initPriceManager);

// ======= Lắng nghe thay đổi realtime =======
window.addEventListener('storage', function(e){
    if(e.key === PRODUCTS_KEY){
        console.log('⚡ Dữ liệu sản phẩm thay đổi, cập nhật lại...');
        syncProductsFromMain();
        renderCategoryPricing();
        renderProductPricing();
    }
    if(e.key === 'watchTypes'){
        renderCategoryPricing();
        renderProductPricing();
    }
});

// listen for same-page updates from WatchTypeManager
document.addEventListener('watchTypesUpdated', function(){
    renderCategoryPricing();
    renderProductPricing();
});

// ======= Hiển thị tab =======
function showPricingTab(tab){
    var secs = document.querySelectorAll('.pricing-tab');
    for(var i=0;i<secs.length;i++){
        secs[i].style.display = 'none';
    }
    var active = document.getElementById('tab-'+tab);
    if(active) active.style.display = 'block';
}

// read watch types from localStorage (no try/catch per project style)
function getWatchTypesLocal(){
    var raw = localStorage.getItem('watchTypes');
    if(!raw) return [];
    return JSON.parse(raw);
}

// ======= 1️⃣ Theo LOẠI SẢN PHẨM =======
function renderCategoryPricing(){
    var list = getAllProducts();
    var profit = getProfitRates();
    var tbody = document.getElementById('category-tbody');
    if(!tbody) return;

    // Prefer canonical watchTypes if available
    var watchTypes = getWatchTypesLocal();
    var keys = [];
    if(watchTypes && watchTypes.length > 0){
        for(var wi=0; wi<watchTypes.length; wi++){
            var wt = watchTypes[wi];
            if(!wt || wt.hidden) continue;
            if(wt.name) keys.push(wt.name);
        }
    } else {
        // fallback: derive types from products (use type or brand)
        var typesMap = {};
        for(var i=0;i<list.length;i++){
            var p = list[i];
            var key = (p && p.type) ? p.type : (p && p.brand ? p.brand : null);
            if(key) typesMap[key] = true;
        }
        var tmp = Object.keys(typesMap);
        for(var tI=0;tI<tmp.length;tI++) keys.push(tmp[tI]);
    }

    var html = '';
    for(var k=0;k<keys.length;k++){
        var t = keys[k];
        var val = profit[t] || 0;
        html += "\n        <tr>\n            <td>"+t+"</td>\n            <td><input type=\"number\" id=\"profit_"+t+"\" value=\""+val+"\" min=\"0\" style=\"width:80px\"></td>\n            <td><button onclick=\"updateCategoryProfit('"+t+"')\">Lưu</button></td>\n        </tr>";
    }
    tbody.innerHTML = html;
}

function updateCategoryProfit(type){
    var profit = getProfitRates();
    var input = document.getElementById('profit_'+type);
    if(!input) return;
    profit[type] = Number(input.value) || 0;
    saveProfitRates(profit);
    alert('Đã lưu tỷ lệ lợi nhuận cho loại ' + type);
    renderProductPricing(); // cập nhật lại bảng sản phẩm
}

// ======= 2️⃣ Theo TỪNG SẢN PHẨM =======
function renderProductPricing(filterName, filterType){
    var list = getAllProducts();
    var profit = getProfitRates();
    var container = document.getElementById('product-list-pricing');
    if(!container) return;

    filterName = (filterName||'').trim().toLowerCase();
    filterType = filterType || '';

    var html = '';
    for(var i=0;i<list.length;i++){
        var p = list[i];
        if(!p) continue;
        if(filterType){
            var pType = (p && p.type) ? p.type : (p && p.brand ? p.brand : '');
            if(pType !== filterType) continue;
        }
        if(filterName && !( (p.name||'').toLowerCase().indexOf(filterName) !== -1 )) continue;
        var pTypeKey = (p && p.type) ? p.type : (p && p.brand ? p.brand : '');
        var catProfit = profit[pTypeKey] || 0;
        var custom = (p.customProfit != null && p.customProfit !== undefined) ? p.customProfit : catProfit;
        var sell = Number(p.price || 0) * (1 + custom/100);
        html += "\n        <div class=\"product-item\">\n            <div class=\"col\">"+p.name+"</div>\n            <div class=\"col\">"+Number(p.price||0).toLocaleString()+"đ</div>\n            <div class=\"col\"><input type=\"number\" id=\"custom_"+p.id+"\" value=\""+custom+"\" min=\"0\" style=\"width:70px\"></div>\n            <div class=\"col\">"+sell.toLocaleString()+"đ</div>\n            <div class=\"col\"><button onclick=\"saveProductProfit('"+p.id+"')\">Lưu</button></div>\n        </div>";
    }
    container.innerHTML = html;
}

function filterByName(){
    var q = (document.getElementById('search-product')||{}).value || '';
    var b = (document.getElementById('filter-type')||{}).value || '';
    renderProductPricing(q, b);
}

function filterProducts(){
    filterByName();
}

function tracuu(){
    var q = (document.getElementById('lookup-input')||{}).value || '';
    var res = document.getElementById('lookup-result');
    if(!res) return;
    q = q.trim().toLowerCase();
    if(!q){ res.innerHTML = '<div>Vui lòng nhập tên sản phẩm để tra cứu.</div>'; return; }
    var list = getAllProducts();
    var profit = getProfitRates();
    var matches = [];
    for(var i=0;i<list.length;i++){
        var p = list[i];
        if(!p) continue;
        if((p.name||'').toLowerCase().indexOf(q) !== -1) matches.push(p);
    }
    if(matches.length === 0){ res.innerHTML = '<div>Không tìm thấy sản phẩm.</div>'; return; }
    var html = '<ul style="list-style:none;padding-left:0">';
    for(var j=0;j<matches.length;j++){
        var p = matches[j];
        var pTypeKey = (p && p.type) ? p.type : (p && p.brand ? p.brand : '');
        var catProfit = profit[pTypeKey] || 0;
        var custom = (p.customProfit != null && p.customProfit !== undefined) ? p.customProfit : catProfit;
        var cost = Number(p.price||0);
        var sell = Math.round(cost * (1 + custom/100));
        html += '<li style="margin-bottom:8px;padding:8px;border:1px solid #eee;border-radius:6px;"><strong>'+p.name+'</strong> — Giá vốn: '+cost.toLocaleString()+'đ • %Lợi: '+custom+'% • Giá bán: <b>'+sell.toLocaleString()+'đ</b></li>';
    }
    html += '</ul>';
    res.innerHTML = html;
}

function saveProductProfit(id){
    var list = getAllProducts();
    for(var i=0; i<list.length; i++){
        if(list[i].id === id){
            var input = document.getElementById('custom_'+id);
            var val = Number(input.value) || 0;
            list[i].customProfit = val;
            saveProducts(list);
            alert('Đã cập nhật % lợi nhuận cho sản phẩm ' + list[i].name);
            renderProductPricing();
            return;
        }
    }
}
