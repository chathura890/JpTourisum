

const Contact = () => {
  return (
    <div className="pt-28 pb-20 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-forest mb-4">Contact Us</h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Have a question about a custom booking, group tour, or specific requirements? Reach out to our 24/7 support team.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Contact Info */}
          <div className="lg:w-2/5 bg-forest p-10 text-white flex flex-col">
            <h3 className="text-2xl font-bold text-safari-gold mb-8">Get In Touch</h3>
            
            <div className="space-y-8 flex-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-phone text-safari-gold" style={{fontSize: '24px'}}></i>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Phone / WhatsApp</h4>
                  <p className="text-gray-300">+94 77 123 4567</p>
                  <p className="text-sm text-gray-400 mt-1">Available 24/7</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-safari-gold" style={{fontSize: '24px'}}></i>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-gray-300">hello@yalasafari.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-location-dot text-safari-gold" style={{fontSize: '24px'}}></i>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Head Office</h4>
                  <p className="text-gray-300">Yala National Park Road,<br/>Tissamaharama,<br/>Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-3/5 p-10">
            <h3 className="text-2xl font-bold text-forest mb-6">Send us a Message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-safari-gold" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-safari-gold" placeholder="john@example.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-safari-gold" placeholder="How can we help?" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-safari-gold resize-none" placeholder="Write your message here..."></textarea>
              </div>
              
              <button type="button" className="bg-forest hover:bg-jungle text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md flex items-center gap-2">
                <i className="fas fa-paper-plane" style={{fontSize: '18px'}}></i> Send Message
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Contact;
