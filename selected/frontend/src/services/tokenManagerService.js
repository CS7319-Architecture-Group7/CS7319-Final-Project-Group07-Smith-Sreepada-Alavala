import axios from 'axios';

const TokenManager = (navigate) => {
    // Function to get the remaining time for the token to expire in milliseconds
    const remainingTokenExpirationTime = (token) => {
        if (!token) return 0;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 - Date.now();
    }

    const isTokenExpired = (token) => {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post('/refresh-token', {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            throw new Error('Token refresh failed');
        }
    };

    const ensureToken = async () => {
        const token = localStorage.getItem('token');
        // If token is about to expire in 2 minutes, refresh it
        const remainingTokenValidity = remainingTokenExpirationTime(token);

        if (remainingTokenValidity > 0 && remainingTokenValidity < (2000 * 60)) {
            await refreshToken();
        }
        // If token is already expired, navigate to login page
        else if (isTokenExpired(token)) {
            throw new Error('Token expired');
        }
    };

    // Save token to local storage
    const saveToken = (token) => {
        localStorage.setItem('token', token);
    };

    return { ensureToken, saveToken };
};

export default TokenManager;