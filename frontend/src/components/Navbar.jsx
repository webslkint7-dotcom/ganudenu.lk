import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Navbar({ isAuthenticated }) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    let isMounted = true;

    const fetchUnreadCount = async () => {
      try {
        const meRes = await API.get('/auth/me');
        const messagesRes = await API.get('/messages');
        const count = messagesRes.data.filter((message) => {
          const receiverId = typeof message.receiver === 'object' ? message.receiver?._id : message.receiver;
          return receiverId === meRes.data._id && !message.isRead;
        }).length;

        if (isMounted) {
          setUnreadCount(count);
        }
      } catch (error) {
        if (isMounted) {
          setUnreadCount(0);
        }
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  return (
    <nav className="sticky top-0 z-50 w-full shadow-sm">
      <div className="bg-white border-b border-[#ECECEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 bg-[#0B1F5E] rounded-sm flex items-center justify-center text-white font-black text-lg">G</div>
            <div className="leading-tight">
              <p className="text-[24px] font-extrabold tracking-tight text-[#1E2024]">ganudenu.lk</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#9197A3] font-semibold">Classified Marketplace</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-[#555B65]">
            <Link to="/" className="hover:text-[#0B1F5E] transition">Home</Link>
            <Link to="/all-ads" className="hover:text-[#0B1F5E] transition">Listings</Link>
            <Link to="/contact" className="hover:text-[#0B1F5E] transition">Contact</Link>
            {isAuthenticated && (
              <Link to="/messaging" className="hover:text-[#0B1F5E] transition inline-flex items-center gap-2">
                <span>Messages</span>
                {unreadCount > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#0B1F5E] text-white text-[11px] font-bold inline-flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 text-[13px]">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hidden sm:inline text-[#5C616B] font-semibold hover:text-[#0B1F5E] transition">My Account</Link>
                <button onClick={handleLogout} className="hidden sm:inline text-[#5C616B] font-semibold hover:text-[#0B1F5E] transition">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline text-[#5C616B] font-semibold hover:text-[#0B1F5E] transition">Sign In</Link>
                <Link to="/signup" className="hidden sm:inline text-[#5C616B] font-semibold hover:text-[#0B1F5E] transition">Register</Link>
              </>
            )}

            <Link
              to="/post-ad"
              className="bg-[#0B1F5E] text-white px-4 h-10 inline-flex items-center rounded-sm font-bold hover:bg-[#081742] transition"
            >
              + Post an Ad
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#1E1F23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-11 overflow-x-auto whitespace-nowrap flex items-center gap-2 text-white/85 text-[12px]">
          {['Properties', 'Vehicles'].map((item) => (
            <Link
              key={item}
              to={`/all-ads?category=${encodeURIComponent(item)}`}
              className="px-3 py-1.5 rounded-sm hover:bg-[#2B2D33] transition font-semibold"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
