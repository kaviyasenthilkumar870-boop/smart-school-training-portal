import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import Alert from '../components/Alert';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function LoginPage({ setActiveView }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@smartschool.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        const role = result.user.role;
        if (role === 'admin') setActiveView('admin-dashboard');
        else if (role === 'staff') setActiveView('staff-dashboard');
        else setActiveView('student-dashboard');
      } else {
        setError(result.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleKey) => {
    const cred = DEMO_ACCOUNTS[roleKey];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
      setError('');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 mb-3">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Portal Authentication</h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your school training programmes, rosters, and attendance records
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')} 
            className="mb-5"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="name@school.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Test Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>One-Click Role Test Logins:</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="px-2.5 py-2 rounded-xl text-xs font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100 text-center transition-colors"
            >
              <div className="font-bold">Admin</div>
              <div className="text-[10px] text-purple-500">Full System</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('staff')}
              className="px-2.5 py-2 rounded-xl text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-100 text-center transition-colors"
            >
              <div className="font-bold">Staff</div>
              <div className="text-[10px] text-amber-600">Attendance</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('student')}
              className="px-2.5 py-2 rounded-xl text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 text-center transition-colors"
            >
              <div className="font-bold">Student</div>
              <div className="text-[10px] text-blue-500">Greenwood High</div>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => setActiveView('home')}
          className="text-xs text-slate-500 hover:text-slate-800 transition"
        >
          ← Return to Public Home
        </button>
      </div>
    </div>
  );
}
