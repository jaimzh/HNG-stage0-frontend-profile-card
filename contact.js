const form = document.querySelector('.contact-form');
const successMessage = document.querySelector('[data-testid="test-contact-success"]');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  let isValid = true;
  const name = form.name;
  const email = form.email;
  const subject = form.subject;
  const message = form.message;

  
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  successMessage.textContent = '';

  if (!/^[a-zA-Z\s]{2,50}$/.test(name.value.trim())) {
  document.getElementById('error-name').textContent = 'Please enter a valid full name';
  isValid = false;
}



  if (!email.value.trim()) {
    document.getElementById('error-email').textContent = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    document.getElementById('error-email').textContent = 'Email is invalid';
    isValid = false;
  }


  if (!subject.value.trim()) {
    document.getElementById('error-subject').textContent = 'Subject is required';
    isValid = false;
  }


  if (!message.value.trim()) {
    document.getElementById('error-message').textContent = 'Message is required';
    isValid = false;
  } else if (message.value.trim().length < 10) {
    document.getElementById('error-message').textContent = 'Message must be at least 10 characters';
    isValid = false;
  }

  if (isValid) {
    successMessage.textContent = 'Your message has been sent successfully!';
    form.reset();
  }
});
