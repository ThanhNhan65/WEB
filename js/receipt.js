(function(){
  const ORDER_PREFIX = 'app_orders'; // đọc trực tiếp từ key của người dùng
  // per-order save (no global pending changes)

  function getAllOrders(){
    const allKeys = Object.keys(localStorage);
    let allOrders = [];

    for (let k of allKeys){
      if (k.startsWith(ORDER_PREFIX)){
        try {
          const orders = JSON.parse(localStorage.getItem(k)) || [];
          orders.forEach(o => {
            // thêm userId vào mỗi đơn (cắt phần đuôi key)
            o.userId = k.replace(ORDER_PREFIX, '');
            allOrders.push(o);
          });
        } catch(e){ /* bỏ qua key hỏng */ }
      }
    }
    return allOrders;
  }

  function normalizeStatus(s){
    if(!s) return '';
    const t = (''+s).toLowerCase();
    if (t.includes('mới')) return 'new';
    if (t.includes('xử lý')) return 'processing';
    if (t.includes('giao')) return 'shipped';
    if (t.includes('hủy') || t.includes('huy')) return 'cancelled';
    // map common english/short statuses from checkout module
    if (t === 'pending') return 'new';
    if (t === 'success' || t === 'paid') return 'shipped';
    if (t === 'cancel') return 'cancelled';
    if (['new','processing','shipped','cancelled'].includes(t)) return t;
    return t;
  }

  function getFilters(){
    const fromEl = document.getElementById('filter-date-from');
    const toEl = document.getElementById('filter-date-to');
    const stEl = document.getElementById('filter-receipt-status');
    const qEl = document.getElementById('filter-receipt-q');
    return {
      from: fromEl && fromEl.value ? new Date(fromEl.value) : null,
      to: toEl && toEl.value ? new Date(toEl.value) : null,
      status: stEl ? stEl.value : '',
      q: qEl ? qEl.value.trim().toLowerCase() : ''
    };
  }

  function applyFilters(list){
    const {from, to, status, q} = getFilters();
    return list.filter(r => {
      // date filter
      let pass = true;
      if (from || to){
        const d = r.date ? new Date(r.date) : (r.createdAt ? new Date(r.createdAt) : null);
        if (from && (!d || d < from)) pass = false;
        if (to){
          // include day end
          const end = new Date(to); end.setHours(23,59,59,999);
          if (!d || d > end) pass = false;
        }
      }

      if (!pass) return false;

      // status filter
      if (status){
        const ns = normalizeStatus(r.status);
        if (ns !== status) return false;
      }

      // query filter
      if (q){
        const id = (r.id || '').toLowerCase();
        const cust = (r.customerName || r.customer || '').toLowerCase();
        const uid = (r.userId || '').toLowerCase();
        if (!id.includes(q) && !cust.includes(q) && !uid.includes(q)) return false;
      }

      return true;
    });
  }

  function renderReceipts(){
    const tbody = document.getElementById('receipt-tbody');
    const countEl = document.getElementById('receipt-count');
  // summary removed per request
  if (!tbody) return;
    const all = getAllOrders();
    const list = applyFilters(all);
    tbody.innerHTML = '';

  if (countEl) countEl.textContent = String(list.length);

    if (list.length === 0){
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="5" style="text-align:center;">Không có đơn hàng nào</td>';
      tbody.appendChild(tr);
      return;
    }

    list.forEach((r) => {
      const tr = document.createElement('tr');
      const ns = normalizeStatus(r.status);
      const badgeClass = mapStatusToBadgeClass(ns);
      tr.innerHTML = `
        <td>${r.id || '(không có mã)'}</td>
        <td>${formatDateCell(r.date || r.createdAt)}</td>
        <td>${formatCurrency(Number(r.total || 0))}</td>
        <td><span class="order-badge ${badgeClass}">${renderStatus(r.status)}</span></td>
        <td>${renderStatusControl(r.id, r.status)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function mapStatusToBadgeClass(ns){
    if(!ns) return '';
    if (ns === 'new') return 'pending';
    if (ns === 'processing') return 'processing';
    if (ns === 'shipped') return 'success';
    if (ns === 'cancelled') return 'cancel';
    return ns;
  }

  function renderStatus(s){
    const ns = normalizeStatus(s);
    switch(ns){
      case 'new': return 'Mới đặt';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return s || '';
    }
  }

  function formatCurrency(v){
    const n = isNaN(v) ? 0 : Number(v);
    return n.toLocaleString('vi-VN') + '₫';
  }

  function formatDateCell(s){
    if (!s) return '';
    const d = new Date(s);
    if (!isNaN(d.getTime())){
      const dd = String(d.getDate()).padStart(2,'0');
      const mm = String(d.getMonth()+1).padStart(2,'0');
      const yy = d.getFullYear();
      return `${dd}/${mm}/${yy}`;
    }
    return s; // giữ nguyên nếu không parse được
  }

  function renderStatusControl(orderId, s){
    const ns = normalizeStatus(s) || '';
    return `
      <select data-oid="${orderId || ''}" onchange="saveSingleOrderStatus(this.getAttribute('data-oid'), this.value)">
        <option value="new" ${ns==='new'?'selected':''}>Mới đặt</option>
        <option value="processing" ${ns==='processing'?'selected':''}>Đang xử lý</option>
        <option value="shipped" ${ns==='shipped'?'selected':''}>Đã giao</option>
        <option value="cancelled" ${ns==='cancelled'?'selected':''}>Đã hủy</option>
      </select>
    `;
  }

  function saveSingleOrderStatus(orderId, adminStatus){
    if(!orderId) return;
    const keys = Object.keys(localStorage).filter(k => k.startsWith(ORDER_PREFIX));
    let updated = false;
    for (let k of keys){
      const arr = JSON.parse(localStorage.getItem(k) || '[]');
      for (let i=0;i<arr.length;i++){
        if (arr[i] && arr[i].id === orderId){
          // map admin status -> checkout/user-facing status values
          let saveStatus = adminStatus;
          if (adminStatus === 'new') saveStatus = 'pending';
          else if (adminStatus === 'shipped') saveStatus = 'success';
          else if (adminStatus === 'cancelled') saveStatus = 'cancel';
          else if (adminStatus === 'processing') saveStatus = 'processing';
          arr[i].status = saveStatus;
          localStorage.setItem(k, JSON.stringify(arr));
          updated = true;
          console.log('Saved status for order', orderId, 'in key', k, '->', saveStatus);
          break;
        }
      }
      if (updated) break;
    }
    if (updated){
      renderReceipts();
      try{ alert('Đã lưu trạng thái cho đơn ' + orderId); }catch(e){}
    } else {
      try{ alert('Không tìm thấy đơn để lưu: ' + orderId); }catch(e){}
    }
  }

  // buildFilterSummary removed (không hiển thị dòng tóm tắt nữa)

  // public APIs used by HTML inline handlers
  function filterReceipts(){ renderReceipts(); }
  function refreshReceipts(){ renderReceipts(); }

  // expose
  window.filterReceipts = filterReceipts;
  window.refreshReceipts = refreshReceipts;
  window.saveSingleOrderStatus = saveSingleOrderStatus;

  // init on load
  document.addEventListener('DOMContentLoaded', renderReceipts);
})();
