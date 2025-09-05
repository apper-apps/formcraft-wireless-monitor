import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Form Builder", href: "/builder", icon: "FormInput" }
  ];

  return (
    <>
      {/* Mobile overlay - only shows on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" 
          onClick={onClose} 
        />
      )}
      
      {/* Desktop Sidebar - always visible on desktop */}
<motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
        }}
className="hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col w-72 bg-white border-r border-gray-200"
      >
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
<div className="flex items-center flex-shrink-0 px-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="FormInput" className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-display font-bold text-gray-900">
                FormCraft
              </h1>
            </div>
          </div>
          
<nav className="mt-8 flex-1 px-4 space-y-2">
            {navigation.map((item) => {
const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
className={`flex items-center px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium ${isActive ? 'text-primary-600 bg-primary-50' : ''}`}
                >
                  <ApperIcon name={item.icon} className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-500' : 'text-surface-700'}`} />
                  <span className="tracking-wide">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </motion.div>
      
      {/* Mobile Sidebar - slides in from left on mobile */}
      <motion.div
className="fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 lg:hidden"
        initial={false}
        animate={{ 
          transform: isOpen ? 'translateX(0%)' : 'translateX(-100%)'
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut" 
        }}
      >
        <div className="flex flex-col h-full">
<div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
<div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="FormInput" className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-2 text-xl font-display font-bold text-gray-900">
                FormCraft
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
<ApperIcon name="X" className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
className={`flex items-center px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium ${isActive ? 'text-primary-600 bg-primary-50' : ''}`}
                >
                  <ApperIcon name={item.icon} className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-700'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;