// ================== Get elements ==================

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const signupUsername = document.getElementById('signupUsername');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const welcome = document.getElementById('welcome');
const welcomeMessage = document.getElementById('welcome-message');
const welcomeBtn = document.getElementById('welcomeBtn');
const welcomeHeading = document.getElementById('welcome-h');
const logoutBtn = document.getElementById('logoutBtn');

// =============== Users Data Storage ===============

var allUsers;
if(localStorage.getItem('users') === null){
    allUsers = [];
}else{
    allUsers = JSON.parse(localStorage.getItem('users'));
}

// ================== Event Listeners =================

signupForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    if(validateForm(signupForm)) {
        signup();
    }
});

loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    if (validateForm(loginForm)) {
        login();
    }
});

logoutBtn.addEventListener('click', function() {
    logout();
});

welcomeBtn.addEventListener('click', function() {
    if (getComputedStyle(welcomeBtn).display === 'none') return;

    const isActive = welcome.classList.contains('active');

    if (isActive) {
        // show signup welcome button
        welcome.classList.remove('active');
        welcomeMessage.innerText = "If you don't have an account yet, sign up";
        welcomeBtn.innerText = 'Sign Up';
        welcomeHeading.innerText = 'Hello, Friend!';
    } else {
        // show login welcome button
        welcome.classList.add('active');
        welcomeMessage.innerText = 'If you already have an account, log in';
        welcomeBtn.innerText = 'Log In';
        welcomeHeading.innerText = 'Welcome Back!';
    }
});

// ================== Form Validation ==================

function validateForm(form) {
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }
    return true;
}

// =================== Signup Function ==================

function signup(){
    signupBtn.classList.add('btn-loading');
    signupBtn.disabled = true;
    
    const emailExists = allUsers.some(user => user.email === signupEmail.value);
    if (emailExists) {
        showToast('Email already exists. Please use a different email.', 'error');
        signupBtn.classList.remove('btn-loading');
        signupBtn.disabled = false;
        return;
    }
    
    setTimeout(() => {
        const user = {
            username: signupUsername.value,
            email: signupEmail.value,
            password: signupPassword.value
        };

        allUsers.push(user);
        localStorage.setItem('users', JSON.stringify(allUsers));

        showToast('Account created successfully! Please log in.', 'success');
        
        // Switch to login view
        welcome.classList.remove('active');   
        welcomeMessage.innerText = 'Please log in to continue!';
        welcomeBtn.style.display = 'none';           
        welcomeBtn.innerText = 'Log In';
        welcomeHeading.innerText = 'Welcome Back!';
        
        // Clear form
        clearSignupForm();
        signupForm.classList.remove('was-validated');
        
        signupBtn.classList.remove('btn-loading');
        signupBtn.disabled = false;
    }, 1000);
}
// =================== Login Function ===================

function login(){
    loginBtn.classList.add('btn-loading');
    loginBtn.disabled = true;
    
    const email = loginEmail.value;
    const password = loginPassword.value;
    let foundUser = null;
    
    setTimeout(() => {
        for(let i = 0; i < allUsers.length; i++){
            if(allUsers[i].email === email && allUsers[i].password === password){
                foundUser = allUsers[i];
                break;
            }
        }
        
        if(foundUser){
            showToast('Login successful!', 'success');
            
            // show logged-in view
            welcome.classList.remove('active');
            welcome.classList.add('logged-in');
            welcomeHeading.innerHTML = `Welcome Back, ${foundUser.username}!`;
            welcomeHeading.classList.add('success-pulse');
            welcomeMessage.innerText = 'You have successfully logged in.';
            welcomeBtn.style.display = 'none';

            setTimeout(() => {
                logoutBtn.classList.remove('d-none');
                logoutBtn.classList.add('show');
            }, 500);

            // Clear form
            clearLoginForm();
            loginForm.classList.remove('was-validated');
        } else {
            showToast('Invalid email or password. Please try again.', 'error');
        }
        
        loginBtn.classList.remove('btn-loading');
        loginBtn.disabled = false;
    }, 1000);
}

// =================== Logout Function ===================

function logout() {
    logoutBtn.classList.add('btn-loading');
    
    setTimeout(() => {
        showToast('Logged out successfully!', 'success');
        
        // Reset welcome section
        welcome.classList.remove('logged-in');
        welcomeHeading.innerHTML = 'Hello, Friend!';
        welcomeHeading.classList.remove('success-pulse');
        welcomeMessage.innerText = "If you don't have an account yet, sign up";
        
        logoutBtn.classList.remove('show');
        logoutBtn.classList.add('d-none');
        logoutBtn.classList.remove('btn-loading');
        
        welcomeBtn.style.display = '';
        welcomeBtn.innerText = 'Sign Up';
        
        // Clear any forms
        clearLoginForm();
        clearSignupForm();
        loginForm.classList.remove('was-validated');
        signupForm.classList.remove('was-validated');
    }, 800);
}

// ================ Clear Form Functions ================

function clearSignupForm(){
    signupUsername.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
}

function clearLoginForm(){
    loginEmail.value = '';
    loginPassword.value = '';
}

// ================== Toast Notification ==================

function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = 'toast-' + Date.now();
    
    let bgClass = 'bg-primary';
    if (type === 'success') bgClass = 'bg-success';
    if (type === 'error') bgClass = 'bg-danger';
    
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 mb-2" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
    toast.show();
    
    // Remove toast from DOM after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}