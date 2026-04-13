/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Editor from './components/Editor';
import { Toaster } from '@/components/ui/sonner';
import { Sparkles, Camera, Image as ImageIcon, Github } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-primary/10 selection:text-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Lumina Studio</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-primary transition-colors">Features</a>
            <a href="#" className="hover:text-primary transition-colors">Showcase</a>
            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
              <Github className="w-5 h-5" />
            </button>
            <div className="h-4 w-[1px] bg-zinc-200 mx-1" />
            <button className="text-sm font-semibold text-zinc-900 hover:text-primary transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main>
        <Editor />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-xl tracking-tight">Lumina Studio</span>
              </div>
              <p className="text-zinc-500 max-w-sm mb-6">
                The next generation of product photography. Powered by Gemini AI to give you 
                studio-quality results in seconds.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                  <ImageIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-primary transition-colors">Background Removal</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">AI Cleanup</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Batch Processing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Access</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <p>© 2024 Lumina Studio AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-zinc-600 transition-colors">Twitter</a>
              <a href="#" className="hover:text-zinc-600 transition-colors">Instagram</a>
              <a href="#" className="hover:text-zinc-600 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster position="bottom-right" />
    </div>
  );
}
