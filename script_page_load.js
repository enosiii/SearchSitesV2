document.addEventListener('DOMContentLoaded', () => {
    const AUTH_KEY = 'isAuthenticatedUntil';

    function checkAuthentication() {
        const storedTimestamp = localStorage.getItem(AUTH_KEY);
        const currentTime = new Date().getTime();

        // 1. Check if a valid timestamp exists
        if (!storedTimestamp || currentTime >= parseInt(storedTimestamp)) {
            // If no timestamp or it's expired, redirect to login
            
            // Optional: Clear the expired key
            if (storedTimestamp) {
                localStorage.removeItem(AUTH_KEY);
            }

            // Redirect to login page
            window.location.href = 'login.html';  //test only login.html
        } else {
            // User is authenticated
            console.log('User authenticated. Access granted.');
        }
    }

    // Run the check immediately when the index.html loads
    checkAuthentication();

    // Add a logout function
    document.getElementById('logout-button')?.addEventListener('click', () => {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = 'login.html';
    });
});