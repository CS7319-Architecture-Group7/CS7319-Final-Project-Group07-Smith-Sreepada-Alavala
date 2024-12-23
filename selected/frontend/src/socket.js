import { io } from 'socket.io-client';

console.log(process.env.REACT_APP_SELECTED_API_BASE_URL);

export const socket = io(process.env.REACT_APP_SELECTED_API_BASE_URL, {
    'reconnection': true,         // Enable reconnection
    'reconnectionDelay': 1000,    // Reconnect every 1 second
    'reconnectionAttempts': 600   // Try to reconnect 600 times (10 minutes)
  });