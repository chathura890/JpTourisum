import { useState } from 'react';
import { motion } from 'framer-motion';


const steps = [
  "Pickup",
  "Transport",
  "Safari",
  "Return",
  "Details",
  "Review",
  "Payment"
];

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="pt-28 pb-20 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-forest mb-8 text-center">Book Your Journey</h1>
        
        {/* Stepper */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex items-center min-w-max px-4">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              
              return (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                        isCompleted 
                          ? 'bg-forest text-white' 
                          : isCurrent 
                            ? 'bg-safari-gold text-forest ring-4 ring-safari-gold/20' 
                            : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}
                    >
                      {isCompleted ? <i className="fas fa-check" style={{fontSize: '18px'}}></i> : stepNumber}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${isCurrent || isCompleted ? 'text-forest' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-12 sm:w-20 md:w-32 h-1 mx-2 rounded-full ${
                      isCompleted ? 'bg-forest' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10 min-h-[400px] flex flex-col"
        >
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-forest mb-6">{steps[currentStep - 1]} Information</h2>
            <p className="text-gray-600 mb-8">Please fill in the required information for this step of your journey.</p>
            
            {/* Placeholder for actual step forms */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
              Form content for {steps[currentStep - 1]} goes here.
            </div>
          </div>
          
          <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-gray-200 text-forest hover:bg-gray-50'
              }`}
            >
              Back
            </button>
            <button 
              onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
              className="bg-forest hover:bg-safari-gold text-white hover:text-forest px-8 py-3 rounded-xl font-bold transition-colors shadow-md flex items-center gap-2"
            >
              {currentStep === steps.length ? 'Confirm Payment' : 'Continue'}
              {currentStep !== steps.length && <i className="fas fa-chevron-right" style={{fontSize: '18px'}}></i>}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
