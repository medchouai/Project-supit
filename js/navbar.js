/* Navbar Logic */
function loadNavbar() {
  const isIndexPage = window.location.pathname === '/' ||
    window.location.pathname.endsWith('index.html') ||
    !window.location.pathname.includes('/pages/');

  let navbarPath = 'navbar.html';
  if (isIndexPage) {
    navbarPath = 'pages/navbar.html';
  } else if (window.location.pathname.includes('/pages/articles/')) {
    navbarPath = '../navbar.html';
  }

  fetch(navbarPath)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load navbar');
      return res.text();
    })
    .then(html => {
      document.getElementById("navbar-placeholder").innerHTML = html;

      const logoImg = document.getElementById('nav-logo');
      if (logoImg) {
        if (isIndexPage) {
          logoImg.src = 'img/Algebra-logo.png';
        } else if (window.location.pathname.includes('/pages/articles/')) {
          logoImg.src = '../../img/Algebra-logo.png';
        } else {
          logoImg.src = '../img/Algebra-logo.png';
        }
      }

      const hamburger = document.querySelector('.hamburger');
      const navLinks = document.querySelector('.nav-links');

      if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          navLinks.classList.toggle('active');
        });

        const mobileLinks = navLinks.querySelectorAll('a');
        mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
          });
        });
      }

      const links = document.querySelectorAll('.nav-links .nav-link');
      links.forEach(link => {
        const target = link.getAttribute('data-target');

        if (isIndexPage) {
          if (target === 'home') {
            link.setAttribute('href', 'index.html');
          } else {
            link.setAttribute('href', 'pages/' + target + '.html');
          }
        } else if (window.location.pathname.includes('/pages/articles/')) {
          if (target === 'home') {
            link.setAttribute('href', '../../index.html');
          } else {
            link.setAttribute('href', '../' + target + '.html');
          }
        } else {
          if (target === 'home') {
            link.setAttribute('href', '../index.html');
          } else {
            link.setAttribute('href', target + '.html');
          }
        }
      });

      updateNavbarAuth(isIndexPage);
      initContactModal();
    })
    .catch(error => console.error('Navbar loading error:', error));
}

function updateNavbarAuth(isIndexPage) {
  const token = localStorage.getItem('jwt_token');
  const username = localStorage.getItem('username');
  const loginLink = document.querySelector('[data-target="login"]');
  const curriculumLink = document.getElementById('curriculum-link');

  if (token && username) {
    if (loginLink) {
      loginLink.textContent = username;
      loginLink.href = '#';
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Do you want to logout?')) {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('username');
          window.location.href = isIndexPage ? 'index.html' : '../index.html';
        }
      });
    }

    if (curriculumLink) {
      curriculumLink.style.display = 'inline';
    }
  }
}

/* Contact Modal Logic */
function initContactModal() {
  const contactLink = document.querySelector('[data-target="contact"]');
  if (contactLink) {
    contactLink.setAttribute('href', '#');
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  }

  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeContactModal();
      }
    });
  }
}

function openContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('contact-form').reset();
    document.getElementById('form-response').textContent = '';
  }
}

function submitContactForm(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const responseDiv = document.getElementById('form-response');
  const submitBtn = document.getElementById('submit-btn');

  const formData = {
    FullName: form.FullName.value,
    Email: form.Email.value,
    Importance: form.Importance.value,
    ReceiveNewsletter: form.ReceiveNewsletter.checked,
    Message: form.Message.value
  };

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  fetch('https://www.fulek.com/mvc/supit/project-contact-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(res => {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return res.json().then(data => ({ status: res.status, body: data }));
      } else {
        return res.text().then(text => ({ status: res.status, body: text }));
      }
    })
    .then(result => {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;

      if (result.status === 200) {
        responseDiv.textContent = 'Message sent successfully!';
        responseDiv.className = 'success';
        setTimeout(() => {
          closeContactModal();
        }, 2000);
      } else {
        responseDiv.textContent = 'Error sending message. Please try again.';
        responseDiv.className = 'error';
      }
    })
    .catch(err => {
      console.error(err);
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      responseDiv.textContent = 'Network error.';
      responseDiv.className = 'error';
    });
}