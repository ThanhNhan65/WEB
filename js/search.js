
function setupHeaderSearch() {
  var searchInput = document.querySelector('.header .search input');
  var searchBtn = document.querySelector('.header .search-icon a');
  if (!searchInput || !searchBtn) return;
  searchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    var q = searchInput.value.trim();
    if (q) {
      window.location.href = 'products.html?q=' + encodeURIComponent(q);
    } else {
      window.location.href = 'products.html';
    }
  });
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var q = searchInput.value.trim();
      if (q) {
        window.location.href = 'products.html?q=' + encodeURIComponent(q);
      } else {
        window.location.href = 'products.html';
      }
    }
  });
}

function setupAdvancedSearch() {
  var form = document.getElementById('search-form');
  if (!form) return;
  var qInput = document.getElementById('q');
  var typeInput = document.getElementById('type');
  var priceMinInput = document.getElementById('priceMin');
  var priceMaxInput = document.getElementById('priceMax');
  var btn = document.getElementById('btnSearch');

  function doSearch() {
    var params = [];
    if (qInput && qInput.value.trim()) 
        params.push('q=' + encodeURIComponent(qInput.value.trim()));
    if (typeInput && typeInput.value) 
        params.push('type=' + encodeURIComponent(typeInput.value));
    if (priceMinInput && priceMinInput.value) 
        params.push('priceMin=' + encodeURIComponent(priceMinInput.value));
    if (priceMaxInput && priceMaxInput.value) 
        params.push('priceMax=' + encodeURIComponent(priceMaxInput.value));
    var url = 'products.html';
    if (params.length) url += '?' + params.join('&');
    window.location.href = url;
  }

  if (btn) btn.onclick = doSearch;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    doSearch();
  });
}

function filterProductsByQuery(products) {
  var params = new URLSearchParams(window.location.search);
  var q = params.get('q') ? params.get('q').toLowerCase() : '';
  var type = params.get('type') || '';
  var priceMin = parseInt(params.get('priceMin') || '0', 10);
  var priceMax = parseInt(params.get('priceMax') || '0', 10);
  return products.filter(function(p) {
    var match = true;
    if (q && !(p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)))) match = false;
    if (type && p.type !== type) match = false;
    if (priceMin && p.price < priceMin) match = false;
    if (priceMax && p.price > priceMax) match = false;
    return match;
  });
}

function initSearchFeatures() {
  setupHeaderSearch();
  setupAdvancedSearch();
  var params = new URLSearchParams(window.location.search);
  var q = params.get('q') || '';
  var type = params.get('type') || '';
  var priceMin = params.get('priceMin') || '';
  var priceMax = params.get('priceMax') || '';
  var qInput = document.getElementById('q');
  var typeInput = document.getElementById('type');
  var priceMinInput = document.getElementById('priceMin');
  var priceMaxInput = document.getElementById('priceMax');
  if (qInput) 
    qInput.value = q;
  if (typeInput) 
    typeInput.value = type;
  if (priceMinInput) 
    priceMinInput.value = priceMin;
  if (priceMaxInput) 
    priceMaxInput.value = priceMax;
}

document.addEventListener('DOMContentLoaded', initSearchFeatures);
