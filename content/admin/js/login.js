const form = document.querySelector('form');
const passwordInput = document.querySelector('input#current-password');
const emailInput = document.querySelector('input#email');
const signinButton = document.querySelector('button#signin');
const togglePasswordButton = document.querySelector('button#toggle-password');
const Http = new XMLHttpRequest();

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

form.addEventListener('submit', handleFormSubmit);
function handleFormSubmit(event) {
  if (form.checkValidity() === false) {
    console.log('not valid');
    event.preventDefault();
  } else {
    event.preventDefault();
    window.location.replace(window.location.origin + `/api/auth?email=${emailInput.value}&password=${passwordInput.value}`);
  }
}