const API_BASE = 'https://www.fulek.com/data/api/user';

function login(username, password) {
  console.log('Login attempt:', { username, password });
  
  return fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    console.log('Login response status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('Login response data:', data);
    if (data.isSuccess && data.data && data.data.token) {
      localStorage.setItem('jwt_token', data.data.token);
      localStorage.setItem('username', username);
      return { success: true };
    } else {
      const errorMsg = data.errorMessages && data.errorMessages.length > 0 
        ? data.errorMessages.join(', ') 
        : 'Login failed';
      return { success: false, message: errorMsg };
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    return { success: false, message: 'Network error' };
  });
}

function register(username, password) {
  console.log('Register attempt:', { username, password });
  
  return fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    console.log('Register response status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('Register response data:', data);
    if (data.isSuccess) {
      return { success: true };
    } else {
      const errorMsg = data.errorMessages && data.errorMessages.length > 0 
        ? data.errorMessages.join(', ') 
        : 'Registration failed';
      return { success: false, message: errorMsg };
    }
  })
  .catch(error => {
    console.error('Register error:', error);
    return { success: false, message: 'Network error' };
  });
}

function checkCurriculumAccess() {
  const token = localStorage.getItem('jwt_token');
  const currentPage = window.location.pathname;
  
  if (currentPage.includes('curriculum.html') && !token) {
    alert('Please login to access this page');
    window.location.href = 'login.html';
  }
}

function initLoginPage() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      
      const result = await login(username, password);
      
      if (result.success) {
        window.location.href = '../index.html';
      } else {
        const errorMsg = document.getElementById('login-error');
        errorMsg.textContent = result.message;
        errorMsg.style.display = 'block';
      }
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
      
      const result = await register(username, password);
      
      if (result.success) {
        alert('Registration successful! Please login.');
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('register-form').reset();
      } else {
        const errorMsg = document.getElementById('register-error');
        errorMsg.textContent = result.message;
        errorMsg.style.display = 'block';
      }
    });
  }
  
  if (showRegister) {
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('register-container').style.display = 'block';
    });
  }
  
  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('register-container').style.display = 'none';
      document.getElementById('login-container').style.display = 'block';
    });
  }
}