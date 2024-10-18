import React, { useEffect, useState } from 'react';
import TokenManager from '../services/tokenManagerService';

function PollList() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const tokenManager = TokenManager();
      await tokenManager.ensureToken();
      
      const response = await fetch('/api/poll', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setPolls(data);
    };

    fetchPolls();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl mb-4">Active Polls</h1>
      <ul>
        {polls.map((poll) => (
          <li key={poll.id} className="mb-2 p-2 border border-gray-300 rounded">
            {poll.QuestionText}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PollList;