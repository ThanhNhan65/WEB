(function () {
	const STORAGE_KEY = 'watchTypes';

	// Utility
	function getTypes() {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	}

	function saveTypes(types) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(types));
		// notify other scripts in the same page
		document.dispatchEvent(new CustomEvent('watchTypesUpdated', { detail: types }));
	}

	function genId() {
		return Date.now() + Math.floor(Math.random() * 1000);
	}

	// DOM helpers
	function el(tag, cls, txt) {
		const e = document.createElement(tag);
		if (cls) e.className = cls;
		if (txt !== undefined) e.textContent = txt;
		return e;
	}

	// Build UI container (if not present)
	function ensureContainer() {
		// support both id variants: 'watch-type-manager' (script) and
		// 'watchtype-manager' (existing admin.html)
		let container = document.getElementById('watch-type-manager') || document.getElementById('watchtype-manager');
		if (!container) {
			container = el('div');
			container.id = 'watch-type-manager';
			document.body.appendChild(container);
		}
		return container;
	}

	// Render the manager UI
	function render() {
		const container = ensureContainer();
		const types = getTypes();

		// If admin page has a table body for watch types, render rows into it
		const tbody = document.getElementById('watchtype-tbody');
		if (tbody) {
			// populate rows
			tbody.innerHTML = '';
			if (types.length === 0) {
				var tr = document.createElement('tr');
				tr.innerHTML = '<td colspan="3" style="padding:12px;color:#666">Chưa có loại nào. Nhấn "+ Thêm Loại Mới" để tạo.</td>';
				tbody.appendChild(tr);
				return;
			}
			types.forEach(function(t, idx) {
				var tr = document.createElement('tr');
				var tdIndex = document.createElement('td'); tdIndex.textContent = idx + 1;
				var tdName = document.createElement('td'); tdName.textContent = t.name;
				var tdActions = document.createElement('td');

				// Edit
				var btnEdit = document.createElement('button');
				btnEdit.className = 'wtm-table-btn wtm-edit'; btnEdit.type = 'button'; btnEdit.textContent = 'Sửa';
				btnEdit.addEventListener('click', function(){
					var newName = prompt('Sửa tên loại:', t.name);
					if (newName && newName.trim()) editType(t.id, newName.trim());
				});
				// Hide/Show
				var btnHide = document.createElement('button');
				btnHide.className = 'wtm-table-btn wtm-ghost'; btnHide.type = 'button'; btnHide.textContent = t.hidden ? 'Hiện' : 'Ẩn';
				btnHide.addEventListener('click', function(){ toggleHidden(t.id); });

				// Delete
				var btnDel = document.createElement('button');
				btnDel.className = 'wtm-table-btn wtm-delete'; btnDel.type = 'button'; btnDel.textContent = 'Xóa';
				btnDel.addEventListener('click', function(){ if (confirm('Xóa loại này vĩnh viễn?')) deleteType(t.id); });
				// assemble
				tdActions.appendChild(btnEdit);
				tdActions.appendChild(btnHide);
				tdActions.appendChild(btnDel);

				tr.appendChild(tdIndex);
				tr.appendChild(tdName);
				tr.appendChild(tdActions);
				tbody.appendChild(tr);
			});
			return;
		}

		container.innerHTML = '';
		const panel = el('div', 'wtm-panel');

		const header = el('div', 'wtm-header');
		header.appendChild(el('h3', '', 'Quản lý loại sản phẩm'));
		panel.appendChild(header);

		// Add form
		const form = el('form', 'wtm-form');
		form.innerHTML = `
			<input class="wtm-input" placeholder="Tên loại mới" name="name" required />
			<button type="submit" class="btn btn-add">Thêm</button>
		`;
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			const name = form.name.value.trim();
			if (!name) return;
			addType(name);
			form.name.value = '';
		});
		panel.appendChild(form);

		const list = el('div', 'wtm-list');
		if (types.length === 0) {
			const empty = el('div', 'wtm-empty', 'Không có loại nào. Thêm loại mới ở trên.');
			list.appendChild(empty);
		} else {
			types.forEach((t) => {
				const item = el('div', 'wtm-item');
				if (t.hidden) item.classList.add('wtm-item-hidden');

				const left = el('div', 'wtm-item-left');
				const nameEl = el('span', 'wtm-name', t.name);
				left.appendChild(nameEl);
				item.appendChild(left);

				const right = el('div', 'wtm-item-right');

				// Edit button
				const editBtn = el('button', 'btn btn-edit', 'Sửa');
				editBtn.type = 'button';
				editBtn.addEventListener('click', function () {
					startEdit(t.id, item, nameEl);
				});
				right.appendChild(editBtn);

				// Hide/unhide
				const hideBtn = el('button', 'btn btn-hide', t.hidden ? 'Hiện' : 'Ẩn');
				hideBtn.type = 'button';
				hideBtn.addEventListener('click', function () {
					toggleHidden(t.id);
				});
				right.appendChild(hideBtn);

				// Delete
				const delBtn = el('button', 'btn btn-delete', 'Xóa');
				delBtn.type = 'button';
				delBtn.addEventListener('click', function () {
					if (confirm('Xóa loại này vĩnh viễn?')) deleteType(t.id);
				});
				right.appendChild(delBtn);

				item.appendChild(right);

				list.appendChild(item);
			});
		}

		panel.appendChild(list);
		container.appendChild(panel);
	}

	// CRUD operations
	function addType(name) {
		const types = getTypes();
		types.push({ id: genId(), name: name, hidden: false });
		saveTypes(types);
		render();
	}

	function startEdit(id, itemEl, nameEl) {
		// replace name with input
		const types = getTypes();
		const t = types.find((x) => x.id === id);
		if (!t) return;

		const input = el('input', 'wtm-input-edit');
		input.value = t.name;

		const save = el('button', 'btn btn-save', 'Lưu');
		save.type = 'button';
		save.addEventListener('click', function () {
			const newName = input.value.trim();
			if (!newName) return;
			editType(id, newName);
		});

		const cancel = el('button', 'btn btn-cancel', 'Hủy');
		cancel.type = 'button';
		cancel.addEventListener('click', function () {
			render();
		});

		// swap
		const left = itemEl.querySelector('.wtm-item-left');
		left.innerHTML = '';
		left.appendChild(input);
		const right = itemEl.querySelector('.wtm-item-right');
		right.innerHTML = '';
		right.appendChild(save);
		right.appendChild(cancel);
		input.focus();
	}

	function editType(id, newName) {
		const types = getTypes();
		const idx = types.findIndex((x) => x.id === id);
		if (idx === -1) return;
		const oldName = types[idx].name;
		types[idx].name = newName;
		// persist type change
		saveTypes(types);
		// propagate type rename to products in localStorage (update product.type values)
		var raw = localStorage.getItem('app_products');
		if(raw){
			var prods = JSON.parse(raw);
			var changed = false;
			for(var i=0;i<prods.length;i++){
				if(prods[i] && prods[i].type === oldName){
					prods[i].type = newName;
					changed = true;
				}
			}
			if(changed){
				localStorage.setItem('app_products', JSON.stringify(prods));
				// notify other scripts in the same page
				document.dispatchEvent(new CustomEvent('productsUpdated'));
			}
		}
		render();
	}

	function toggleHidden(id) {
		const types = getTypes();
		const idx = types.findIndex((x) => x.id === id);
		if (idx === -1) return;
		types[idx].hidden = !types[idx].hidden;
		saveTypes(types);
		render();
	}

	function deleteType(id) {
		let types = getTypes();
		const toDelete = types.find(function(x){ return x.id === id; });
		types = types.filter((x) => x.id !== id);
		saveTypes(types);
		// remove type value from products that referenced this type
		if(toDelete && toDelete.name){
			var raw = localStorage.getItem('app_products');
			if(raw){
				var prods = JSON.parse(raw);
				var changed = false;
				for(var i=0;i<prods.length;i++){
					if(prods[i] && prods[i].type === toDelete.name){
						// remove the type so UI falls back to brand
						delete prods[i].type;
						changed = true;
					}
				}
				if(changed){
					localStorage.setItem('app_products', JSON.stringify(prods));
					document.dispatchEvent(new CustomEvent('productsUpdated'));
				}
			}
		}
		render();
	}

	// Expose a simple API for other scripts if needed
	window.WatchTypeManager = {
		add: addType,
		edit: editType,
		toggleHidden: toggleHidden,
		delete: deleteType,
		render: render,
		getAll: getTypes,
	};

	// Hook for the existing admin '+ Thêm Loại Mới' button: use a simple prompt.
	window.themLoai = function() {
		var name = prompt('Tên loại mới:');
		if (name && name.trim()) addType(name.trim());
		return false;
	};

	// Auto-render on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', render);
	} else {
		render();
	}

	// If there are no watchTypes yet, try seeding them from existing products
	// so product pages immediately have type options. This only runs when
	// localStorage 'watchTypes' is empty.
	(function seedFromProductsIfEmpty() {
		var existing = getTypes();
		if (existing && existing.length) return;
		var raw = localStorage.getItem('app_products');
		if (!raw) return;
		var prods = JSON.parse(raw);
		var names = prods.map(function(p){ return p.type; }).filter(function(x){ return x; });
		// unique
		names = names.filter(function(v,i,a){ return a.indexOf(v) === i; });
		if (names.length === 0) return;
		var types = names.map(function(n){ return { id: genId(), name: n, hidden: false }; });
		saveTypes(types);
	})();

})();

