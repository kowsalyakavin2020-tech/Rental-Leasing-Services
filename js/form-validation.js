/* ==========================================================================
   FORM-VALIDATION.JS — Contact, Login, Signup forms:
   validation, password show/hide toggle, password strength meter,
   role-based redirect (Login -> role dashboard, Signup -> login.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.closest('.form-group').classList.add('invalid');
    error.textContent = message;
  }

  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.closest('.form-group').classList.remove('invalid');
    error.textContent = '';
  }

  function bindLiveClear(ids) {
    ids.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      const errorId = id + 'Error';
      el.addEventListener('input', function () {
        if (el.closest('.form-group') && el.closest('.form-group').classList.contains('invalid')) {
          clearError(id, errorId);
        }
      });
    });
  }

  // ======================================================================
  // CONTACT FORM
  // ======================================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {

    function validateContactForm() {
      let isValid = true;
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value.trim();

      if (name.length < 2) {
        setError('contactName', 'contactNameError', 'Please enter your full name.');
        isValid = false;
      } else {
        clearError('contactName', 'contactNameError');
      }

      if (!emailPattern.test(email)) {
        setError('contactEmail', 'contactEmailError', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError('contactEmail', 'contactEmailError');
      }

      if (!subject) {
        setError('contactSubject', 'contactSubjectError', 'Please select a topic.');
        isValid = false;
      } else {
        clearError('contactSubject', 'contactSubjectError');
      }

      if (message.length < 10) {
        setError('contactMessage', 'contactMessageError', 'Message should be at least 10 characters.');
        isValid = false;
      } else {
        clearError('contactMessage', 'contactMessageError');
      }

      return isValid;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateContactForm()) {
        // Redirect to 404.html on successful submission
        window.location.href = '404.html';
      }
    });

    bindLiveClear(['contactName', 'contactEmail', 'contactSubject', 'contactMessage']);
  }

  // ======================================================================
  // PASSWORD SHOW/HIDE TOGGLE (login + signup)
  // ======================================================================
  document.querySelectorAll('.password-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // ======================================================================
  // LOGIN FORM (with role-based redirect)
  // ======================================================================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const loginSuccess = document.getElementById('loginSuccessMessage');

    function validateLoginForm() {
      let isValid = true;
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!emailPattern.test(email)) {
        setError('loginEmail', 'loginEmailError', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError('loginEmail', 'loginEmailError');
      }

      if (password.length < 6) {
        setError('loginPassword', 'loginPasswordError', 'Password must be at least 6 characters.');
        isValid = false;
      } else {
        clearError('loginPassword', 'loginPasswordError');
      }

      return isValid;
    }

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateLoginForm()) {
        loginForm.style.display = 'none';
        loginSuccess.style.display = 'block';

        const selectedRole = document.getElementById('loginRole').value;
        const enteredEmail = document.getElementById('loginEmail').value.trim();
        sessionStorage.setItem('rentlease_email', enteredEmail);
        sessionStorage.setItem('rentlease_name', enteredEmail.split('@')[0]);

        const destination = selectedRole === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';

        setTimeout(function () {
          window.location.href = destination;
        }, 1200);
      }
    });

    bindLiveClear(['loginEmail', 'loginPassword']);
  }

  // ======================================================================
  // SIGNUP FORM (+ password strength meter)
  // On success, redirect to login.html so the new user logs in with
  // their new account.
  // ======================================================================
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const signupSuccess = document.getElementById('signupSuccessMessage');
    const passwordInput = document.getElementById('signupPassword');
    const strengthFill = document.getElementById('strengthBarFill');
    const strengthLabel = document.getElementById('strengthLabel');

    function checkPasswordStrength(password) {
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      const levels = [
        { width: '0%', color: '#d94f4f', label: 'Password strength' },
        { width: '25%', color: '#d94f4f', label: 'Weak' },
        { width: '50%', color: '#E8A33D', label: 'Fair' },
        { width: '75%', color: '#E8A33D', label: 'Good' },
        { width: '100%', color: '#2e9e5b', label: 'Strong' },
      ];

      const level = password.length === 0 ? levels[0] : levels[score] || levels[1];
      strengthFill.style.width = level.width;
      strengthFill.style.background = level.color;
      strengthLabel.textContent = level.label;

      return score;
    }

    if (passwordInput) {
      passwordInput.addEventListener('input', function () {
        checkPasswordStrength(passwordInput.value);
      });
    }

    function validateSignupForm() {
      let isValid = true;
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;
      const agreeTerms = document.getElementById('agreeTerms').checked;
      const agreeTermsError = document.getElementById('agreeTermsError');

      if (name.length < 2) {
        setError('signupName', 'signupNameError', 'Please enter your full name.');
        isValid = false;
      } else {
        clearError('signupName', 'signupNameError');
      }

      if (!emailPattern.test(email)) {
        setError('signupEmail', 'signupEmailError', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError('signupEmail', 'signupEmailError');
      }

      if (password.length < 8) {
        setError('signupPassword', 'signupPasswordError', 'Password must be at least 8 characters.');
        isValid = false;
      } else {
        clearError('signupPassword', 'signupPasswordError');
      }

      if (confirmPassword !== password || confirmPassword === '') {
        setError('signupConfirmPassword', 'signupConfirmPasswordError', 'Passwords do not match.');
        isValid = false;
      } else {
        clearError('signupConfirmPassword', 'signupConfirmPasswordError');
      }

      if (!agreeTerms) {
        agreeTermsError.textContent = 'You must agree to the terms to continue.';
        agreeTermsError.style.display = 'block';
        isValid = false;
      } else {
        agreeTermsError.style.display = 'none';
      }

      return isValid;
    }

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateSignupForm()) {
        signupForm.style.display = 'none';
        signupSuccess.style.display = 'block';

        const enteredName = document.getElementById('signupName').value.trim();
        const enteredEmail = document.getElementById('signupEmail').value.trim();
        sessionStorage.setItem('rentlease_email', enteredEmail);
        sessionStorage.setItem('rentlease_name', enteredName);

        setTimeout(function () {
          window.location.href = 'login.html';
        }, 1200);
      }
    });

    bindLiveClear(['signupName', 'signupEmail', 'signupPassword', 'signupConfirmPassword']);
  }

  // ======================================================================
  // FAQ ACCORDION (shared — listings.html / contact.html)
  // ======================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      const isOpen = answer.classList.contains('open');
      faqItems.forEach(function (otherItem) {
        otherItem.querySelector('.faq-answer').classList.remove('open');
        otherItem.querySelector('.faq-question').classList.remove('active');
      });
      if (!isOpen) {
        answer.classList.add('open');
        question.classList.add('active');
      }
    });
  });

  // ======================================================================
  // GSAP: Auth form panel entrance animation
  // ======================================================================
  if (typeof gsap !== 'undefined') {
    const authForm = document.querySelector('.gsap-auth-form');
    if (authForm) {
      gsap.to(authForm, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.2,
      });
    }
  }

});