import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQ_DATA = [
  {
    category: 'General',
    questions: [
      { q: 'What is The Editorial Classifieds?', a: 'The Editorial is a premium classifieds marketplace for verified properties, vehicles, and high-end services, focused on delivering a secure and elite trading experience.' },
      { q: 'Is it free to use?', a: 'Browsing is 100% free. We offer both competitive basic listing options and premium "Verified Curator" packages for high-visibility advertisements.' },
      { q: 'How do I contact a seller?', a: 'Each listing features a "Secure Inquiry" portal. Simply enter your message, and the owner will receive a real-time notification on their dashboard.' }
    ]
  },
  {
    category: 'Posting Ads',
    questions: [
      { q: 'How do I post an effective ad?', a: 'Ensure you use high-resolution photos and fill out all technical specifications. Verified ads with technical documents (deeds/floorplans) receive 4x more engagement.' },
      { q: 'What are Technical Documents?', a: 'These are property deeds, floorplans, or vehicle service history logs that prove asset authenticity and increase buyer trust.' },
      { q: 'Can I edit my ad after publishing?', a: 'Yes, you can manage and refine your listings at any time through your personal Dashboard.' },
      { q: 'What should I include in my ad title?', a: 'Use a clear title with the item type, key feature, and location where possible. A strong title helps buyers find your ad faster.' },
      { q: 'How many images should I upload?', a: 'Upload as many clear images as possible. We recommend at least 4 to 6 photos so buyers can understand the condition of the item.' }
    ]
  },
  {
    category: 'Payments',
    questions: [
      { q: 'How do I pay for a premium listing?', a: 'You can choose a boost or premium package during the ad posting process. Payment options depend on your selected package and current campaign settings.' },
      { q: 'Are there any hidden fees?', a: 'No hidden fees are added at checkout. Any paid feature or boost is clearly shown before you confirm.' },
      { q: 'Can I change my package later?', a: 'Yes, you can upgrade an active listing from your dashboard if a higher package is available for that ad.' },
      { q: 'Do you refund paid boosts?', a: 'Boost purchases are usually non-refundable once activated, but support can review special cases if there was a technical issue.' }
    ]
  },
  {
    category: 'Messaging',
    questions: [
      { q: 'How do I send a message about an ad?', a: 'Open the listing, type your message in the contact box, and send it directly to the seller with the ad details attached.' },
      { q: 'Where can I see my conversations?', a: 'All chats appear in the Messaging page, where you can view active conversations, unread counts, and attached listing previews.' },
      { q: 'Can I open the ad from a message?', a: 'Yes. Every conversation with a listing shows the ad card, and you can open the original ad directly from that preview.' },
      { q: 'Why is my message not sending?', a: 'Make sure you are logged in, the seller account exists, and your internet connection is stable. If the problem continues, try refreshing and sending again.' }
    ]
  },
  {
    category: 'Account Settings',
    questions: [
      { q: 'How do I change my profile details?', a: 'Go to your Profile page and update your name, phone number, location, or bio, then save the changes.' },
      { q: 'How do I reset my password?', a: 'Use the password reset option on the login screen or update your password from account settings if that option is available in your profile.' },
      { q: 'Can I update my phone number?', a: 'Yes. You can add or change your phone number from your profile settings, and it will be used for contact details on your ads and messages.' },
      { q: 'How do I sign out?', a: 'Use the Sign Out button in the top navigation bar to safely end your session.' }
    ]
  },
  {
    category: 'Safety',
    questions: [
      { q: 'How does Buyer Protection work?', a: 'All communication is routed through our secure internal messaging system. We also offer optional escrow holding services for high-value transactions.' },
      { q: 'How do I report a suspicious listing?', a: 'Every listing has a "Report" flag. Our administrative moderation team reviews all reports within 12 business hours.' },
      { q: 'Should I meet buyers in public?', a: 'Yes. For safety, always meet in a public place and avoid sharing unnecessary personal information.' },
      { q: 'How can I avoid scams?', a: 'Never send money before verifying the seller, inspect the item carefully, and keep all communication inside the platform when possible.' }
    ]
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTopic, setActiveTopic] = useState('All');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const normalize = (value) => String(value || '').toLowerCase();

  const matchesTopic = (sectionCategory, item) => {
    if (activeTopic === 'All') return true;

    const category = normalize(sectionCategory);
    const topic = normalize(activeTopic);
    const question = normalize(item.q);
    const answer = normalize(item.a);

    if (category === topic) return true;
    return question.includes(topic) || answer.includes(topic);
  };

  const filteredData = FAQ_DATA.map(section => ({
    ...section,
    questions: section.questions.filter(item => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = query === '' || item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query);
      return matchesTopic(section.category, item) && matchesSearch;
    })
  })).filter(section => section.questions.length > 0);

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1F2328]">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      <section className="bg-white border-b border-[#ECEEF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-sm text-[#8A9099]">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#0B1F5E] transition">Home</Link>
            <span>/</span>
            <span className="text-[#434A54]">FAQ</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <section className="mb-6 bg-[#FFFFFF] border border-[#D9DEE8] rounded-sm p-6 sm:p-8">
          <div className="max-w-3xl">
            <h1 className="text-[30px] sm:text-[38px] font-extrabold text-[#262B31]">Frequently Asked Questions</h1>
            <p className="text-[#6D7480] mt-2 leading-7">
              Find quick answers about posting ads, managing your account, and using the marketplace.
            </p>
          </div>

          <div className="mt-6 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions, topics, or keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 bg-white border border-[#E7E9ED] px-4 pr-12 text-sm outline-none focus:border-[#0B1F5E]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9AA1AC]">⌕</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <section className="space-y-6">
            {filteredData.length > 0 ? (
              filteredData.map((section, sIdx) => (
                <div key={sIdx} className="bg-white border border-[#E7E9ED] rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 border-b border-[#EEF0F3] flex items-center justify-between gap-3">
                    <h2 className="text-[20px] font-extrabold text-[#2B3036]">{section.category}</h2>
                    <span className="text-[11px] font-semibold text-[#9AA1AC] uppercase tracking-[0.14em]">Support</span>
                  </div>

                  <div className="divide-y divide-[#EEF0F3]">
                    {section.questions.map((item, qIdx) => {
                      const globalIdx = `${sIdx}-${qIdx}`;
                      const isOpen = openIndex === globalIdx;

                      return (
                        <div key={qIdx} className="bg-white">
                          <button
                            onClick={() => toggleAccordion(globalIdx)}
                            className="w-full px-5 sm:px-6 py-5 text-left flex items-start justify-between gap-4 hover:bg-[#FAFBFC] transition"
                          >
                            <span className={`text-[15px] sm:text-[16px] font-bold leading-6 ${isOpen ? 'text-[#0B1F5E]' : 'text-[#2B3036]'}`}>
                              {item.q}
                            </span>
                            <span className={`text-[#9AA1AC] text-lg transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#0B1F5E]' : ''}`}>
                              ▾
                            </span>
                          </button>
                          <div className={`${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300`}>
                            <div className="px-5 sm:px-6 pb-5">
                              <p className="text-sm sm:text-[15px] text-[#6D7480] leading-7 border-t border-[#EEF0F3] pt-4">
                                {item.a}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-[#E7E9ED] rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center py-16 px-6">
                <div className="text-5xl mb-4 opacity-20">🌫️</div>
                <h3 className="text-[20px] font-extrabold text-[#2B3036]">No matching results found</h3>
                <p className="text-[#6D7480] mt-2 text-sm leading-6">Try a different keyword or contact support for help.</p>
                <Link to="/contact" className="inline-flex mt-6 h-11 px-6 items-center justify-center bg-[#0B1F5E] text-white text-sm font-bold hover:bg-[#081742] transition">
                  Contact Support
                </Link>
              </div>
            )}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="bg-white border border-[#E7E9ED] rounded-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#9AA1AC] font-semibold mb-2">Need more help?</p>
              <h3 className="text-[18px] font-bold text-[#2B3036]">Talk to support</h3>
              <p className="text-sm text-[#6D7480] mt-2 leading-6">If you cannot find the answer here, reach out to our support team.</p>
              <Link to="/contact" className="inline-flex mt-4 h-11 px-5 items-center justify-center bg-[#111827] text-white text-sm font-bold hover:bg-black transition">
                Contact Us
              </Link>
            </div>

            <div className="bg-[#FFFFFF] border border-[#D9DEE8] rounded-sm p-5">
              <h3 className="text-[18px] font-bold text-[#262B31]">Popular topics</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {['All', 'Posting Ads', 'Payments', 'Messaging', 'Account Settings', 'Safety'].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setActiveTopic(topic);
                      setOpenIndex(null);
                    }}
                    className={`px-3 py-2 border text-xs font-semibold transition ${activeTopic === topic ? 'bg-[#0B1F5E] border-[#0B1F5E] text-white' : 'bg-white border-[#E7E9ED] text-[#434A54] hover:border-[#0B1F5E] hover:text-[#0B1F5E]'}`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
