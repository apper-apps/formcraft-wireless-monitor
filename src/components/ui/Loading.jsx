import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="p-8">
<div className="p-8 lg:p-16 bg-gradient-to-br from-surface-50/30 to-surface-100/20 backdrop-blur-xl min-h-screen">
          <div className="animate-pulse">
<div className="flex justify-between items-center mb-12">
              <div className="space-y-3">
<div className="h-12 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-xl w-64 animate-pulse" style={{boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)'}}></div>
                <div className="h-6 bg-gray-200 rounded-lg w-80"></div>
</div>
              <div className="h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-48"></div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
              <div className="flex justify-between items-center">
<div className="flex gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl w-24 animate-pulse border border-primary-500/20"></div>
                  ))}
</div>
                <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
              </div>
</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
{Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-surface-100 p-8 rounded-2xl border-2 border-primary-500/20 animate-pulse" style={{boxShadow: '0 0 30px rgba(0, 212, 255, 0.1)'}}>
<div className="flex justify-between items-start mb-6">
                    <div className="space-y-3 flex-1">
                      <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
<div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
<div className="h-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded w-1/3"></div>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl" style={{boxShadow: '0 0 15px rgba(0, 212, 255, 0.2)'}}></div>
                  </div>
                  
<div className="space-y-3 mb-8">
                    <div className="h-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded w-1/4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-lg flex-1 border border-primary-500/20"></div>
                      <div className="h-8 bg-gray-200 rounded-lg flex-1"></div>
                      <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded-lg w-20"></div>
                      <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
                      <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "builder") {
    return (
      <div className="h-full flex">
        <div className="animate-pulse flex-1 p-6">
<div className="flex gap-8 h-full">
<div className="w-72 bg-surface-100 rounded-lg border border-primary-500/20 p-4" style={{boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)'}}>
              <div className="h-6 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded border border-primary-500/20 animate-pulse"></div>
                ))}
              </div>
            </div>
<div className="flex-1 bg-gradient-to-br from-white/30 to-gray-50/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl" style={{boxShadow: '0 0 30px rgba(139, 92, 246, 0.1), 0 20px 40px rgba(0, 212, 255, 0.05)'}}>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="w-80 bg-white rounded-lg border border-gray-100 p-4">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
<motion.div
          className="w-3 h-3 bg-primary-500 rounded-full"
          style={{boxShadow: '0 0 10px rgba(0, 212, 255, 0.6)'}}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-3 h-3 bg-accent-500 rounded-full"
          style={{boxShadow: '0 0 10px rgba(139, 92, 246, 0.6)'}}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
        />
        <motion.div
          className="w-3 h-3 bg-cyber-500 rounded-full"
          style={{boxShadow: '0 0 10px rgba(0, 255, 136, 0.6)'}}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
        />
      </motion.div>
    </div>
  );
};

export default Loading;