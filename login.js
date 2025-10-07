// login.js
// NO import from config.js needed anymore! The password is on the server.

document.addEventListener('DOMContentLoaded', () => {
    const AUTH_KEY = 'isAuthenticatedUntil';
    const EXPIRATION_HOURS = 24;
    
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    checkAndRedirectToIndex();

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const password = passwordInput.value;
        
        // 1. Prepare data to send to the serverless function (API)
        // Use URLSearchParams to simulate a standard form post
        const data = new URLSearchParams();
        data.append('password', password);

        errorMessage.textContent = 'Verifying...';
        errorMessage.style.display = 'block';

        try {
            // 2. Send the password to the Vercel API endpoint
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data.toString()
            });

            const result = await response.json();

            // 3. Check the server response status
            if (response.ok && result.success) {
                // Success: Server validated the password! Set the local timestamp.
                const expirationTime = new Date().getTime() + (EXPIRATION_HOURS * 60 * 60 * 1000);
                localStorage.setItem(AUTH_KEY, expirationTime);
                
                window.location.href = 'index.html';
            } else {
                // Failure: Server denied access (e.g., 401 Unauthorized)
                errorMessage.textContent = result.message || 'Login failed. Please try again.';
            }
        } catch (error) {
            console.error('Network or Server Error:', error);
            errorMessage.textContent = 'An unexpected error occurred.';
        }
        passwordInput.value = '';
    });

    function checkAndRedirectToIndex() {
        const storedTimestamp = localStorage.getItem(AUTH_KEY);
        const currentTime = new Date().getTime();

        if (storedTimestamp && currentTime < parseInt(storedTimestamp)) {
            window.location.href = 'index.html';
        }
    }
});