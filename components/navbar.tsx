import React, { useState } from 'react';
import { GraduationCap, Menu, ChevronDown } from 'lucide-react';
import path from 'path';

const Navbar: React.FC = () => {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const navItems = [
    { label: "Home", active: true, hasDropdown: false ,path: '/'},
    { label: "About", active: false, hasDropdown: false ,path: '/about'},
    { label: "News", active: false, hasDropdown: false , path: '/news'},
    { label: "Blog", active: false, hasDropdown: false, path: 'https://blog.inovuslabs.org' },
    { label: "Pages", active: false, hasDropdown: false, path: '/pages' },
    { label: "Contact", active: false, hasDropdown: false ,path: '/contact' },
  ];

  const handleOpenSignUp = () => {
    setShowSignUpModal(true);
    setShowSignInModal(false);
  };

  const handleOpenSignIn = () => {
    setShowSignInModal(true);
    setShowSignUpModal(false);
  };

  const handleCloseModals = () => {
    setShowSignUpModal(false);
    setShowSignInModal(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F0A27]/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Olabs</span>
            </a>
            <button className="hidden items-center gap-2 rounded-md px-3 py-2 text-green-400 transition hover:bg-white/5 lg:flex">
              <Menu className="h-5 w-5" />
              <span>Explore</span>
            </button>
          </div>

          {/* Center */}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.path}
                    className={`flex items-center gap-1 text-sm text-white/90 transition hover:text-white ${
                      item.active ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-4 sm:flex">
              <button
                className="text-sm text-white/90 transition hover:text-white"
                onClick={handleOpenSignIn}
              >
                Log in
              </button>
              <button
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0F0A27] transition hover:bg-white/90"
                onClick={handleOpenSignUp}
              >
                Sign up
              </button>
            </div>
            <button className="text-white lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button onClick={handleCloseModals}>Close</button>
            {/* Sign Up Form */}
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button onClick={handleCloseModals}>Close</button>
            {/* Sign In Form */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;