
import { motion } from 'framer-motion';

const MOCK_REVIEWS = [
  { id: 1, name: 'Sarah Jenkins', country: 'United Kingdom', rating: 5, date: 'Oct 12, 2026', text: 'Absolutely incredible! The booking process was so simple, and the driver picked us up right from our hotel in Ella. The safari tracker found a leopard within the first hour.' },
  { id: 2, name: 'Michael Chen', country: 'Singapore', rating: 5, date: 'Sep 28, 2026', text: 'Very professional service. The transport vehicle was a brand new hybrid, very comfortable. The safari jeep was rugged but safe. Highly recommend the full-day package.' },
  { id: 3, name: 'Elena Rossi', country: 'Italy', rating: 4, date: 'Sep 15, 2026', text: 'Great experience overall. We saw elephants, crocodiles, and beautiful birds. The driver was very punctual. Only giving 4 stars because the park was a bit crowded, but the company itself was perfect.' },
  { id: 4, name: 'David Smith', country: 'Australia', rating: 5, date: 'Aug 02, 2026', text: 'Seamless from start to finish. We booked the return transport to Mirissa after the safari, and the transition between the jeep and the car was flawless.' },
];

const Feedback = () => {
  return (
    <div className="pt-28 pb-20 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-forest mb-4">Traveler Feedback</h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Read what our recent guests have to say about their Tour Rides experience. We take pride in delivering unforgettable journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_REVIEWS.map((review, idx) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-forest">{review.name}</h3>
                  <p className="text-sm text-gray-400">{review.country}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < review.rating ? "text-safari-gold" : "text-gray-300"}`} style={{fontSize: '16px'}}></i>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
              </div>
              
              <p className="text-charcoal/80 italic leading-relaxed">
                "{review.text}"
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Feedback;
