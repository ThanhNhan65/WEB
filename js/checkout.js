(function(){
  function isCheckoutPage(){
    return window.location.pathname.endsWith('thanhtoan.html');
  }
  if(!isCheckoutPage()) return;

  function getUid(){ try{ return (typeof getCurrentUserId==='function')? getCurrentUserId(): null; }catch(e){ return null; } }
  function addrKey(){ var uid = getUid(); return uid ? ('app_addresses_' + uid) : null; }
  function loadAddresses(){
    var key = addrKey();
    if(!key) return [];
    try{ return JSON.parse(localStorage.getItem(key)||'[]'); }catch(e){ return []; }
  }
  function saveAddresses(arr){ var key = addrKey(); if(key) localStorage.setItem(key, JSON.stringify(arr||[])); }

  function ensureSeedFromProfile(){
    var list = loadAddresses();
    if(list.length) return;
    if(typeof getCurrentUser==='function'){
      var user = getCurrentUser();
      if(user && user.address){ list.push(user.address); }
      if(list.length) saveAddresses(list);
    }
  }

  function renderSavedAddresses(){
    var host = document.getElementById('saved-addresses');
    if(!host) return;
    ensureSeedFromProfile();
    var addrs = loadAddresses();
    addrs = addrs.map(function(addr){
      var parts = addr.split(' - ');
      return (parts.length >= 3) ? parts.slice(2).join(' - ') : addr;
    });
    host.innerHTML = '';
    if(!addrs.length){ host.style.display='none'; return; }
    host.style.display='block';
    var listDiv = document.createElement('div');
    listDiv.className = 'address-list';
    for(var i=0;i<addrs.length;i++){
      var row = document.createElement('div');
      row.innerHTML = '<label><input type="radio" name="ship_address_select" value="'+ addrs[i].replace(/"/g,'&quot;') +'" '+ (i===0?'checked':'') +'> <span>'+ addrs[i] +'</span></label>';
      listDiv.appendChild(row);
    }
    host.appendChild(listDiv);
  }

  function setupAddressOptionToggle(){
    var radios = document.querySelectorAll('input[name="address_option"]');
    var saved = document.getElementById('saved-addresses');
    var defBox = document.getElementById('default-address-box');
    var newFields = document.getElementById('new-address-fields');
    function apply(){
      var val = (document.querySelector('input[name="address_option"]:checked')||{}).value || 'default';
      if(val==='default'){
        if(saved) saved.style.display='block';
        if(defBox) defBox.style.display='block';
        if(newFields) newFields.style.display='none';
      } else {
        if(saved) saved.style.display='none';
        if(defBox) defBox.style.display='none';
        if(newFields) newFields.style.display='block';
      }
    }
    radios.forEach(function(r){ r.addEventListener('change', apply); });
    apply();
  }

  function setupPaymentToggle(){
    var sel = document.getElementById('payment_method');
    var cardPanel = document.querySelector('.card-panel');
    function apply(){
      var v = sel ? sel.value : 'cod';
      if(cardPanel){ cardPanel.style.display = (v==='card') ? 'block' : 'none'; }
    }
    if(sel){ sel.addEventListener('change', apply); apply(); }
  }

  function styleTotalRed(){
    var total = document.getElementById('order-total');
    if(total){ total.style.color = '#d32f2f'; total.style.fontWeight='700'; }
  }

  document.addEventListener('DOMContentLoaded', function(){
    renderSavedAddresses();
    setupAddressOptionToggle();
    setupPaymentToggle();
    styleTotalRed();
  });
})();


