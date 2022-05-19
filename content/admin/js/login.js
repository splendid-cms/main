const form = document.querySelector('form');
const passwordInput = document.querySelector('input#current-password');
const emailInput = document.querySelector('input#email');
const togglePasswordButton = document.querySelector('button#toggle-password');

togglePasswordButton.addEventListener('click', togglePassword);
function togglePassword() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordButton.textContent = 'Hide password';
    togglePasswordButton.setAttribute('aria-label',
      'Hide password.');
  } else {
    passwordInput.type = 'password';
    togglePasswordButton.textContent = 'Show password';
    togglePasswordButton.setAttribute('aria-label',
      'Show password as plain text. ' +
      'Warning: this will display your password on the screen.');
  }
}