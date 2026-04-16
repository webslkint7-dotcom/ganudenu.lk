import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import { resolveImageUrl } from '../utils/imageUrl';

const getListingImage = (listing) => {
  if (!listing) return '';
  return listing.image || listing.images?.[0] || '';
};

const getListingPath = (listing) => {
  if (!listing) return '';
  return `/${listing.type === 'VEHICLE' ? 'vehicle' : 'property'}/${listing._id}`;
};

export default function Messaging() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [activeListing, setActiveListing] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    let intervalId;
    
    const fetchInitial = async () => {
      try {
        const userRes = await API.get('/auth/me');
        if (!isMounted) return;
        setCurrentUser(userRes.data);

        const fetchConversations = async () => {
          try {
            const convRes = await API.get('/messages');
            
            // Group messages by user
            const grouped = [];
            const seen = new Set();
            convRes.data.forEach(m => {
              const otherUser = m.sender._id === userRes.data._id ? m.receiver : m.sender;
              if (!seen.has(otherUser._id)) {
                const unreadCount = convRes.data.filter((message) => {
                  const senderId = typeof message.sender === 'object' ? message.sender?._id : message.sender;
                  const receiverId = typeof message.receiver === 'object' ? message.receiver?._id : message.receiver;
                  return senderId === otherUser._id && receiverId === userRes.data._id && !message.isRead;
                }).length;

                grouped.push({
                  otherUser,
                  lastMessage: m.content,
                  createdAt: m.createdAt,
                  listing: m.listing,
                  unreadCount
                });
                seen.add(otherUser._id);
              }
            });
            if (isMounted) setConversations(grouped);
          } catch(err) {
            console.error(err);
          }
        };

        await fetchConversations();
        if (isMounted) {
          intervalId = setInterval(fetchConversations, 3000);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          navigate('/login');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInitial();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (activeUser) {
      const fetchThread = () => {
        API.get(`/messages/thread/${activeUser._id}`).then(res => {
          setMessages(prev => prev.length === res.data.length ? prev : res.data);
        }).catch(console.error);
      };
      
      fetchThread();
      API.put(`/messages/read/${activeUser._id}`).catch(console.error);
      const intervalId = setInterval(fetchThread, 3000);
      return () => clearInterval(intervalId);
    }
  }, [activeUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const unreadTotal = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);

  const renderListingPreview = (listing, compact = false) => {
    if (!listing) return null;

    return (
      <Link
        to={getListingPath(listing)}
        className={`group flex items-center gap-2 bg-[#F7F8FA] border border-[#E7E9ED] hover:border-[#0B1F5E] transition ${compact ? 'px-2 py-1' : 'p-3'}`}
      >
        <div className={`${compact ? 'w-8 h-8' : 'w-14 h-14'} rounded-sm overflow-hidden bg-white shrink-0 border border-[#E7E9ED]`}>
          <img
            src={resolveImageUrl(getListingImage(listing))}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className={`${compact ? 'text-[10px]' : 'text-sm'} font-bold text-[#2B3036] truncate group-hover:text-[#0B1F5E] transition`}>
            {listing.title}
          </div>
          <div className={`${compact ? 'text-[10px]' : 'text-xs'} text-[#6D7480]`}>Tap to open ad</div>
          <div className={`${compact ? 'text-[10px]' : 'text-xs'} font-bold text-[#0B1F5E] mt-0.5`}>
            LKR {listing.price?.toLocaleString()}
          </div>
        </div>
        <span className="text-[#9AA1AC] group-hover:text-[#0B1F5E] transition text-lg shrink-0">→</span>
      </Link>
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      const res = await API.post('/messages', {
        receiver: activeUser._id,
        listing: activeListing?._id,
        content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      alert('Error sending message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] text-[#1F2328] flex flex-col">
        <Navbar isAuthenticated={!!currentUser} />
        <div className="flex-1 flex items-center justify-center text-sm text-[#6D7480]">Loading messages...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1F2328] flex flex-col">
      <Navbar isAuthenticated={!!currentUser} />

      <section className="bg-white border-b border-[#ECEEF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-sm text-[#8A9099]">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#0B1F5E] transition">Home</Link>
            <span>/</span>
            <span className="text-[#434A54]">Messaging</span>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <section className="mb-6 bg-[#FFFFFF] border border-[#D9DEE8] rounded-sm p-6 sm:p-8">
          <h1 className="text-[30px] sm:text-[38px] font-extrabold text-[#262B31]">Messaging Center</h1>
          <p className="text-[#6D7480] mt-2 max-w-3xl leading-7">
            Manage conversations with buyers and sellers in one place. Select a chat and send your message.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 min-h-[70vh]">
        
        {/* Conversations Sidebar */}
        <aside className="bg-white rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-[70vh] flex flex-col overflow-hidden border border-[#E7E9ED]">
          <div className="p-5 border-b border-[#EEF0F3]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[20px] font-extrabold text-[#2B3036]">Inbox</h2>
              {unreadTotal > 0 && (
                <span className="min-w-6 h-6 px-2 rounded-full bg-[#0B1F5E] text-white text-[11px] font-bold inline-flex items-center justify-center">
                  {unreadTotal > 99 ? '99+' : unreadTotal}
                </span>
              )}
            </div>
            <div className="text-[12px] text-[#8A9099] mt-1">Recent conversations</div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-[#8A9099] text-sm">No active conversations yet.</div>
            ) : (
              conversations.map(conv => (
                <div 
                  key={conv.otherUser._id} 
                  onClick={() => {
                    setActiveUser(conv.otherUser);
                    setActiveListing(conv.listing);
                  }}
                  className={`p-4 border-b border-[#EEF0F3] cursor-pointer transition hover:bg-[#F9FAFB]
                  ${activeUser?._id === conv.otherUser._id ? 'bg-[#EAF0FF] border-l-4 border-l-[#0B1F5E]' : ''}`}
                >
                  <div className="flex gap-4">
                    {conv.listing ? (
                      <div className="w-11 h-11 rounded-sm overflow-hidden bg-[#F0F2F5] border border-[#E7E9ED] shrink-0">
                        <img
                          src={resolveImageUrl(getListingImage(conv.listing))}
                          alt={conv.listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 bg-[#F0F2F5] rounded-full flex items-center justify-center text-base font-bold text-[#2B3036]">
                        {conv.otherUser.fullname[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 text-xs gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-[#2B3036] truncate">{conv.otherUser.fullname}</span>
                          {conv.unreadCount > 0 && (
                            <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#0B1F5E] text-white text-[10px] font-bold inline-flex items-center justify-center">
                              {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <span className="text-[#9AA1AC] whitespace-nowrap">{new Date(conv.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-[#6D7480] truncate whitespace-nowrap overflow-hidden">{conv.lastMessage}</div>
                      {conv.listing && (
                        <div className="mt-2">
                          {renderListingPreview(conv.listing, true)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Messaging Area */}
        <section className="bg-[#FBFCFD] rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-[70vh] flex flex-col overflow-hidden border border-[#E7E9ED]">
          {activeUser ? (
            <>
              {/* Chat Header */}
              <div className="p-5 border-b border-[#EEF0F3] flex justify-between items-center bg-[#FAFBFC]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#111827] text-white rounded-full flex items-center justify-center font-bold">
                    {activeUser.fullname[0]}
                  </div>
                  <div>
                    <div className="font-bold text-[#2B3036]">{activeUser.fullname}</div>
                    <div className="text-[12px] text-[#6D7480]">Active conversation</div>
                  </div>
                </div>
                {activeListing && (
                  <Link
                    to={getListingPath(activeListing)}
                    className="hidden sm:flex items-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-sm overflow-hidden bg-[#F0F2F5] border border-[#E7E9ED] shrink-0">
                      <img
                        src={resolveImageUrl(getListingImage(activeListing))}
                        alt={activeListing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-[#2B3036] group-hover:text-[#0B1F5E] transition line-clamp-1 max-w-[220px]">{activeListing.title}</div>
                      <div className="text-[11px] font-bold text-[#0B1F5E]">LKR {activeListing.price?.toLocaleString()}</div>
                    </div>
                    <span className="text-lg text-[#9AA1AC] group-hover:text-[#0B1F5E] transition">→</span>
                  </Link>
                )}
              </div>

              {/* Chat Content */}
              <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#FBFCFD]">
                {messages.map((m, idx) => {
                  const isSentByMe = (m.sender._id || m.sender) === currentUser._id;
                  return (
                    <div key={idx} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] sm:max-w-[70%] rounded-sm px-4 py-3 border shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                        ${isSentByMe
                          ? 'bg-[#111827] text-white border-[#111827]'
                          : 'bg-white text-[#2B3036] border-[#E7E9ED]'}`}
                      >
                        {m.listing && (
                          <div className="mb-3">
                            {renderListingPreview(m.listing)}
                          </div>
                        )}
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                        <div className={`text-[10px] mt-2 ${isSentByMe ? 'text-white/70' : 'text-[#9AA1AC]'}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="mt-auto sticky bottom-0 p-4 sm:p-5 border-t border-[#EEF0F3] bg-[#FBFCFD]">
                {activeListing && (
                  <div className="mb-4">{renderListingPreview(activeListing)}</div>
                )}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 h-11 bg-[#F7F8FA] border border-[#E7E9ED] px-4 text-sm outline-none focus:border-[#0B1F5E]"
                  />
                  <button
                    type="submit"
                    className="h-11 px-6 bg-[#0B1F5E] text-white text-sm font-bold hover:bg-[#081742] transition"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#8A9099]">
              <div className="text-6xl mb-4">✉️</div>
              <h3 className="text-xl font-bold text-[#2B3036]">Select a conversation to start chatting</h3>
              <p className="text-sm mt-2 max-w-md">Choose a user from the inbox on the left to view messages and continue the discussion.</p>
            </div>
          )}
        </section>

        </div>

      </main>

      <Footer />

    </div>
  );
}
