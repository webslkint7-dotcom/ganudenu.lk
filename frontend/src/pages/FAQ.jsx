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
    category: 'Selling',
    questions: [
      { q: 'How do I post an effective ad?', a: 'Ensure you use high-resolution photos and fill out all technical specifications. Verified ads with technical documents (deeds/floorplans) receive 4x more engagement.' },
      { q: 'What are Technical Documents?', a: 'These are property deeds, floorplans, or vehicle service history logs that prove asset authenticity and increase buyer trust.' },
      { q: 'Can I edit my ad after publishing?', a: 'Yes, you can manage and refine your listings at any time through your personal Dashboard.' }
    ]
  },
  {
    category: 'Security',
    questions: [
      { q: 'How does Buyer Protection work?', a: 'All communication is routed through our secure internal messaging system. We also offer optional escrow holding services for high-value transactions.' },
      { q: 'How do I report a suspicious listing?', a: 'Every listing has a "Report" flag. Our administrative moderation team reviews all reports within 12 business hours.' }
    ]
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredData = FAQ_DATA.map(section => ({
    ...section,
    questions: section.questions.filter(item => 
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      {/* Header Section */}
      <section className="bg-slate-900 pt-32 pb-48 px-6 relative overflow-hidden text-center">
        <div className="relative z-10 animate-fadeIn">
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">Elite Support Hub</h1>
          <p className="text-blue-400 font-bold uppercase tracking-[0.4em] text-xs">Self-Service Orientation & FAQS</p>
          
          <div className="mt-12 max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="Search for answers (e.g. 'Security', 'Refunds')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] px-10 py-6 text-white placeholder-white/30 outline-none focus:bg-white/20 focus:border-blue-700 transition-all shadow-2xl"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl group-hover:scale-110 transition">🔍</div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f8fafc] to-transparent"></div>
      </section>

      <main className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 pb-24">
        <div className="space-y-16">
           {filteredData.length > 0 ? (
             filteredData.map((section, sIdx) => (
                <div key={sIdx} className="space-y-6">
                   <h2 className="text-sm font-black text-blue-700 uppercase tracking-[0.4em] border-l-4 border-blue-700 pl-4">{section.category}</h2>
                   <div className="space-y-4">
                      {section.questions.map((item, qIdx) => {
                        const globalIdx = `${sIdx}-${qIdx}`;
                        const isOpen = openIndex === globalIdx;
                        
                        return (
                          <div key={qIdx} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:border-blue-700 transition-all duration-300">
                             <button 
                               onClick={() => toggleAccordion(globalIdx)}
                               className="w-full text-left px-8 py-6 flex items-center justify-between group"
                             >
                                <span className={`font-black text-lg transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-900'}`}>{item.q}</span>
                                <span className={`text-2xl transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-700' : 'text-slate-300'}`}>▾</span>
                             </button>
                             <div className={`px-8 transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="text-slate-600 font-medium leading-relaxed border-t border-slate-50 pt-6">
                                  {item.a}
                                </p>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             ))
           ) : (
             <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="text-6xl mb-4 grayscale opacity-20">🌫️</div>
                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No matching results found</h3>
                <p className="text-slate-400 mt-2 text-sm font-medium">Try broadening your search term or contact our support team.</p>
             </div>
           )}
        </div>

        {/* Support CTA */}
        <section className="mt-24 bg-blue-700 rounded-[3rem] p-16 text-center text-white relative overflow-hidden group">
           <div className="relative z-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Still Need Assistance?</h2>
              <p className="text-blue-100 font-medium mb-10 max-w-xl mx-auto opacity-80">Our specialized advisory team is available 24/7 for complex technical or operational inquiries.</p>
              <Link to="/contact" className="bg-white text-blue-700 hover:bg-slate-100 px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition shadow-xl inline-block active:scale-95">Get In Touch →</Link>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-150 duration-1000"></div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
