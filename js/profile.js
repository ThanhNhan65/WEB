function getCurrentUser() {
  var users = JSON.parse(localStorage.getItem('app_users') || '[]');
  var current = localStorage.getItem('app_current_user_id');
  if (!current) return null;
  return users.find(u => String(u.id) === String(current));
}

function setProfileFields(user) {
  if (!user) return;
  var nameEl = document.getElementById('profile-name');
  var emailEl = document.getElementById('profile-email');
  var phoneEl = document.getElementById('profile-phone');
  var addressEl = document.getElementById('profile-address');
  if (nameEl) nameEl.textContent = user.name || '—';
  if (emailEl) emailEl.textContent = user.email || '—';
  if (phoneEl) phoneEl.textContent = user.phone || '—';
  if (addressEl) addressEl.textContent = user.address || '—';
}

function setProfileForm(user) {
  if (!user) 
    return;
  var nameInput = document.getElementById('input-name');
  var emailInput = document.getElementById('input-email');
  var phoneInput = document.getElementById('input-phone');
  var addressInput = document.getElementById('input-address');
  if (nameInput) nameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';
  if (phoneInput) phoneInput.value = user.phone || '';
  if (addressInput) addressInput.value = user.address || '';
}

function saveProfileForm(e) {
  e.preventDefault();
  var users = JSON.parse(localStorage.getItem('app_users') || '[]');
  var current = localStorage.getItem('app_current_user_id');
  var idx = users.findIndex(u => String(u.id) === String(current));
  if (idx === -1) return;
  var nameInput = document.getElementById('input-name');
  var phoneInput = document.getElementById('input-phone');
  var addressInput = document.getElementById('input-address');
  users[idx].name = nameInput ? nameInput.value.trim() : users[idx].name;
  users[idx].phone = phoneInput ? phoneInput.value.trim() : users[idx].phone;
  users[idx].address = addressInput ? addressInput.value.trim() : users[idx].address;
  localStorage.setItem('app_users', JSON.stringify(users));
  setProfileFields(users[idx]);
  var msg = document.getElementById('profile-save-msg');
  if (msg) {
    msg.style.display = 'inline';
    setTimeout(() => { msg.style.display = 'none'; }, 2000);
  }
}

function initProfilePage() {
  var user = getCurrentUser();
  setProfileFields(user);
  setProfileForm(user);
  var form = document.getElementById('profile-form');
  if (form) {
    form.onsubmit = saveProfileForm;
  }
}

document.addEventListener('DOMContentLoaded', initProfilePage);
