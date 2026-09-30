
// ---------- Two-role Login System ----------
const form = document.getElementById('loginForm');
const emailEl = document.getElementById('loginEmail');
const pwEl = document.getElementById('loginPassword');
const emailErr = document.getElementById('emailError');
const pwErr = document.getElementById('pwError');
const rulesList = document.getElementById('pwRules');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PW_RULES = [
  { re: /.{8,}/, label: 'At least 8 characters' },
  { re: /[A-Z]/, label: 'At least 1 uppercase letter' },
  { re: /[a-z]/, label: 'At least 1 lowercase letter' },
  { re: /[0-9]/, label: 'At least 1 number' },
  { re: /[^A-Za-z0-9]/, label: 'At least 1 special character' },
];

// Pre-fill remembered email
try {
  const saved = localStorage.getItem('finance_remember_email');
  if (saved) { emailEl.value = saved; document.getElementById('remember').checked = true; }
} catch (e) {}

function setError(input, errEl, msg) {
  if (msg) {
    input.classList.add('is-invalid-input', 'shake');
    errEl.textContent = msg; errEl.style.display = 'block';
    setTimeout(() => input.classList.remove('shake'), 450);
    return false;
  }
  input.classList.remove('is-invalid-input');
  errEl.style.display = 'none';
  return true;
}

function validateEmail() {
  const v = emailEl.value.trim();
  if (!v) return setError(emailEl, emailErr, 'Email address is required.');
  if (!EMAIL_RE.test(v)) return setError(emailEl, emailErr, 'Please enter a valid email address.');
  return setError(emailEl, emailErr, null);
}

function validatePw() {
  const v = pwEl.value;
  if (!v) return setError(pwEl, pwErr, 'Password is required.');
  const failed = PW_RULES.filter(r => !r.re.test(v));
  if (failed.length) return setError(pwEl, pwErr, 'Password does not meet the security requirements.');
  return setError(pwEl, pwErr, null);
}

// Live password rule checklist
function renderRules() {
  const v = pwEl.value;
  rulesList.innerHTML = PW_RULES.map(r =>
    `<li class="${r.re.test(v) ? 'ok' : ''}"><i class="bi ${r.re.test(v) ? 'bi-check-circle-fill' : 'bi-circle'}"></i> ${r.label}</li>`
  ).join('');
}
renderRules();
pwEl.addEventListener('input', () => { renderRules(); if (pwEl.classList.contains('is-invalid-input')) validatePw(); });
emailEl.addEventListener('input', () => { if (emailEl.classList.contains('is-invalid-input')) validateEmail(); });

// Password visibility toggle
document.getElementById('pwToggle').addEventListener('click', function () {
  const show = pwEl.type === 'password';
  pwEl.type = show ? 'text' : 'password';
  this.innerHTML = show ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const okE = validateEmail();
  const okP = validatePw();
  if (!okE || !okP) return;

  const role = document.querySelector('input[name="role"]:checked').value;
  const remember = document.getElementById('remember').checked;
  try {
    if (remember) localStorage.setItem('finance_remember_email', emailEl.value.trim());
    else localStorage.removeItem('finance_remember_email');
    sessionStorage.setItem('finance_role', role);
    sessionStorage.setItem('finance_user', emailEl.value.trim());
  } catch (err) {}

  // Redirect by role
  window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
});

// Back button
document.getElementById('backBtn').addEventListener('click', () => history.back());
