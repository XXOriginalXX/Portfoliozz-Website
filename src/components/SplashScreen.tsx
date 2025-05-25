import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Since localStorage isn't available in this environment, 
    // we'll simulate the behavior with session state
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900 overflow-hidden"
          style={{ 
            minHeight: '100vh',
            minHeight: '100dvh' // Dynamic viewport height for mobile browsers
          }}
        >
          <div className="text-center px-4 w-full max-w-sm mx-auto">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 sm:mb-4"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-white">P</span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3 sm:mb-2 leading-tight"
            >
              Portfoliozz
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-blue-400 text-base sm:text-lg leading-relaxed px-2"
            >
              Your Financial Future Starts Here
            </motion.p>
            
            {/* Optional loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-8 sm:mt-6"
            >
              <div className="w-16 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
