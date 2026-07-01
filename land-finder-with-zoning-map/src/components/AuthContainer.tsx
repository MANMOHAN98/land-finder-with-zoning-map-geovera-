import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { GeoveraLogo } from './GeoveraLogo';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  ShieldCheck, 
  User, 
  LogIn, 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  Info, 
  Shield, 
  Mail, 
  Send, 
  RefreshCw, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Phone, 
  Check, 
  Globe,
  ChevronLeft,
  Compass,
  ArrowLeft,
  Key,
  Database
} from 'lucide-react';
import { LanguageCode } from '../translations';

interface AuthContainerProps {
  onLogin: (user: UserProfile, method?: string, password?: string) => void;
  onFailedLogin?: (details: { name: string; email: string; role: UserRole; method: string; password?: string }) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  currentLanguage?: LanguageCode;
  unauthorizedWarning?: string | null;
  setUnauthorizedWarning?: (warning: string | null) => void;
  initialIsRegistering?: boolean;
  initialRoleSelected?: boolean;
  initialActiveTab?: UserRole;
  onRedirectToView?: (view: 'login' | 'register' | 'landing') => void;
  isAdminLogin?: boolean;
}

export default function AuthContainer({ 
  onLogin, 
  currentUser, 
  onLogout, 
  onFailedLogin,
  unauthorizedWarning,
  setUnauthorizedWarning,
  initialIsRegistering = false,
  initialRoleSelected = false,
  initialActiveTab = 'buyer',
  onRedirectToView,
  isAdminLogin = false
}: AuthContainerProps) {
  // Navigation role & page views
  const [activeTab, setActiveTab] = useState<UserRole>(initialActiveTab);
  const [isRegistering, setIsRegistering] = useState(initialIsRegistering);
  const [roleSelected, setRoleSelected] = useState(initialRoleSelected);
  const [selectedRoleOpt, setSelectedRoleOpt] = useState<'buyer' | 'agent'>('buyer');
  const [googleAuthData, setGoogleAuthData] = useState<{ email: string; name: string; uid: string } | null>(null);
  const [registrationStep, setRegistrationStep] = useState<'form' | 'role'>('form');

  useEffect(() => {
    setIsRegistering(initialIsRegistering);
    setRoleSelected(initialRoleSelected);
    setActiveTab(initialActiveTab);
  }, [initialIsRegistering, initialRoleSelected, initialActiveTab]);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'reset'>('request');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // Verification flow states
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [devCodeAlert, setDevCodeAlert] = useState<string | null>(null);

  // Status & loading indicators
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength scoring (0 to 4)
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setPasswordStrength(score);
  }, [password]);

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Fill out all credentials fields to sign in.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('gis_saved_email', email);
        } else {
          localStorage.removeItem('gis_saved_email');
        }
        localStorage.setItem('gis_jwt_token', data.token);
        setMessage({ text: 'Authentication successful! Synchronizing national cadaster registers...', type: 'success' });
        
        setTimeout(() => {
          onLogin(data.profile, 'Secure Login Portal', password);
          setLoading(false);
          clearLogs();
        }, 1000);
      } else {
        // Handle unverified redirection
        if (response.status === 403 && data.requiresVerification) {
          setMessage({ text: 'This email register remains unverified. Please input verification code.', type: 'success' });
          setVerificationEmail(data.email);
          setDevCodeAlert(data.devVerificationCode);
          setVerificationPending(true);
          setLoading(false);
          return;
        }

        // Custom fail logs
        onFailedLogin?.({
          name: email.split('@')[0].toUpperCase(),
          email,
          role: activeTab,
          method: 'Failed Form Attempt',
          password
        });
        
        setMessage({ text: data.error || 'Credentials mismatch. Try again.', type: 'error' });
        setLoading(false);
      }
    } catch (err: any) {
      setMessage({ text: 'Critical connection issue with secure Cadaster authentication server.', type: 'error' });
      setLoading(false);
    }
  };

  // Register form validator and transition to role selection
  const handleRegisterFormNext = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Manual validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: 'Provide a valid format email address.', type: 'error' });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setMessage({ text: 'Provide a valid 10-digit phone number.', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setMessage({ text: 'Passwords must contain at least 6 characters.', type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords confirmation mismatch. Verify matching credentials.', type: 'error' });
      return;
    }

    if (!acceptTerms || !acceptPrivacy) {
      setMessage({ text: 'Please agree to both the Terms of Service and Privacy Policy to register.', type: 'error' });
      return;
    }

    setRegistrationStep('role');
    setRoleSelected(false); // Make sure role card is active
  };

  // Submit standard or Google registration after role selection
  const handleCreateAccountSubmit = async (selectedRole: 'buyer' | 'agent') => {
    setLoading(true);
    setMessage(null);

    try {
      if (googleAuthData) {
        // Google registration flow
        const response = await fetch('/api/auth/google-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: googleAuthData.email,
            name: googleAuthData.name,
            uid: googleAuthData.uid,
            role: selectedRole,
            phone: phone || ''
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('gis_jwt_token', data.token);
          setMessage({ text: 'Google Registration Complete! Building secure workspace...', type: 'success' });
          setTimeout(() => {
            onLogin(data.profile, 'Google OAuth SignUp');
            setLoading(false);
            clearLogs();
          }, 1000);
        } else {
          setMessage({ text: data.error || 'Google registration failed.', type: 'error' });
          setLoading(false);
        }
      } else {
        // Manual registration flow
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name,
            role: selectedRole,
            agentPhone: phone,
            agencyName: agencyName || undefined,
            licenseNumber: licenseNumber || undefined
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('gis_jwt_token', data.token);
          setMessage({ text: 'Registration complete! Building secure profile workspace...', type: 'success' });
          setTimeout(() => {
            onLogin(data.profile, 'Verified Form SignUp', password);
            setLoading(false);
            clearLogs();
          }, 1000);
        } else {
          setMessage({ text: data.error || 'Registration failed.', type: 'error' });
          setLoading(false);
        }
      }
    } catch (err) {
      setMessage({ text: 'Server synchronization failed during account creation.', type: 'error' });
      setLoading(false);
    }
  };

  // Keep verification submit just in case of leftover state, though bypassed now
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail, code: verificationCode })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('gis_jwt_token', data.token);
        setMessage({ text: 'Verification complete! Building secure profile workspace...', type: 'success' });
        
        setTimeout(() => {
          onLogin(data.profile, 'Verified Form SignUp', password);
          setLoading(false);
          setVerificationPending(false);
          setDevCodeAlert(null);
          clearLogs();
        }, 1000);
      } else {
        setMessage({ text: data.error || 'Invalid verification OTP credentials.', type: 'error' });
        setLoading(false);
      }
    } catch (err) {
      setMessage({ text: 'Authentication server verification request timed out.', type: 'error' });
      setLoading(false);
    }
  };

  // Forgot password request helper
  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });
      const data = await response.json();

      if (response.ok) {
        setResetStep('reset');
        if (data.devResetCode) {
          setDevCodeAlert(data.devResetCode);
        }
        setMessage({ text: 'Reset OTP credentials formulated! Please check dynamic sandbox on-screen code below.', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Email lookup returned 0 results.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Connection failed during reset lookup.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Forgot password reset action
  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail || !resetCode || !newPassword) return;

    if (newPassword.length < 6) {
      setMessage({ text: 'Secure passwords must be at least 6 characters.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail, code: resetCode, newPassword })
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Success! New security credentials linked. Please log in.', type: 'success' });
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetStep('request');
          setDevCodeAlert(null);
          setEmail(forgotPasswordEmail);
          setPassword(newPassword);
        }, 1500);
      } else {
        setMessage({ text: data.error || 'Reset failed.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Verification reset communication timed out.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider !== 'Google') {
      setMessage({ text: 'Only Google Sign-In is configured on the platform at this time.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email) {
        setMessage({ text: 'Unable to retrieve email from Google account.', type: 'error' });
        setLoading(false);
        return;
      }

      // Check if user exists on backend
      const response = await fetch('/api/auth/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          uid: user.uid
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.error || 'Google login verification failed.', type: 'error' });
        setLoading(false);
        return;
      }

      if (data.exists) {
        // Log in directly
        localStorage.setItem('gis_jwt_token', data.token);
        setMessage({ text: 'Google Authentication Successful! Building secure session...', type: 'success' });
        setTimeout(() => {
          onLogin(data.profile, 'Google OAuth Login');
          setLoading(false);
          clearLogs();
        }, 1000);
      } else {
        // New user - transition to role selection
        setGoogleAuthData({
          email: data.email,
          name: data.name,
          uid: user.uid
        });
        setIsRegistering(true);
        setRegistrationStep('role');
        setLoading(false);
        setMessage({ text: 'Google authentication successful! Please select your role to create your account.', type: 'success' });
      }
    } catch (err: any) {
      console.error("Google Sign-In Error: ", err);
      setMessage({ text: err.message || 'Google authentication encountered an error.', type: 'error' });
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setAgencyName('');
    setLicenseNumber('');
    setPhone('');
    setDevCodeAlert(null);
    setRoleSelected(false);
    setGoogleAuthData(null);
    setRegistrationStep('form');
  };

  // Pre-load saved email if standard Remember Me is checked
  useEffect(() => {
    const saved = localStorage.getItem('gis_saved_email');
    if (saved) {
      setEmail(saved);
    }
  }, []);

  // JSX: Logged In dashboard representation if already loaded
  if (currentUser) {
    const isAgent = currentUser.role === 'agent' || currentUser.role === 'seller';
    const isDeployer = currentUser.role === 'deployer' || currentUser.role === 'admin';

    return (
      <div id="auth-logged-in-profile" className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 max-w-md mx-auto">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
            isAgent ? 'bg-amber-500 text-white border-amber-300' : isDeployer ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-emerald-600 text-white border-emerald-400'
          }`}>
            {currentUser.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm font-sans flex items-center gap-1.5">
              {currentUser.name}
              <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full ${
                isAgent ? 'bg-amber-100 text-amber-800 border border-amber-200' : isDeployer ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {currentUser.role}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium font-mono">{currentUser.email}</p>
          </div>
        </div>


        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-600" /> Secure Cadaster Session Active
          </span>
          <button
            onClick={() => {
              localStorage.removeItem('gis_jwt_token');
              onLogout();
            }}
            className="px-4 py-1.5 text-[10px] font-bold text-rose-700 hover:text-white border border-rose-200 hover:bg-rose-600 rounded-lg transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (false && isRegistering && !roleSelected) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative p-4 transition-all" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Immersive overlay blur */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-0" />

        {/* Dedicated Role Selection page */}
        <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden border border-slate-250 shadow-2xl relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[660px] animate-fade-in" id="role-selection-panel">
          
          <div className="space-y-8">
            {/* Header section styled elegantly like LinkedIn/Airbnb onboarding */}
            <div className="space-y-3 text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-800 text-[10px] font-black tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Registry Onboarding
              </span>
              <h2 className="text-2xl sm:text-3.5xl font-black text-slate-900 font-display tracking-tight leading-tight">
                Choose How You Want to Use GEOVERA
              </h2>
              <p className="text-xs sm:text-sm text-slate-550 font-medium leading-relaxed">
                Select the option that best describes your purpose.
              </p>
            </div>

            {/* Error or message bar if any */}
            {message && (
              <div className={`p-4 rounded-2xl border text-xs flex gap-2 animate-fade-in max-w-md mx-auto ${
                message.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {message.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />}
                <div className="font-semibold">{message.text}</div>
              </div>
            )}

            {/* Dual Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-4">
              
              {/* BUYER CARD */}
              <div 
                id="role-card-buyer"
                onClick={() => setSelectedRoleOpt('buyer')}
                className={`relative border rounded-3xl p-6 sm:p-8 cursor-pointer select-none transition-all duration-300 flex flex-col justify-between space-y-6 min-h-[420px] ${
                  selectedRoleOpt === 'buyer'
                    ? 'border-emerald-500 bg-emerald-50/5 shadow-lg -translate-y-1.5 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 hover:border-emerald-450 hover:-translate-y-1 hover:shadow-md bg-white'
                }`}
              >
                {/* Active Checkmark Indicator */}
                {selectedRoleOpt === 'buyer' && (
                  <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md animate-scale-in" id="buyer-card-checkmark">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                )}

                <div className="space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl transition-colors duration-250 ${
                      selectedRoleOpt === 'buyer' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Compass className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-850 uppercase tracking-tight">Buyer</h3>
                      <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest mt-0.5">Acquisition & Discovery</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-normal font-semibold pr-2">
                    Ideal for users who want to discover, compare, and purchase land properties.
                  </p>

                  <div className="border-t border-slate-100 pt-3" />

                  {/* Premium Bullet Features */}
                  <ul className="space-y-2.5">
                    {[
                      'Search verified land listings',
                      'View land measurements',
                      'Save favorite properties',
                      'Compare multiple properties',
                      'Contact sellers directly',
                      'Receive property recommendations',
                      'Track inquiry history'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  id="btn-continue-buyer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('buyer');
                    setRoleSelected(true);
                  }}
                  className={`w-full py-3 text-xs uppercase tracking-wider font-extrabold rounded-2xl transition duration-200 cursor-pointer shadow-sm text-center flex items-center justify-center gap-2 ${
                    selectedRoleOpt === 'buyer'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Continue as Buyer
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* SELLER CARD */}
              <div 
                id="role-card-seller"
                onClick={() => setSelectedRoleOpt('agent')}
                className={`relative border rounded-3xl p-6 sm:p-8 cursor-pointer select-none transition-all duration-300 flex flex-col justify-between space-y-6 min-h-[420px] ${
                  selectedRoleOpt === 'agent'
                    ? 'border-emerald-500 bg-emerald-50/5 shadow-lg -translate-y-1.5 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 hover:border-emerald-450 hover:-translate-y-1 hover:shadow-md bg-white'
                }`}
              >
                {/* Active Checkmark Indicator */}
                {selectedRoleOpt === 'agent' && (
                  <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md animate-scale-in" id="seller-card-checkmark">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                )}

                <div className="space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl transition-colors duration-250 ${
                      selectedRoleOpt === 'agent' ? 'bg-emerald-100 text-emerald-750' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-850 uppercase tracking-tight font-display">Seller</h3>
                      <p className="text-[10px] text-[#4f46e5] font-extrabold uppercase tracking-widest mt-0.5">Publish & Lead Managing</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-normal font-semibold pr-2">
                    Ideal for landowners, agents, and developers who want to list and manage properties.
                  </p>

                  <div className="border-t border-slate-100 pt-3" />

                  {/* Premium Bullet Features */}
                  <ul className="space-y-2.5">
                    {[
                      'Add new land listings',
                      'Upload property images',
                      'Manage active listings',
                      'Edit and update properties',
                      'Receive buyer inquiries',
                      'Track property performance',
                      'View listing analytics',
                      'Generate buyer leads'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  id="btn-continue-seller"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('agent');
                    setRoleSelected(true);
                  }}
                  className={`w-full py-3 text-xs uppercase tracking-wider font-extrabold rounded-2xl transition duration-200 cursor-pointer shadow-sm text-center flex items-center justify-center gap-2 ${
                    selectedRoleOpt === 'agent'
                      ? 'bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-slate-200 shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Continue as Seller
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>

            {/* Why Choose GEOVERA Segment */}
            <div className="border-t border-slate-100 pt-8 mt-10" id="why-choose-finder-section">
              <div className="text-center space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                  Why Choose GEOVERA?
                </h4>
                <div className="flex flex-wrap justify-center gap-y-3 gap-x-6 max-w-4xl mx-auto px-4">
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-xs bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-full shadow-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Secure platform</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-xs bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-full shadow-xs">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Verified users</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-xs bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-full shadow-xs">
                    <Database className="h-4 w-4 text-emerald-600" />
                    <span>Easy property management</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-xs bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-full shadow-xs">
                    <Globe className="h-4 w-4 text-emerald-600" />
                    <span>Responsive design</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-xs bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-full shadow-xs">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span>Professional experience</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Back Link */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setIsRegistering(false);
                onRedirectToView?.('login');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative p-4 transition-all" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Immersive overlay blur */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-0" />

      {/* Main glass card container with split screen layout */}
      <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* LEFT PANEL: Professional Branding Panel */}
        <div className="hidden lg:flex lg:col-span-5 bg-cover bg-center relative flex-col justify-between p-10 text-white select-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80')` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/70 to-emerald-950/95 z-0" />
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-emerald-300 text-[9px] font-black tracking-widest uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% SECURE CADASTER CONTRACTS
            </div>
            <h3 className="text-2xl xl:text-3.5xl font-black font-display leading-tight text-white tracking-tight">
              Search, Compare, <br />
              and Invest <br />
              with Confidence.
            </h3>
            <p className="text-xxs xl:text-xs text-slate-300 font-semibold leading-relaxed max-w-xs">
              Configure parameters, run soil chemistry reports, overlay district zoning policies, and initiate direct communication with certified sovereign owners.
            </p>
          </div>

          <div className="relative z-10 space-y-4 pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Active Land Track</span>
                <span className="text-sm xl:text-base font-black font-mono tracking-tight text-white">15,400+ Acres</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Security clearance</span>
                <span className="text-sm xl:text-base font-black font-mono tracking-tight text-emerald-400">RERA Audited</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 font-mono leading-none">
              🔒 Dynamic Indian Geographical cadaster regulations.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Dynamic interaction forms */}
        <div className="col-span-12 lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
          <div>
            {/* Center-aligned GEOVERA official brand identity */}
            <div className="flex flex-col items-center justify-center text-center pb-5 border-b border-slate-100 mb-6 animate-fade-in" id="geovera-auth-logo">
              <GeoveraLogo height={48} width={48} />
              <h1 className="text-xl font-black text-[#0B4F8A] font-display uppercase tracking-widest mt-2 leading-none">
                GEOVERA
              </h1>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#16A34A] font-mono mt-1.5 leading-none">
                Locate. Verify. Own.
              </span>
            </div>
            
            {/* DEV CODE INTERCEPT SANDBOX */}
            {devCodeAlert && (
              <div className="bg-indigo-950 text-indigo-100 p-4 border border-indigo-900 rounded-2xl flex flex-col gap-1.5 animate-fade-in font-mono text-xs mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-505 tracking-widest uppercase flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" /> sandbox secure intercept
                  </span>
                  <button 
                    onClick={() => setDevCodeAlert(null)}
                    className="hover:opacity-75 font-bold uppercase text-[9px] text-white underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="bg-indigo-900/60 p-2.5 rounded border border-indigo-800 text-center mt-1">
                  <span className="text-[10px] uppercase text-indigo-300 font-extrabold block">Your Intercepted OTP Action Code:</span>
                  <strong className="text-xl tracking-widest text-amber-400 font-black block mt-0.5">{devCodeAlert}</strong>
                </div>
              </div>
            )}

            {/* ERROR FEEDBACK BAR */}
            {message && (
              <div className={`p-4 rounded-2xl border text-xs flex gap-2 animate-fade-in mb-4 ${
                message.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {message.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />}
                <div className="font-semibold">{message.text}</div>
              </div>
            )}

            {unauthorizedWarning && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center justify-between gap-3 font-sans animate-pulse mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[13px]">⚠️</span>
                  <span className="text-xxs font-extrabold uppercase tracking-wide leading-tight">{unauthorizedWarning}</span>
                </div>
                <button 
                  onClick={() => {
                    if (setUnauthorizedWarning) setUnauthorizedWarning(null);
                  }} 
                  className="text-red-400 hover:text-red-700 font-extrabold cursor-pointer text-xs"
                >
                  ×
                </button>
              </div>
            )}

            {/* --- FORGOT PASSWORD MODULE --- */}
            {showForgotPassword ? (
              <form onSubmit={resetStep === 'request' ? handleForgotRequest : handleForgotReset} className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-sm font-sans flex items-center gap-1.5 uppercase tracking-wide">
                    🔑 Reset Security Password
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal font-medium">
                    Recover your login password by submitting your verified email address.
                  </p>
                </div>

                {resetStep === 'request' ? (
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                        Your Registered Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="yourname@gmail.com"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-xs text-slate-850"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !forgotPasswordEmail}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Query Reset Code <Send className="h-3.5 w-3.5" /></>}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                        6-Digit Reset Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 102482"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-widest font-mono text-sm py-2 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                        Specify New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-xs"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-75 text-slate-400"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !resetCode || !newPassword}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Link Credentials & Save <Check className="h-3.5 w-3.5" /></>}
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetStep('request');
                    setDevCodeAlert(null);
                    setMessage(null);
                  }}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                >
                  Return to Login
                </button>
              </form>
            ) : verificationPending ? (
              /* --- OTP VERIFICATION CODE FLOW --- */
              <form onSubmit={handleVerifySubmit} className="space-y-5 animate-fade-in">
                <div className="space-y-2 text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                    📧
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm font-sans flex items-center justify-center gap-1.5 tracking-wide uppercase">
                    Verification Needed
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed font-semibold">
                    We have dispatched a secure 6-digit credentials OTP code to <strong className="text-slate-800 font-bold">{verificationEmail}</strong>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono text-center">
                    Input 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 192842"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-widest text-lg font-mono font-black py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || verificationCode.length < 6}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Verify & Access Platform <ArrowRight className="h-3.5 w-3.5" /></>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVerificationPending(false);
                    setDevCodeAlert(null);
                    setMessage(null);
                  }}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </form>
            ) : isRegistering ? (
              /* --- REGISTRATION DISCOVERY AREA --- */
              <div className="space-y-6 animate-fade-in">
                {registrationStep === 'form' ? (
                  /* STEP 1: FILL OUT MANUAL REGISTRATION FORM */
                  <form onSubmit={handleRegisterFormNext} className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-md font-mono">
                          SECURE REGISTER
                        </span>
                      </div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase font-display pt-2">
                        Create Account
                      </h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Method 1: Manual Registration
                      </p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                        Full Name <span className="text-rose-650">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Abhimanyu Deshmukh"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                        Email Address <span className="text-rose-650">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="yourname@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                        Phone Number <span className="text-rose-650">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. 9845109312"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                          Password <span className="text-rose-650">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-xs"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                          Confirm Password <span className="text-rose-650">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-xs"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* PASSWORD STRENGTH CHECKER */}
                    {password && (
                      <div className="space-y-1 animate-fade-in text-[10px] font-bold">
                        <div className="flex justify-between uppercase tracking-wider text-slate-400 block font-mono">
                          <span>Password Strength:</span>
                          <span className={passwordStrength <= 1 ? 'text-rose-600' : passwordStrength === 2 ? 'text-amber-500' : 'text-emerald-600'}>
                            {passwordStrength <= 1 ? 'Weak password (6+ chars)' : passwordStrength === 2 ? 'Fair password' : 'Strong & Guarded!'}
                          </span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full flex">
                          {[1, 2, 3, 4].map((step) => (
                            <div 
                              key={step} 
                              className={`flex-1 mx-0.5 rounded-full transition-all ${
                                step <= passwordStrength 
                                  ? passwordStrength <= 1 ? 'bg-rose-500' : passwordStrength === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* T&C + privacy checks */}
                    <div className="text-xs text-slate-500 font-medium space-y-2 select-none leading-normal pt-1">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 shrink-0"
                          required
                        />
                        <span>
                          I agree to the <span className="text-emerald-700 underline font-bold">Terms & Conditions</span> governing land discoverability and official survey registries.
                        </span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptPrivacy}
                          onChange={(e) => setAcceptPrivacy(e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 shrink-0"
                          required
                        />
                        <span>
                          I consent to the <span className="text-emerald-700 underline font-bold">Privacy Policy</span> regarding verified cadaster identity claims compliance.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Next: Choose Role <ArrowRight className="h-4 w-4" /></>}
                    </button>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-200"></div>
                      <span className="flex-shrink mx-3 text-[8.5px] text-slate-400 font-bold uppercase tracking-wider font-mono">or continue with</span>
                      <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* GOOGLE SIGN-IN METHOD 2 */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleSocialLogin('Google')}
                      className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-black tracking-wider uppercase transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none font-mono"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      Method 2: Continue with Google
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsRegistering(false);
                        onRedirectToView?.('login');
                      }}
                      className="w-full text-center text-xs text-slate-500 hover:text-slate-850 font-bold underline cursor-pointer pt-2"
                    >
                      Already have an account? Sign In
                    </button>
                  </form>
                ) : (
                  /* STEP 2: SELECT ROLE FOR STANDARD OR GOOGLE SIGN-UP */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setRegistrationStep('form');
                          setGoogleAuthData(null);
                        }}
                        className="text-xxs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to details
                      </button>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded">
                        Onboarding Phase
                      </span>
                    </div>

                    <div className="space-y-1 text-center">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase font-display">
                        Choose Your Role
                      </h2>
                      {googleAuthData ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[11px] text-emerald-800 font-semibold max-w-md mx-auto mt-2">
                          Authenticated via Google: <strong>{googleAuthData.email}</strong>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-550 font-medium pt-1">
                          Setting up account for: <strong className="text-slate-800">{email}</strong>
                        </p>
                      )}
                    </div>

                    {googleAuthData && (
                      /* If authenticated via Google, capture optional phone number since Google payload doesn't provide it */
                      <div className="space-y-1.5 max-w-md mx-auto bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                          Confirm Phone Number <span className="text-rose-650">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. 9845109312"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-xs"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* BUYER CARD */}
                      <div className="border border-slate-150 rounded-2xl p-5 hover:border-emerald-500/80 hover:bg-emerald-50/10 transition-all duration-200 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-650 flex items-center justify-center text-sm">
                            🔍
                          </div>
                          <h4 className="text-sm font-black text-emerald-950 uppercase tracking-tight">Buyer</h4>
                          <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Acquisition & Discovery</p>
                          
                          <ul className="space-y-1.5 text-slate-600 text-xxs pt-1">
                            <li className="flex items-center gap-1.5 font-semibold">
                              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Search Land
                            </li>
                            <li className="flex items-center gap-1.5 font-semibold">
                              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Compare Properties
                            </li>
                            <li className="flex items-center gap-1.5 font-semibold">
                              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Contact Sellers
                            </li>
                            <li className="flex items-center gap-1.5 font-semibold">
                              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Save Properties
                            </li>
                          </ul>
                        </div>

                        <button
                          onClick={() => handleCreateAccountSubmit('buyer')}
                          disabled={loading || (googleAuthData && !phone)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-550 text-white font-extrabold text-xxs uppercase tracking-wider rounded-xl transition cursor-pointer disabled:opacity-50"
                        >
                          {loading ? 'Creating...' : 'Register as Buyer'}
                        </button>
                      </div>

                      {/* SELLER CARD */}
                      <div className="border border-slate-150 rounded-2xl p-5 hover:border-[#4f46e5]/85 hover:bg-indigo-50/10 transition-all duration-200 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center text-sm">
                            🚜
                          </div>
                          <h4 className="text-sm font-black text-indigo-950 uppercase tracking-tight font-display">Seller</h4>
                          <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Publish & Lead Tracking</p>
                          
                          <ul className="space-y-1.5 text-slate-600 text-xxs pt-1">
                            <li className="flex items-center gap-1.5 font-semibold">
                              <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" /> List Properties
                            </li>
                            <li className="flex items-center gap-1.5 font-semibold">
                              <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" /> Receive Buyer Leads
                            </li>
                            <li className="flex items-center gap-1.5 font-semibold">
                              <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" /> Manage Listings
                            </li>
                            <li className="flex items-center gap-1.5 font-semibold">
                              <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" /> Track Performance
                            </li>
                          </ul>
                        </div>

                        <button
                          onClick={() => handleCreateAccountSubmit('agent')}
                          disabled={loading || (googleAuthData && !phone)}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xxs uppercase tracking-wider rounded-xl transition cursor-pointer disabled:opacity-50"
                        >
                          {loading ? 'Creating...' : 'Register as Seller'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* --- STANDARD LOGIN AREA --- */
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    {!isAdminLogin && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-md font-mono">
                        SECURE
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase font-display pt-2">
                    {isAdminLogin ? 'System operator session' : 'Sign In'}
                  </h2>
                  {isAdminLogin && (
                    <p className="text-[11px] text-[#475569] font-semibold leading-relaxed">
                      Access central spatial dashboards, citizen logs, and database registries.
                    </p>
                  )}
                </div>

                {/* ROLE SELECTION TABS - ONLY FOR PUBLIC USERS */}
                {isAdminLogin && (
                  /* ADMIN SIGN-IN ACCESS BANNER - SECURELY SHOWN ONLY ON SECURE ROUTE */
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-150 flex items-center justify-center shrink-0">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-850">Administrative Access</h4>
                        <p className="text-[10px] text-slate-500 font-semibold font-sans">Login credentials for the National Admin.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('manmohanmanu98@gmail.com');
                        setPassword('manmohan');
                        setMessage({ text: 'Admin credentials prefilled! Ready for secure session authorization.', type: 'success' });
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Key className="h-3 w-3" /> Quick Prefill
                    </button>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  {/* Email field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="youraccount@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-xs text-slate-850"
                        required
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setMessage(null);
                        }}
                        className="text-[10px] font-extrabold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-xs text-slate-850"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-slate-600 text-slate-400 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Toggle */}
                  <div className="flex items-center justify-between text-xs text-[#475569] font-sans font-semibold pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0"
                      />
                      Remember Me
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Sign In'}
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-[8.5px] text-slate-400 font-bold uppercase tracking-wider font-mono">or continue with</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  {/* GOOGLE SIGN-IN */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSocialLogin('Google')}
                    className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-black tracking-wider uppercase transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none font-mono"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setIsRegistering(true);
                      setRegistrationStep('form');
                      onRedirectToView?.('register');
                    }}
                    className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                  >
                    Register New Account
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Secure disclaimer footer */}
          <div className="text-center text-[9px] text-[#475569] leading-normal font-mono pt-4">
            Security dispatch: Section 12A compliant. IP encrypted access is locked under sovereign digital tracking logs.
          </div>
        </div>

      </div>
    </div>
  );
}
