import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api';

export default function Messaging() {
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [activeListing, setActiveListing] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    let isMounted = true;
    let intervalId;
    
    const fetchInitial = async () => {
      const token = localStorage.getItem('token');
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
                grouped.push({
                  otherUser,
                  lastMessage: m.content,
                  createdAt: m.createdAt,
                  listing: m.listing
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
      const token = localStorage.getItem('token');
      const fetchThread = () => {
        API.get(`/messages/thread/${activeUser._id}`).then(res => {
          setMessages(prev => prev.length === res.data.length ? prev : res.data);
        }).catch(console.error);
      };
      
      fetchThread();
      const intervalId = setInterval(fetchThread, 3000);
      return () => clearInterval(intervalId);
    }
  }, [activeUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const token = localStorage.getItem('token');
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

  if (loading) return <div className="flex items-center justify-center min-h-screen">Connecting Secure Message Hub...</div>;

  return (
    <div className="bg-[#fafbfa] h-screen flex flex-col font-sans overflow-hidden">
      <Navbar isAuthenticated={true} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full flex gap-1 py-8 px-6 overflow-hidden">
        
        {/* Conversations Sidebar */}
        <div className="w-80 bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-black text-navy uppercase tracking-tighter">Secure Inbox</h2>
            <div className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">VERIFIED CHANNELS ONLY</div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-12 text-center text-gray-400 italic text-sm">No active trade communications.</div>
            ) : (
              conversations.map(conv => (
                <div 
                  key={conv.otherUser._id} 
                  onClick={() => {
                    setActiveUser(conv.otherUser);
                    setActiveListing(conv.listing);
                  }}
                  className={`p-6 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 
                  ${activeUser?._id === conv.otherUser._id ? 'bg-slate-50 border-l-4 border-l-navy shadow-inner' : ''}`}
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-black shadow-sm">
                      {conv.otherUser.fullname[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 text-xs">
                        <span className="font-black text-navy truncate uppercase tracking-tight">{conv.otherUser.fullname}</span>
                        <span className="text-gray-400">{new Date(conv.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 truncate whitespace-nowrap overflow-hidden">{conv.lastMessage}</div>
                      {conv.listing && (
                        <div className="mt-2 text-[10px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full inline-block truncate max-w-full">
                          REF: {conv.listing.title.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messaging Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden border border-gray-100">
          {activeUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-black">
                    {activeUser.fullname[0]}
                  </div>
                  <div>
                    <div className="font-black text-navy uppercase tracking-tight">{activeUser.fullname}</div>
                    <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                      ENCRYPTED CHANNEL
                    </div>
                  </div>
                </div>
                {activeListing && (
                  <Link 
                    to={`/${activeListing.type === 'VEHICLE' ? 'vehicle' : 'property'}/${activeListing._id}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="text-right">
                       <div className="text-xs font-black text-zinc-900 group-hover:text-navy transition">{activeListing.title.toUpperCase()}</div>
                       <div className="text-[10px] font-black text-yellow-600">${activeListing.price?.toLocaleString()}</div>
                    </div>
                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                )}
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((m, idx) => {
                  const isSentByMe = (m.sender._id || m.sender) === currentUser._id;
                  return (
                    <div key={idx} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm relative group
                        ${isSentByMe 
                          ? 'bg-navy text-white rounded-tr-none' 
                          : 'bg-gray-100 text-slate-800 rounded-tl-none'}`}
                      >
                        <div className="text-sm font-medium leading-relaxed">{m.content}</div>
                        <div className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-40 
                          ${isSentByMe ? 'text-white' : 'text-gray-500'}`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-100 bg-gray-50/10">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter your message regarding the trade..."
                    className="flex-1 bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:border-navy outline-none shadow-sm transition-all text-sm font-medium"
                  />
                  <button 
                    type="submit"
                    className="bg-navy text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-navy-light shadow-lg active:scale-95 transition-all outline-none"
                  >
                    SEND
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 p-12">
               <div className="text-8xl mb-8">✉️</div>
               <h3 className="text-2xl font-black uppercase tracking-widest">Select a Secure Communication<br />to Begin Negotiation</h3>
               <p className="text-sm italic mt-4 max-w-sm">Every message sent through the Curated Authority is monitored for safety and integrity.</p>
            </div>
          )}
        </div>

      </main>

    </div>
  );
}
