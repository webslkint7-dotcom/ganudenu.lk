import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Classifieds Platform!</h1>
        <p className="mb-4">You are logged in. This is a placeholder dashboard page.</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
