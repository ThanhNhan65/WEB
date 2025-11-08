
document.addEventListener('DOMContentLoaded', function(){
	initImportManager();
});

const STORAGE_KEY = 'imports_list_v1';

function initImportManager(){
	// Wire buttons in admin.html
	const btnNew = document.querySelector('button[onclick="importNew()"]');
	if(btnNew) btnNew.addEventListener('click', importNew);

	const btnFilter = document.querySelector('button[onclick="importFilter()"]');
	if(btnFilter) btnFilter.addEventListener('click', importFilter);

	// Also render initial list
	renderImportList();
}

function loadImports(){
	const raw = localStorage.getItem(STORAGE_KEY);
	if(!raw) return [];
	return JSON.parse(raw);
}

function saveImports(list){
	localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function generateCode(){
	const ts = Date.now().toString();
	return 'PN' + ts.slice(-6);
}

function formatDate(d){
	if(!d) return '';
	const dd = new Date(d);
	if(isNaN(dd)) return d;
	return dd.toLocaleDateString();
}

function importFilter(){
	const from = document.getElementById('imp-from').value;
	const to = document.getElementById('imp-to').value;
	renderImportList(from, to);
}

function renderImportList(filterFrom, filterTo){
	const tbody = document.getElementById('import-tbody');
	if(!tbody) return;
	const list = loadImports();

	let filtered = list.slice();
	if(filterFrom){
		const f = new Date(filterFrom);
		filtered = filtered.filter(it => new Date(it.date) >= f);
	}
	if(filterTo){
		const t = new Date(filterTo);
		// include the whole day
		t.setHours(23,59,59,999);
		filtered = filtered.filter(it => new Date(it.date) <= t);
	}

	// Sort newest first
	filtered.sort((a,b)=> new Date(b.date) - new Date(a.date));

	tbody.innerHTML = '';
	if(filtered.length === 0){
		const tr = document.createElement('tr');
		tr.innerHTML = '<td colspan="5" style="text-align:center;color:#777">Không có phiếu nhập nào</td>';
		tbody.appendChild(tr);
		return;
	}

	filtered.forEach(imp => {
		const tr = document.createElement('tr');
		const lines = (imp.items && imp.items.length) ? imp.items.length : 0;
		const total = (imp.items||[]).reduce((s,i)=> s + (Number(i.price)||0) * (Number(i.qty)||0), 0);
		tr.innerHTML = `
			<td>${imp.code || imp.id}</td>
			<td>${formatDate(imp.date)}</td>
			<td>${imp.status || 'pending'}</td>
			<td>${lines}</td>
			<td class="actions"></td>
		`;

		const actions = tr.querySelector('.actions');

		const btnView = document.createElement('button');
		btnView.textContent = 'Xem';
		btnView.className = 'btn small';
		btnView.addEventListener('click', ()=> viewImport(imp.id));
		actions.appendChild(btnView);

		if(imp.status !== 'completed'){
			const btnEdit = document.createElement('button');
			btnEdit.textContent = 'Sửa';
			btnEdit.className = 'btn small';
			btnEdit.style.marginLeft = '6px';
			btnEdit.addEventListener('click', ()=> editImport(imp.id));
			actions.appendChild(btnEdit);

			const btnComplete = document.createElement('button');
			btnComplete.textContent = 'Hoàn thành';
			btnComplete.className = 'btn warn small';
			btnComplete.style.marginLeft = '6px';
			btnComplete.addEventListener('click', ()=> completeImport(imp.id));
			actions.appendChild(btnComplete);
		}

		const btnDelete = document.createElement('button');
		btnDelete.textContent = 'Xóa';
		btnDelete.className = 'btn ghost small';
		btnDelete.style.marginLeft = '6px';
		btnDelete.addEventListener('click', ()=> deleteImport(imp.id));
		actions.appendChild(btnDelete);

		tbody.appendChild(tr);
	});
}

function importNew(){
	openImportModal({
		id: generateCode() + '_' + Date.now(),
		code: generateCode(),
		date: new Date().toISOString().slice(0,10),
		items: [],
		status: 'pending'
	}, 'create');
}

function viewImport(id){
	const list = loadImports();
	const imp = list.find(x=> x.id === id);
	if(!imp) { alert('Phiếu không tồn tại'); return; }
	openImportModal(imp, 'view');
}

function editImport(id){
	const list = loadImports();
	const imp = list.find(x=> x.id === id);
	if(!imp) { alert('Phiếu không tồn tại'); return; }
	if(imp.status === 'completed') { alert('Phiếu đã hoàn thành, không thể sửa.'); return; }
	openImportModal(imp, 'edit');
}

function completeImport(id){
	if(!confirm('Đánh dấu phiếu này là hoàn thành? Sau khi hoàn thành không thể sửa.')) return;
	const list = loadImports();
	const idx = list.findIndex(x=> x.id === id);
	if(idx === -1) { alert('Phiếu không tồn tại'); return; }
	list[idx].status = 'completed';
	saveImports(list);
	renderImportList();
}

function deleteImport(id){
	if(!confirm('Xóa phiếu nhập này? Hành động không thể hoàn tác.')) return;
	let list = loadImports();
	list = list.filter(x=> x.id !== id);
	saveImports(list);
	renderImportList();
}

function openImportModal(data, mode){
	const modal = document.createElement('div');
	modal.className = 'import-modal';
	modal.innerHTML = '';

	const title = mode === 'create' ? 'Tạo phiếu nhập mới' : mode === 'edit' ? 'Sửa phiếu nhập' : 'Xem phiếu nhập';

	modal.innerHTML = `
		<div class="import-modal-inner">
			<div class="import-modal-header">
				<h3>${title}</h3>
				<button class="close">✕</button>
			</div>
			<div class="import-modal-body">
				<label>Mã phiếu: <input id="imp-code" type="text" readonly></label>
				<label>Ngày nhập: <input id="imp-date" type="date"></label>

				<div class="items-area">
					<div class="items-header">Danh sách sản phẩm</div>
					<div id="imp-items"></div>
					<button id="imp-add-item" class="btn small">+ Thêm dòng</button>
				</div>
			</div>
			<div class="import-modal-footer">
				<div class="imp-summary">Tổng: <span id="imp-total">0</span></div>
				<div class="imp-actions"></div>
			</div>
		</div>
	`;

	document.body.appendChild(modal);

	modal.querySelector('#imp-code').value = data.code || data.id || '';
	modal.querySelector('#imp-date').value = (data.date||'').slice(0,10);

	const itemsContainer = modal.querySelector('#imp-items');

	function addItemRow(item){
		const products = getAllProducts();
		const row = document.createElement('div');
		row.className = 'imp-item-row';

		let selectHtml = '<select class="i-prod"><option value="">-- Chọn SP --</option>';
		products.forEach(p => { selectHtml += '<option value="' + p.id + '">' + p.name + '</option>'; });
		selectHtml += '</select>';

		const nameVal = item && item.name ? item.name : '';
		const priceVal = item && item.price ? item.price : 0;
		const qtyVal = item && item.qty ? item.qty : 0;

		row.innerHTML = selectHtml +
			'<input class="i-name" placeholder="Tên SP" value="' + nameVal + '">' +
			'<input class="i-price" type="number" min="0" placeholder="Giá nhập" value="' + priceVal + '">' +
			'<input class="i-qty" type="number" min="0" placeholder="Số lượng" value="' + qtyVal + '">' +
			'<button class="remove small">X</button>';

		const sel = row.querySelector('.i-prod');
		if(item && item.code) sel.value = item.code;

		sel.addEventListener('change', function(){
			const pid = this.value;
			if(!pid){ row.querySelector('.i-name').value = ''; row.querySelector('.i-price').value = 0; updateTotal(); return; }
			const prod = getAllProducts().find(p=> p.id === pid);
			if(prod){ row.querySelector('.i-name').value = prod.name || ''; row.querySelector('.i-price').value = prod.price || 0; }
			updateTotal();
		});

		const btnRem = row.querySelector('.remove');
		btnRem.addEventListener('click', ()=>{ row.remove(); updateTotal(); });
		itemsContainer.appendChild(row);
		row.querySelectorAll('input').forEach(inp => inp.addEventListener('input', updateTotal));
		updateTotal();
	}

	(data.items||[]).forEach(it=> addItemRow(it));

	modal.querySelector('#imp-add-item').addEventListener('click', ()=> addItemRow({}));

	const actionsEl = modal.querySelector('.imp-actions');
	function updateTotal(){
		const rows = itemsContainer.querySelectorAll('.imp-item-row');
		let total = 0;
		rows.forEach(r=>{
			const p = Number(r.querySelector('.i-price').value) || 0;
			const q = Number(r.querySelector('.i-qty').value) || 0;
			total += p * q;
		});
		modal.querySelector('#imp-total').textContent = total.toLocaleString();
	}

	if(mode === 'view'){
		modal.querySelector('#imp-date').setAttribute('disabled','');
		itemsContainer.querySelectorAll('.imp-item-row .remove').forEach(b=> b.remove());
		modal.querySelector('#imp-add-item').style.display = 'none';
		actionsEl.innerHTML = '<button class="btn ghost close-btn">Đóng</button>';
	} else {
		actionsEl.innerHTML = '<button class="btn save">Lưu</button> <button class="btn ghost close-btn">Hủy</button>';
		actionsEl.querySelector('.save').addEventListener('click', ()=>{
			const code = modal.querySelector('#imp-code').value.trim();
			const date = modal.querySelector('#imp-date').value;
			const rows = itemsContainer.querySelectorAll('.imp-item-row');
			const items = [];
			rows.forEach(r=>{
				const code = r.querySelector('.i-prod') ? r.querySelector('.i-prod').value.trim() : '';
				const name = r.querySelector('.i-name').value.trim();
				const price = Number(r.querySelector('.i-price').value) || 0;
				const qty = Number(r.querySelector('.i-qty').value) || 0;
				if(code || name){
					items.push({code, name, price, qty});
				}
			});

			if(!date){ alert('Vui lòng chọn ngày nhập'); return; }
			if(items.length === 0){ if(!confirm('Phiếu hiện chưa có dòng sản phẩm. Lưu vẫn tiếp tục?')) return; }

			const list = loadImports();
			if(mode === 'create'){
				const id = data.id || ('imp_' + Date.now());
				const newImp = { id, code, date, items, status: 'pending', createdAt: new Date().toISOString() };
				list.push(newImp);
			} else if(mode === 'edit'){
				const idx = list.findIndex(x=> x.id === data.id);
				if(idx === -1){ alert('Phiếu không tồn tại'); return; }
				list[idx].code = code;
				list[idx].date = date;
				list[idx].items = items;
			}

			saveImports(list);
			closeModal();
			renderImportList();
		});
	}

	modal.querySelectorAll('.close, .close-btn').forEach(btn=> btn.addEventListener('click', closeModal));

	function closeModal(){
		modal.remove();
	}

	updateTotal();
}

window.importFilter = importFilter;
window.importNew = importNew;

