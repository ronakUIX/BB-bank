document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const dashboard = document.getElementById('dashboard');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const userNameDisplay = document.getElementById('user-name');
    const userBalanceDisplay = document.getElementById('user-balance');
    const transactionAmount = document.getElementById('transaction-amount');
    
    // Transaction elements
    const depositButton = document.getElementById('deposit-button');
    const withdrawButton = document.getElementById('withdraw-button');
    
    // Transfer elements
    const transferEmail = document.getElementById('transfer-email');
    const transferAmount = document.getElementById('transfer-amount');
    const transferButton = document.getElementById('transfer-button');
  
    // Save and Refresh buttons
    const saveButton = document.getElementById('save-button');
    const refreshButton = document.getElementById('refresh-button');
    const logoutButton = document.getElementById('logout-button');
  
    let currentUser = null;
  
    // Check if a user session exists
    if (localStorage.getItem('currentUser')) {
      currentUser = JSON.parse(localStorage.getItem('currentUser'));
      showDashboard();
    }
  
    // Show Sign Up Form
    showSignup.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
    });
  
    // Show Log In Form
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });
  
    // Sign Up
    document.getElementById('signup-button').addEventListener('click', () => {
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
  
      if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }
  
      let users = JSON.parse(localStorage.getItem('users')) || [];
  
      // Check if user already exists
      if (users.find(user => user.email === email)) {
        alert('An account with this email already exists.');
        return;
      }
  
      const user = { id: Date.now(), name, email, password, balance: 0 };
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
  
      alert('Account created successfully!');
      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      
      // Clear the sign-up form
      document.getElementById('signup-name').value = '';
      document.getElementById('signup-email').value = '';
      document.getElementById('signup-password').value = '';
    });
  
    // Log In
    document.getElementById('login-button').addEventListener('click', () => {
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
  
      if (!email || !password) {
        alert('Please enter your email and password.');
        return;
      }
  
      const users = JSON.parse(localStorage.getItem('users')) || [];
  
      currentUser = users.find(user => user.email === email && user.password === password);
      if (currentUser) {
        saveCurrentUser();
        showDashboard();
        
        // Clear the login form
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
      } else {
        alert('Invalid email or password.');
      }
    });
  
    // Deposit
    depositButton.addEventListener('click', () => {
      const amount = parseFloat(transactionAmount.value);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
  
      currentUser.balance += amount;
      updateUserData(currentUser);
      userBalanceDisplay.textContent = currentUser.balance.toFixed(2);
      alert(`₹${amount.toFixed(2)} deposited successfully!`);
      transactionAmount.value = '';
    });
  
    // Withdraw
    withdrawButton.addEventListener('click', () => {
      const amount = parseFloat(transactionAmount.value);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      if (amount > currentUser.balance) {
        alert('Insufficient balance.');
        return;
      }
  
      currentUser.balance -= amount;
      updateUserData(currentUser);
      userBalanceDisplay.textContent = currentUser.balance.toFixed(2);
      alert(`₹${amount.toFixed(2)} withdrawn successfully!`);
      transactionAmount.value = '';
    });
  
    // Transfer Funds
    transferButton.addEventListener('click', () => {
      const recipientEmail = transferEmail.value.trim();
      const amount = parseFloat(transferAmount.value);
  
      if (!recipientEmail || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid email and amount.');
        return;
      }
  
      if (recipientEmail === currentUser.email) {
        alert('You cannot transfer money to yourself.');
        return;
      }
  
      if (amount > currentUser.balance) {
        alert('Insufficient balance for this transfer.');
        return;
      }
  
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const recipient = users.find(user => user.email === recipientEmail);
  
      if (!recipient) {
        alert('Recipient not found.');
        return;
      }
  
      // Update balances
      currentUser.balance -= amount;
      recipient.balance += amount;
  
      // Update users in LocalStorage
      updateUserData(currentUser);
      updateUserData(recipient);
  
      // Update displayed balance
      userBalanceDisplay.textContent = currentUser.balance.toFixed(2);
  
      alert(`Successfully transferred ₹${amount.toFixed(2)} to ${recipient.name}.`);
  
      // Clear input fields
      transferEmail.value = '';
      transferAmount.value = '';
    });
  
    // Save Button
    saveButton.addEventListener('click', () => {
      updateUserData(currentUser);
      saveCurrentUser();
      alert('Your session has been saved successfully.');
    });
  
    // Refresh Button
    refreshButton.addEventListener('click', () => {
      // Reload current user data from LocalStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUser = users.find(user => user.id === currentUser.id);
      if (updatedUser) {
        currentUser = updatedUser;
        saveCurrentUser();
        userBalanceDisplay.textContent = currentUser.balance.toFixed(2);
        alert('Dashboard refreshed.');
      } else {
        alert('User data not found. Please log in again.');
        logout();
      }
    });
  
    // Log Out
    logoutButton.addEventListener('click', () => {
      logout();
    });
  
    // Show Dashboard
    function showDashboard() {
      signupForm.classList.add('hidden');
      loginForm.classList.add('hidden');
      dashboard.classList.remove('hidden');
      userNameDisplay.textContent = currentUser.name;
      userBalanceDisplay.textContent = currentUser.balance.toFixed(2);
    }
  
    // Save Current User Session
    function saveCurrentUser() {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  
    // Update User Data in LocalStorage
    function updateUserData(updatedUser) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(user => user.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
      saveCurrentUser();
    }
  
    // Logout Function
    function logout() {
      currentUser = null;
      localStorage.removeItem('currentUser');
      dashboard.classList.add('hidden');
      loginForm.classList.remove('hidden');
      
      // Clear transaction fields
      transactionAmount.value = '';
      transferEmail.value = '';
      transferAmount.value = '';
      
      // Clear displayed user info
      userNameDisplay.textContent = '';
      userBalanceDisplay.textContent = '0.00';
    }
  });
  