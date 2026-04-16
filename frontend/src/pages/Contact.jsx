import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1F2328]">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      <section className="bg-white border-b border-[#ECEEF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-sm text-[#8A9099]">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#0B1F5E] transition">Home</Link>
            <span>/</span>
            <span className="text-[#434A54]">Contact</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <section className="mb-6 bg-[#FFFFFF] border border-[#D9DEE8] rounded-sm p-6 sm:p-8">
          <h1 className="text-[30px] sm:text-[38px] font-extrabold text-[#262B31]">Get in Touch</h1>
          <p className="text-[#6D7480] mt-2 max-w-3xl leading-7">
            Have a question about properties, vehicles, or your account? Send us a message and our support team will get back to you as soon as possible.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
          <aside className="space-y-4">
            <div className="bg-white border border-[#E7E9ED] rounded-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#9AA1AC] font-semibold mb-2">Address</p>
              <h3 className="text-[17px] font-bold text-[#2B3036]">Main Office</h3>
              <p className="text-sm text-[#6D7480] mt-2 leading-6">No. 120/A, Main Road, Colombo 07, Sri Lanka</p>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#9AA1AC] font-semibold mb-2">Phone</p>
              <h3 className="text-[17px] font-bold text-[#2B3036]">Support Hotline</h3>
              <p className="text-sm text-[#6D7480] mt-2 leading-6">+94 77 123 4567<br />+94 11 987 6543</p>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#9AA1AC] font-semibold mb-2">Email</p>
              <h3 className="text-[17px] font-bold text-[#2B3036]">Customer Care</h3>
              <p className="text-sm text-[#6D7480] mt-2 leading-6">support@ganudenu.lk<br />help@ganudenu.lk</p>
            </div>
          </aside>

          <section>
            <div className="bg-white border border-[#E7E9ED] rounded-sm p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B3036]">Send us a message</h2>
              <p className="text-sm text-[#6D7480] mt-2 mb-6">
                Fill in the form below and we will respond shortly.
              </p>

              {submitted ? (
                <div className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-sm text-center">
                  <h3 className="text-xl font-bold">Message sent successfully</h3>
                  <p className="text-sm mt-2">Our team will contact you within 24 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#434A54] mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 bg-[#F7F8FA] border border-[#E7E9ED] px-4 text-sm outline-none focus:border-[#0B1F5E]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#434A54] mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 bg-[#F7F8FA] border border-[#E7E9ED] px-4 text-sm outline-none focus:border-[#0B1F5E]"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#434A54] mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-11 bg-[#F7F8FA] border border-[#E7E9ED] px-4 text-sm outline-none focus:border-[#0B1F5E]"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#434A54] mb-2">Message</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full bg-[#F7F8FA] border border-[#E7E9ED] px-4 py-3 text-sm outline-none focus:border-[#0B1F5E] resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>

                  <button type="submit" className="w-full h-11 bg-[#0B1F5E] text-white text-sm font-bold hover:bg-[#081742] transition">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 bg-white border border-[#E7E9ED] rounded-sm p-6 sm:p-8 text-center">
          <h2 className="text-2xl font-extrabold text-[#2B3036]">Need quick answers?</h2>
          <p className="text-[#6D7480] mt-2 mb-5">Visit our FAQ page for common questions about posting ads and managing your account.</p>
          <Link to="/faq" className="inline-flex h-11 px-6 items-center justify-center bg-[#111827] text-white text-sm font-bold hover:bg-[#000000] transition">
            Go to FAQ
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
