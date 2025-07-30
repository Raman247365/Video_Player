'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import VoiceControl from '@/components/VoiceControl';

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleVoiceCommand = useCallback((command: string, params?: any) => {
    console.log('Navbar voice command:', command, params);
  }, []);

  const [voiceState, voiceActions] = useVoiceControl(handleVoiceCommand);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { name: 'Home', path: '/' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 relative group">
            <Link href="/" className="text-white font-bold text-xl flex items-center gap-2">
              <div className="relative">
                <span className="text-2xl">vX</span>
                {/* Animated accent */}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
                <span className="absolute -top-1 right-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300 delay-100"></span>
                <span className="absolute -left-1 top-0 h-0 w-[1px] bg-white group-hover:h-full transition-all duration-300 delay-200"></span>
                <span className="absolute -right-1 bottom-0 h-0 w-[1px] bg-white group-hover:h-full transition-all duration-300 delay-300"></span>
                
                {/* Glowing dot */}
                <span className="absolute -right-2 -top-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
              </div>
              <span className="hidden sm:block">vcXvp</span>
            </Link>
          </div>

          {/* Command Hint */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="px-3 py-1 bg-gray-900/50 border border-gray-700/50 rounded-md text-xs text-gray-400 backdrop-blur-sm relative group">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border border-gray-600 rounded text-center leading-3 text-[10px] group-hover:border-white group-hover:text-white transition-colors">/</span>
                <span className="group-hover:text-white transition-colors">Command Prompt</span>
              </span>
              <div className="absolute -inset-px bg-gradient-to-r from-transparent via-gray-600/20 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="flex items-baseline space-x-4 mr-4">
              {navItems.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <div 
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <Link
                      href={item.path}
                      className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.name}
          </Link>

                    {/* Active/hover indicator */}
                    <span 
                      className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-300 ${
                        isActive ? 'w-full' : hoverIndex === index ? 'w-full' : 'w-0'
                      }`}
                    ></span>
                    
                    {/* Tech dots */}
                    {(isActive || hoverIndex === index) && (
                      <>
                        <span className="absolute -left-1 bottom-0 w-1 h-1 bg-white rounded-full animate-pulse"></span>
                        <span className="absolute -right-1 bottom-0 w-1 h-1 bg-white rounded-full animate-pulse"></span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Voice Control */}
            <VoiceControl
              isListening={voiceState.isListening}
              isSupported={voiceState.isSupported}
              status={voiceState.status}
              lastCommand={voiceState.lastCommand}
              voiceFeedbackEnabled={true}
              onToggleListening={voiceActions.toggleListening}
              onToggleVoiceFeedback={() => {}}
              onShowCommands={() => {}}
            />
          </div>

          {/* Mobile Command Hint */}
          <div className="md:hidden flex items-center mr-4">
            <div className="px-2 py-1 bg-gray-900/50 border border-gray-700/50 rounded text-xs text-gray-400">
              <span className="w-3 h-3 border border-gray-600 rounded text-center leading-2 text-[8px] inline-block mr-1">/</span>
              <span>CMD</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span 
                  className={`absolute left-0 block w-6 h-0.5 bg-white transform transition-all duration-300 ${
                    menuOpen ? 'top-3 rotate-45' : 'top-2'
                  }`}
                ></span>
                <span 
                  className={`absolute left-0 block w-6 h-0.5 bg-white transform transition-all duration-300 ${
                    menuOpen ? 'opacity-0' : 'top-3 opacity-100'
                  }`}
                ></span>
                <span 
                  className={`absolute left-0 block w-6 h-0.5 bg-white transform transition-all duration-300 ${
                    menuOpen ? 'top-3 -rotate-45' : 'top-4'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-60' : 'max-h-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
  return (
              <Link
                key={item.name}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium relative overflow-hidden group ${
                  isActive ? 'text-white bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-[2px] bg-white"></span>
      )}
    </Link>
            );
          })}
        </div>
      </div>
      
      {/* Tech line decoration */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      {/* Scanning line effect */}
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`} style={{ animation: 'scanHorizontal 4s linear infinite' }}></div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-white/20"></div>
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-white/20"></div>
    </nav>
  );
};

export default Navbar; 