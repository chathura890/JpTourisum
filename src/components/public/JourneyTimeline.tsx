import { motion } from 'framer-motion';


const JourneyTimeline = () => {
  const steps = [
    { icon: <i className="fas fa-home" style={{fontSize: '28px'}}></i>, title: "Your Location", desc: "Pickup from anywhere in Sri Lanka" },
    { icon: <i className="fas fa-car" style={{fontSize: '28px'}}></i>, title: "Transport", desc: "Comfortable ride to your destination" },
    { icon: <i className="fas fa-map" size={28} ></i>, title: "Arrival", desc: "Reach the location safely" },
    { icon: <i className="fas fa-crosshairs" style={{fontSize: '28px'}}></i>, title: "Tour Experience", desc: "Engage in your chosen activity" },
    { icon: <i className="fas fa-camera" style={{fontSize: '28px'}}></i>, title: "Memories", desc: "Experience the thrilling sights" },
    { icon: <i className="fas fa-arrows-rotate" style={{fontSize: '28px'}}></i>, title: "Return", desc: "Comfortable journey back" },
    { icon: <i className="fas fa-location-dot" style={{fontSize: '28px'}}></i>, title: "Destination", desc: "Safe drop-off at your next stop" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="py-16 overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container mx-auto px-4"
      >
        <div className="flex flex-col md:flex-row items-center justify-between relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-1 bg-gradient-to-r from-forest via-safari-gold to-forest opacity-30 z-0 rounded-full"></div>

          {/* Connecting Line (Mobile) */}
          <div className="md:hidden absolute top-10 bottom-10 left-12 w-1 bg-gradient-to-b from-forest via-safari-gold to-forest opacity-30 z-0 rounded-full"></div>

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="flex flex-row md:flex-col items-center md:text-center w-full md:w-[14%] relative z-10 mb-8 md:mb-0"
            >
              <div className="flex-shrink-0 w-24 flex justify-center md:w-auto">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-off-white shadow-xl flex items-center justify-center text-forest group-hover:text-safari-gold transition-colors hover:scale-110 duration-300 relative">
                  <div className="absolute inset-0 rounded-full border border-safari-gold/30 scale-110 animate-ping opacity-20"></div>
                  {step.icon}
                </div>
              </div>
              <div className="ml-6 md:ml-0 md:mt-6 flex-1">
                <h4 className="text-lg font-bold text-forest mb-1">{step.title}</h4>
                <p className="text-sm text-charcoal/70">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default JourneyTimeline;
