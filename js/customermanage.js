// Customer management for admin
function renderCustomers(list) {
    if (!list) {
        const u = (typeof loadUsersLS === 'function') ? loadUsersLS() : [];
        list = (u || []).map(x => ({
            id: x.id,
            name: x.name || 'Người dùng',
            phone: x.phone || '',
            email: x.email || '',
            address: x.address || '',
            locked: !!x.locked
        }));
    }
    const tbody = document.getElementById('customer-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    list.forEach((c) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td>${c.address}</td>
            <td>${c.locked ? '<span class="status-badge locked">Đã khóa</span>' : '<span class="status-badge active">Hoạt động</span>'}</td>
            <td>
                <button onclick="adminResetPassword('${c.id}')">Reset mật khẩu</button>
                <button onclick="adminToggleLock('${c.id}')">${c.locked ? 'Mở khóa' : 'Khóa'}</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    try{
        var cntEl = document.getElementById('customer-count');
        if (cntEl) cntEl.textContent = (list && list.length) || (adminLoadUsers()||[]).length || 0;
    }catch(e){}
}

function adminSaveUsers(users){
    if (typeof _lsSet === 'function') {
        _lsSet('app_users', users || []);
    } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app_users', JSON.stringify(users || []));
    }
    try { localStorage.setItem('app_users_last_update', String(Date.now())); } catch(e){}
}

function adminLoadUsers(){
    if (typeof _lsGet === 'function') return _lsGet('app_users','[]') || [];
    try { return JSON.parse(localStorage.getItem('app_users')||'[]'); } catch(e){ return []; }
}

function adminResetPassword(userId){
    const users = adminLoadUsers();
    const idx = users.findIndex(u => String(u.id) === String(userId));
    if (idx === -1) { alert('Không tìm thấy người dùng'); return; }
    if (!confirm('Bạn có chắc chắn muốn đặt lại mật khẩu của người dùng này về 123456?')) return;
    users[idx].password = '123456';
    adminSaveUsers(users);
    alert('Đã đặt lại mật khẩu về 123456');
    renderCustomers();
}

function adminToggleLock(userId){
    const users = adminLoadUsers();
    const idx = users.findIndex(u => String(u.id) === String(userId));
    if (idx === -1) { alert('Không tìm thấy người dùng'); return; }
    const newLocked = !users[idx].locked;
    const msg = newLocked ? 'Bạn có chắc muốn khóa tài khoản này?' : 'Bạn có chắc muốn mở khóa tài khoản này?';
    if (!confirm(msg)) return;
    users[idx].locked = newLocked;
    adminSaveUsers(users);
    renderCustomers();
}

function filterCustomers(){
    const keyword = (document.getElementById('search-customer')||{}).value || '';
    const kw = keyword.trim().toLowerCase();
    const users = adminLoadUsers();
    const list = users.filter(u => {
        const name = (u.name||'').toLowerCase();
        const phone = (u.phone||'').toLowerCase();
        const email = (u.email||'').toLowerCase();
        return name.includes(kw) || phone.includes(kw) || email.includes(kw);
    }).map(u => ({
        id: u.id,
        name: u.name||'',
        phone: u.phone||'',
        email: u.email||'',
        address: u.address||'',
        locked: !!u.locked
    }));
    renderCustomers(list);
}

window.addEventListener('storage', function(e){
    if (!e) return;
    if (e.key === 'app_users' || e.key === 'app_users_last_update'){
        try{ renderCustomers(); } catch(err){}
    }
});

function adminFixDuplicateUserIds(){
    const users = adminLoadUsers() || [];
    const seen = new Set();
    let maxId = Number(localStorage.getItem('last_user_id') || 0);
    users.forEach(u => { const n = Number(u.id) || 0; if (n > maxId) maxId = n; });

    let changed = false;
    for (let i = 0; i < users.length; i++){
        const idStr = String(users[i].id);
        if (seen.has(idStr)){
            maxId++;
            const oldId = users[i].id;
            users[i].id = String(maxId);
            try{
                var oldOrdersKey = 'app_orders' + oldId;
                var newOrdersKey = 'app_orders' + users[i].id;
                var od = localStorage.getItem(oldOrdersKey);
                if (od !== null) {
                    localStorage.setItem(newOrdersKey, od);
                    localStorage.removeItem(oldOrdersKey);
                }
            }catch(e){}
            changed = true;
        } else {
            seen.add(idStr);
        }
    }

    if (changed){
        localStorage.setItem('last_user_id', String(maxId));
        adminSaveUsers(users);
        try{ renderCustomers(); } catch(e){}
        alert('Đã sửa id trùng lặp và cập nhật last_user_id = ' + maxId);
    } else {
        alert('Không tìm thấy id trùng lặp.');
    }
}

function adminRefreshUsers(){
    try{
        var users = adminLoadUsers() || [];
        var list = users.map(u => ({
            id: u.id,
            name: u.name || 'Người dùng',
            phone: u.phone || '',
            email: u.email || '',
            address: u.address || '',
            locked: !!u.locked
        }));
        renderCustomers(list);
    }catch(e){ console.warn('Refresh users failed', e); }
}

document.addEventListener('DOMContentLoaded', function(){
    var btn = document.getElementById('btnRefreshUsers');
    if (btn) btn.addEventListener('click', function(e){ adminRefreshUsers(); });
    var bf = document.getElementById('btnFixIds');
    if (bf) bf.addEventListener('click', function(e){ if(confirm('Sửa id trùng lặp? Nên backup localStorage trước.')) adminFixDuplicateUserIds(); });
    try{ var cntEl = document.getElementById('customer-count'); if (cntEl) cntEl.textContent = (adminLoadUsers()||[]).length; }catch(e){}
});
