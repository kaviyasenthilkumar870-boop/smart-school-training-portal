import React from 'react';
import { HelpCircle, Home } from 'lucide-react';

export default function NotFoundPage({ setActiveView }) {
  return (
    <div className="max-w-md mx-auto text-center py-16 px-4">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        <HelpCircle className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Error 404</span>
      <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Page Not Found</h2>
      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
        The requested screen or event does not exist, or you may lack authorized permissions for this school portal resource.
      </p>

      <button
        onClick={() => setActiveView('home')}
        className="mt-6 inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </button>
    </div>
  );
}
