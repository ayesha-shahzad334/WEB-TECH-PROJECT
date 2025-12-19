function setupCheckoutValidation() {
  const form = document.getElementById('checkoutForm');

  function showError(id, message) {
    document.getElementById(id).innerText = message;
  }

  function clearErrors() {
    const errorSpans = document.querySelectorAll('.error-msg');
    errorSpans.forEach(span => (span.innerText = ''));
  }

  function validateForm(event) {
    event.preventDefault();
    clearErrors();
    let valid = true;

    const name = document.getElementById('fullname').value.trim();
    if (name === '') {
      showError('nameError', 'Full Name is required');
      valid = false;
    }

    const email = document.getElementById('email').value.trim();
    if (email === '' || !email.includes('@') || !email.includes('.')) {
      showError('emailError', 'Enter a valid email');
      valid = false;
    }

    const phone = document.getElementById('phone').value.trim();
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      showError('phoneError', 'Enter a valid 10-digit phone number');
      valid = false;
    }

    const address = document.getElementById('address').value.trim();
    if (address === '') {
      showError('addressError', 'Address is required');
      valid = false;
    }

    const payment = document.getElementById('payment').value;
    if (payment === '') {
      showError('paymentError', 'Select a payment method');
      valid = false;
    }

    if (valid) {
      alert('Payment Successful! Thank you for your order.');
      form.reset();
    }
  }

  form.addEventListener('submit', validateForm);
}

window.onload = setupCheckoutValidation;
