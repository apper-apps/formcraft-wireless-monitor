import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Sidebar from "@/components/organisms/Sidebar";
import Button from "@/components/atoms/Button";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    await logout();
  };

// Redirect to login if not authenticated - moved to useEffect to avoid setState during render
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Return null while redirecting to prevent flash of content
  if (!isAuthenticated) {
    return null;
  }

  return (
<div 
className={`h-screen bg-white flex ${sidebarOpen ? 'overflow-hidden' : ''}`}
      onKeyDown={(e) => {
        // Global keyboard shortcuts for layout
        if (e.altKey && e.key === 'm') {
          e.preventDefault();
          setSidebarOpen(!sidebarOpen);
        }
        // Mobile: Escape key closes sidebar
        if (e.key === 'Escape' && sidebarOpen) {
          e.preventDefault();
          setSidebarOpen(false);
        }
      }}
      tabIndex={-1}
    >
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div 
className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72 ml-0' : 'ml-0'
        }`}
      >
        {/* Mobile header */}
<div className="lg:hidden bg-white shadow-md border-b border-gray-300 px-4 py-3 relative z-50">
          <div className="flex items-center justify-between">
<button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="interactive-element focus-ring p-3 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={sidebarOpen}
              tabIndex={0}
            >
              <ApperIcon name="Menu" size={24} className="text-gray-600" />
            </button>
            
<div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="FormInput" size={20} className="text-white" />
</div>
<h1 className="ml-2 text-xl font-display font-black text-gray-900">
                FormCraft
              </h1>
            </div>
            
<Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
            >
<ApperIcon name="LogOut" size={16} className="text-gray-600" />
              Logout
            </Button>
          </div>
        </div>

        {/* Desktop header with user info and logout */}
<div className="hidden lg:block bg-white shadow-md border-b border-gray-300 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
<button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                title="Toggle sidebar (Alt+M)"
                tabIndex={0}
              >
<ApperIcon name="Menu" className="w-6 h-6 text-gray-600" />
              </button>
<h2 className="text-2xl font-display font-black text-gray-900">FormCraft</h2>
              {user && (
<div className="text-sm text-gray-800 font-medium">
                  Welcome, {user.firstName || user.name || user.emailAddress}
                </div>
              )}
            </div>
<Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
            >
<ApperIcon name="LogOut" size={16} className="text-gray-600" />
              Logout
            </Button>
          </div>
        </div>
        
<main 
          className="flex-1 relative overflow-y-auto focus:outline-none"
          tabIndex={-1}
          role="main"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;