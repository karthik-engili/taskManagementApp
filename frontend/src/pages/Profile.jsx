import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/authService';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

const Profile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(token);
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <><Navbar /><Loader /></>;

  const displayUser = profile || user;

  const profileFields = [
    {
      label: 'Full Name',
      value: displayUser?.name,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Email Address',
      value: displayUser?.email,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Member Since',
      value: displayUser?.createdAt
        ? new Date(displayUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'N/A',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Account Status',
      value: 'Active',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      badge: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden animate-slide-up">
            {/* Banner + Avatar */}
            <div className="relative">
              {/* Gradient Banner */}
              <div className="h-32 sm:h-40 bg-gradient-to-br from-primary via-secondary to-primary-light"></div>

              {/* Avatar */}
              <div className="absolute -bottom-12 left-6 sm:left-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-4xl font-extrabold shadow-xl shadow-primary/30 border-4 border-white">
                  {displayUser?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Name + Email */}
            <div className="pt-16 px-6 sm:px-8 pb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {displayUser?.name}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">{displayUser?.email}</p>
            </div>

            {/* Details List */}
            <div className="divide-y divide-slate-100">
              {profileFields.map((field, index) => (
                <div
                  key={field.label}
                  className={`px-6 sm:px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors animate-fade-in stagger-${index + 1}`}
                  style={{ opacity: 0, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                      {field.icon}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{field.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm font-semibold text-slate-800">{field.value}</p>
                        {field.badge && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Card */}
          <div className="mt-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Security</h3>
                <p className="text-xs text-slate-400">Your account is protected with JWT authentication</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Password encrypted with bcrypt</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
