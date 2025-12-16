document.addEventListener('DOMContentLoaded', function() {
  
  const form = document.getElementById('orderForm');
  const orderBtn = document.getElementById('orderBtn');
  const msg = document.getElementById('orderMsg');

  const loader = document.createElement('span');
  loader.className = 'spinner-border spinner-border-sm ms-2';
  loader.style.display = 'none';
  orderBtn.appendChild(loader);

  function clearMsg() {
    msg.innerText = '';
    msg.className = '';
    msg.style.display = 'none';
  }

  function showMsg(text, type) {
    msg.innerText = text;
    msg.className = type === 'error' ? 'text-danger mt-2' : 'text-success mt-2';
    msg.style.display = 'block';
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearMsg();

    const car = document.getElementById('car').value.trim();
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!car || !from || !to || !message) {
      showMsg('⚠️ Please fill out all fields before ordering.', 'error');
      return;
    }

    loader.style.display = 'inline-block';
    orderBtn.disabled = true;

   
    setTimeout(() => {
      loader.style.display = 'none';
      orderBtn.disabled = false;
      showMsg('✅ Your order has been placed successfully!', 'success');
      form.reset();
    }, 2000);
  });
});
