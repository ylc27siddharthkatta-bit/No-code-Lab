import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { User, UserRole, Pet, Booking, BookingStatus, SOPItem, Message, Review } from './types';
import { db } from './services/mockStore';
import { generatePetSOPs, summarizeChat, getSafetyTip } from './services/geminiService';
import { 
  Menu, X, Heart, Shield, Calendar, MessageSquare, 
  LogOut, Plus, Search, MapPin, Check, XCircle, Sparkles, User as UserIcon, Star, Send, ArrowLeft,
  Trash2, Edit2, Save
} from 'lucide-react';

// --- Components ---

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:text-brand-600';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Heart className="h-8 w-8 text-accent-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PawPal</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className={`px-3 py-2 rounded-md font-medium ${isActive('/dashboard')}`}>Dashboard</Link>
                <Link to="/bookings" className={`px-3 py-2 rounded-md font-medium ${isActive('/bookings')}`}>Bookings</Link>
                <Link to="/messages" className={`px-3 py-2 rounded-md font-medium ${isActive('/messages')}`}>Messages</Link>
                <Link to="/reviews" className={`px-3 py-2 rounded-md font-medium ${isActive('/reviews')}`}>Reviews</Link>
                
                <div className="flex items-center space-x-2 ml-4 bg-gray-100 rounded-full px-3 py-1">
                  <img src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button onClick={onLogout} className="text-gray-500 hover:text-gray-700 ml-4">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-brand-600 px-3 py-2 rounded-md font-medium">Log In</Link>
                <Link to="/signup" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden bg-white border-b">
          <div className="pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Dashboard</Link>
                <Link to="/bookings" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Bookings</Link>
                <Link to="/messages" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Messages</Link>
                <Link to="/reviews" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Reviews</Link>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Log In</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const StarRating = ({ rating, size = "sm" }: { rating: number, size?: "sm" | "md" | "lg" }) => {
  const iconSize = size === "lg" ? "w-6 h-6" : size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`${iconSize} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};

// --- Pages ---

const Landing = () => {
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Care for pets</span>{' '}
                  <span className="block text-brand-600 xl:inline">like family</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  PawPal connects loving pet owners with trusted pet lovers. Whether you need a weekend sitter or just want some puppy love, we've got you covered.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 md:py-4 md:text-lg">
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-700 bg-brand-100 hover:bg-brand-200 md:py-4 md:text-lg">
                      Log In
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Dogs playing"
          />
        </div>
      </div>
      
      {/* Feature Grid */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Better care with AI
            </p>
          </div>
          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-brand-500 text-white">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">AI SOP Generation</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Gemini AI automatically creates detailed care instructions based on your pet's breed and personality.
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-brand-500 text-white">
                    <Shield className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Safety First</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Receive intelligent safety tips tailored to specific breeds and booking contexts.
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-brand-500 text-white">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Chat</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Stay in sync with automated chat summaries so nothing gets lost in translation.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('sarah@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = db.login(email);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password. Try sarah@example.com');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to PawPal</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input 
                id="email-address" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm" 
                placeholder="Email address" 
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm" 
                placeholder="Password" 
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-brand-600 hover:text-brand-500">Forgot your password?</Link>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
           <p className="text-sm text-gray-600">Don't have an account? <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-500">Sign up</Link></p>
        </div>
        
        <div className="mt-6 border-t pt-4">
            <p className="text-xs text-gray-500 text-center mb-2">Demo Accounts:</p>
            <div className="flex justify-center space-x-2 text-xs text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200" onClick={() => {setEmail('sarah@example.com'); setPassword('123');}}>Owner (Sarah)</span>
                <span className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200" onClick={() => {setEmail('mike@example.com'); setPassword('123');}}>Lover (Mike)</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const SignupPage = ({ onSignup }: { onSignup: (user: User) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.OWNER,
    location: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        location: formData.location,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
    };

    const success = db.register(newUser);
    if(success) {
        onSignup(newUser);
    } else {
        setError('Email already registered.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create Account</h2>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g. San Francisco, CA" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I want to...</label>
            <div className="flex space-x-4">
                <button 
                    type="button"
                    onClick={() => setFormData({...formData, role: UserRole.OWNER})}
                    className={`flex-1 py-2 px-4 rounded-md border ${formData.role === UserRole.OWNER ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    Find Care
                </button>
                <button 
                    type="button"
                    onClick={() => setFormData({...formData, role: UserRole.LOVER})}
                    className={`flex-1 py-2 px-4 rounded-md border ${formData.role === UserRole.LOVER ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    Care for Pets
                </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700">
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
           <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock logic
        setSubmitted(true);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                {!submitted ? (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Reset Password</h2>
                        <p className="text-gray-600 text-sm mb-6 text-center">Enter your email address and we'll send you a link to reset your password.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700">
                                Send Reset Link
                            </button>
                        </form>
                        <div className="mt-4 text-center">
                            <Link to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-500 flex items-center justify-center">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                        <p className="text-gray-600 mb-6">We've sent a password reset link to <strong>{email}</strong>.</p>
                        <Link to="/login" className="text-brand-600 font-medium hover:text-brand-500">Return to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

const Dashboard = ({ user }: { user: User }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // For adding a pet
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', species: 'Dog', breed: '', age: 1, description: '' });
  const [generatingSOPs, setGeneratingSOPs] = useState(false);

  useEffect(() => {
    if (user.role === UserRole.OWNER) {
      setPets(db.getPetsByOwner(user.id));
    } else {
      setPets(db.getPets()); // Lover sees all pets
    }
    setLoading(false);
  }, [user]);

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingSOPs(true);
    
    // AI MAGIC: Generate SOPs
    const sops = await generatePetSOPs(newPet.species, newPet.breed, newPet.age, newPet.description);
    
    const petData: Pet = {
      id: `pet-${Date.now()}`,
      ownerId: user.id,
      ...newPet,
      imageUrl: `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80`, // Random generic image for new pets
      sops
    };

    db.addPet(petData);
    setPets(prev => [...prev, petData]);
    setGeneratingSOPs(false);
    setShowAddPet(false);
    // Reset form
    setNewPet({ name: '', species: 'Dog', breed: '', age: 1, description: '' });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.role === UserRole.OWNER ? 'My Pets' : 'Explore Pets Nearby'}
        </h1>
        {user.role === UserRole.OWNER && (
          <button 
            onClick={() => setShowAddPet(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Pet
          </button>
        )}
      </div>

      {/* Add Pet Modal */}
      {showAddPet && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add a New Pet</h2>
            <form onSubmit={handleCreatePet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input required type="text" value={newPet.name} onChange={e => setNewPet({...newPet, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Species</label>
                  <select value={newPet.species} onChange={e => setNewPet({...newPet, species: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Bird</option>
                    <option>Rabbit</option>
                    <option>Fish</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input required type="number" value={newPet.age} onChange={e => setNewPet({...newPet, age: parseInt(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Breed</label>
                <input required type="text" value={newPet.breed} onChange={e => setNewPet({...newPet, breed: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Personality/Description</label>
                <textarea required value={newPet.description} onChange={e => setNewPet({...newPet, description: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" rows={3} placeholder="Playful, shy, loves carrots..."></textarea>
                <p className="text-xs text-gray-500 mt-1">Gemini will use this to generate care instructions.</p>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddPet(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300">Cancel</button>
                <button 
                  type="submit" 
                  disabled={generatingSOPs}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-md flex items-center"
                >
                  {generatingSOPs && <Sparkles className="animate-spin h-4 w-4 mr-2" />}
                  {generatingSOPs ? 'Generating Profile...' : 'Create Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map(pet => (
          <Link to={`/pet/${pet.id}`} key={pet.id} className="block group">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200">
              <div className="relative h-48">
                <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                  <p className="text-white/90 text-sm">{pet.breed} • {pet.age} yrs</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm line-clamp-2">{pet.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                   <span className="text-gray-500 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {db.getUser(pet.ownerId)?.location || 'Unknown'}</span>
                   <span className="text-brand-600 font-medium">View Details &rarr;</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const PetDetails = ({ user }: { user: User }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | undefined>(undefined);
  const [showBookModal, setShowBookModal] = useState(false);
  const [safetyTip, setSafetyTip] = useState<string>('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [petOwner, setPetOwner] = useState<User | undefined>(undefined);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Pet>>({});

  useEffect(() => {
    if (id) {
      const p = db.getPetById(id);
      setPet(p);
      if (p) {
        setPetOwner(db.getUser(p.ownerId));
        if (user.role === UserRole.LOVER) {
          getSafetyTip(p, 'Pet Sitter').then(setSafetyTip);
        }
        setReviews(db.getReviews(p.ownerId));
        setEditFormData(p);
      }
    }
  }, [id, user]);

  const handleBook = () => {
    if (!pet) return;
    const booking: Booking = {
      id: `b-${Date.now()}`,
      petId: pet.id,
      ownerId: pet.ownerId,
      loverId: user.id,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      status: BookingStatus.PENDING,
      totalPrice: 50 // Mock price
    };
    db.createBooking(booking);
    setShowBookModal(false);
    alert("Booking Request Sent!");
    window.location.hash = '#/bookings';
  };

  const handleEditToggle = () => {
    if(isEditing) {
        // Cancel edit
        setIsEditing(false);
        setEditFormData(pet || {});
    } else {
        setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if(!pet) return;
    const updatedPet = { ...pet, ...editFormData } as Pet;
    db.updatePet(updatedPet);
    setPet(updatedPet);
    setIsEditing(false);
    alert('Pet updated successfully!');
  };

  const handleDelete = () => {
    if(!pet) return;
    if(window.confirm(`Are you sure you want to delete ${pet.name}? This cannot be undone.`)) {
        db.deletePet(pet.id);
        navigate('/dashboard');
    }
  };

  if (!pet) return <div className="p-8">Pet not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 relative">
             <img className="h-64 w-full object-cover md:h-full md:w-96" src={pet.imageUrl} alt={pet.name} />
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-start">
              <div className="w-full">
                {isEditing ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Name</label>
                                <input type="text" className="w-full border rounded p-1" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Species</label>
                                <select className="w-full border rounded p-1" value={editFormData.species} onChange={e => setEditFormData({...editFormData, species: e.target.value})}>
                                    <option>Dog</option>
                                    <option>Cat</option>
                                    <option>Bird</option>
                                    <option>Rabbit</option>
                                    <option>Fish</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-gray-500">Breed</label>
                             <input type="text" className="w-full border rounded p-1" value={editFormData.breed} onChange={e => setEditFormData({...editFormData, breed: e.target.value})} />
                        </div>
                         <div>
                             <label className="block text-xs font-medium text-gray-500">Age</label>
                             <input type="number" className="w-full border rounded p-1" value={editFormData.age} onChange={e => setEditFormData({...editFormData, age: parseInt(e.target.value)})} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="uppercase tracking-wide text-sm text-brand-500 font-semibold">{pet.species}</div>
                        <h1 className="mt-1 text-3xl font-extrabold text-gray-900">{pet.name}</h1>
                        <p className="mt-2 text-gray-500">{pet.breed} • {pet.age} years old</p>
                    </>
                )}

                {!isEditing && petOwner && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <UserIcon className="h-4 w-4 mr-1" />
                        Owner: {petOwner.name}
                    </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                {user.role === UserRole.LOVER && (
                    <button 
                    onClick={() => setShowBookModal(true)}
                    className="bg-brand-600 text-white px-6 py-2 rounded-full font-medium shadow hover:bg-brand-700 transition"
                    >
                    Request
                    </button>
                )}
                {user.id === pet.ownerId && (
                    <div className="flex space-x-2">
                        {isEditing ? (
                            <>
                                <button onClick={handleSaveEdit} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200" title="Save">
                                    <Save className="w-5 h-5" />
                                </button>
                                <button onClick={handleEditToggle} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200" title="Cancel">
                                    <X className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleEditToggle} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100" title="Edit">
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button onClick={handleDelete} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100" title="Delete">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                )}
              </div>
            </div>

            {isEditing ? (
                <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-500">Description</label>
                    <textarea 
                        className="w-full border rounded p-2" 
                        rows={4}
                        value={editFormData.description}
                        onChange={e => setEditFormData({...editFormData, description: e.target.value})}
                    />
                     <label className="block text-xs font-medium text-gray-500 mt-2">Image URL</label>
                     <input type="text" className="w-full border rounded p-1" value={editFormData.imageUrl} onChange={e => setEditFormData({...editFormData, imageUrl: e.target.value})} />
                </div>
            ) : (
                <p className="mt-4 text-gray-600">{pet.description}</p>
            )}

            {/* AI Generated SOPs */}
            <div className="mt-8">
              <div className="flex items-center mb-4">
                <Sparkles className="h-5 w-5 text-accent-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Care Instructions (SOPs)</h3>
              </div>
              <div className="bg-brand-50 rounded-lg p-4 space-y-3">
                {pet.sops.map(sop => (
                  <div key={sop.id} className="flex items-start">
                    <Check className="h-5 w-5 text-brand-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-800">{sop.title}:</span>
                      <span className="text-gray-600 ml-1">{sop.instruction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Safety Tip for Lovers */}
            {user.role === UserRole.LOVER && safetyTip && (
              <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                <div className="flex">
                  <Shield className="h-6 w-6 text-orange-400 mr-3" />
                  <div>
                    <h4 className="text-sm font-bold text-orange-800">Gemini Safety Insight</h4>
                    <p className="text-sm text-orange-700 mt-1">{safetyTip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Reviews for Owner</h3>
        {reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet.</p>
        ) : (
            <div className="space-y-6">
                {reviews.map(review => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex items-center mb-2">
                             <div className="font-semibold mr-2">
                                {db.getUser(review.reviewerId)?.name || 'Unknown User'}
                             </div>
                             <span className="text-gray-400 text-sm">• {review.createdAt}</span>
                        </div>
                        <StarRating rating={review.rating} />
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Booking Confirmation Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Request</h3>
            <p className="text-gray-600 mb-6">Request to book {pet.name} for $50/day?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowBookModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={handleBook} className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Bookings = ({ user }: { user: User }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(db.getBookingsForUser(user.id, user.role));
  }, [user]);

  const handleStatusChange = (id: string, status: BookingStatus) => {
    db.updateBookingStatus(id, status);
    setBookings(db.getBookingsForUser(user.id, user.role));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Bookings</h2>
      {bookings.length === 0 && (
         <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No bookings found.</p>
            <Link to="/dashboard" className="mt-4 inline-block text-brand-600 font-medium hover:underline">Find a pet to sit!</Link>
         </div>
      )}
      
      <div className="space-y-4">
        {bookings.map(b => {
          const pet = db.getPetById(b.petId);
          const otherUser = user.role === UserRole.OWNER ? db.getUser(b.loverId) : db.getUser(b.ownerId);
          
          return (
            <div key={b.id} className="bg-white p-6 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <img src={pet?.imageUrl} className="w-16 h-16 rounded-lg object-cover" alt={pet?.name} />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{pet?.name}</h3>
                  <p className="text-sm text-gray-500">
                    With {otherUser?.name} • {b.startDate} to {b.endDate}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">Total: ${b.totalPrice}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                 <span className={`px-3 py-1 rounded-full text-sm font-bold 
                  ${b.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                    b.status === BookingStatus.ACCEPTED ? 'bg-green-100 text-green-800' : 
                    b.status === BookingStatus.COMPLETED ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                  {b.status}
                </span>

                {user.role === UserRole.OWNER && b.status === BookingStatus.PENDING && (
                  <div className="flex space-x-2 mt-2">
                    <button onClick={() => handleStatusChange(b.id, BookingStatus.ACCEPTED)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Accept</button>
                    <button onClick={() => handleStatusChange(b.id, BookingStatus.REJECTED)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Reject</button>
                  </div>
                )}
                
                <Link to={`/messages?booking=${b.id}`} className="text-brand-600 text-sm hover:underline flex items-center mt-2">
                    <MessageSquare className="w-4 h-4 mr-1" /> Chat
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ReviewsPage = ({ user }: { user: User }) => {
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState<'received' | 'pending'>('received');
    const [writingReviewFor, setWritingReviewFor] = useState<Booking | null>(null);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        setMyReviews(db.getReviews(user.id));
        
        // Find completed bookings where this user hasn't written a review yet
        const completed = db.getBookingsForUser(user.id, user.role).filter(b => b.status === BookingStatus.COMPLETED);
        // This is a naive check for mock purpose
        const allReviews = db['load']<Review[]>('reviews', []); 
        const pending = completed.filter(b => !allReviews.some(r => r.bookingId === b.id && r.reviewerId === user.id));
        setPendingBookings(pending);
    }, [user, writingReviewFor]); 

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if(!writingReviewFor) return;

        const targetId = user.role === UserRole.OWNER ? writingReviewFor.loverId : writingReviewFor.ownerId;

        const review: Review = {
            id: `rev-${Date.now()}`,
            bookingId: writingReviewFor.id,
            reviewerId: user.id,
            targetId, 
            rating: newRating,
            comment: newComment,
            createdAt: new Date().toISOString().split('T')[0]
        };

        db.addReview(review);
        setWritingReviewFor(null);
        setNewComment('');
        setNewRating(5);
        setActiveTab('received');
        alert('Review Submitted!');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Reviews & Ratings</h1>

            <div className="flex border-b mb-6">
                <button 
                    onClick={() => setActiveTab('received')}
                    className={`pb-3 px-4 font-medium text-sm ${activeTab === 'received' ? 'border-b-2 border-brand-500 text-brand-600' : 'text-gray-500'}`}
                >
                    Reviews About Me
                </button>
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`pb-3 px-4 font-medium text-sm ${activeTab === 'pending' ? 'border-b-2 border-brand-500 text-brand-600' : 'text-gray-500'}`}
                >
                    Pending Reviews ({pendingBookings.length})
                </button>
            </div>

            {activeTab === 'received' && (
                <div className="space-y-6">
                    {myReviews.length === 0 ? (
                        <p className="text-gray-500">No reviews received yet.</p>
                    ) : (
                        myReviews.map(review => (
                            <div key={review.id} className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-500">
                                            <UserIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{db.getUser(review.reviewerId)?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500">{review.createdAt}</p>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} />
                                </div>
                                <p className="text-gray-700 mt-2">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'pending' && (
                <div className="space-y-4">
                    {pendingBookings.length === 0 ? (
                        <p className="text-gray-500">You're all caught up! No bookings to review.</p>
                    ) : (
                        pendingBookings.map(b => {
                            const pet = db.getPetById(b.petId);
                            const otherUser = user.role === UserRole.OWNER ? db.getUser(b.loverId) : db.getUser(b.ownerId);
                            return (
                                <div key={b.id} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">Booking with {otherUser?.name}</h3>
                                        <p className="text-sm text-gray-500">{pet?.name} • {b.endDate}</p>
                                    </div>
                                    <button 
                                        onClick={() => setWritingReviewFor(b)}
                                        className="bg-brand-600 text-white px-4 py-2 rounded hover:bg-brand-700"
                                    >
                                        Write Review
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Write Review Modal */}
            {writingReviewFor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Review your experience</h3>
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <div className="flex space-x-2">
                                    {[1,2,3,4,5].map(n => (
                                        <button key={n} type="button" onClick={() => setNewRating(n)}>
                                            <Star className={`w-8 h-8 ${n <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                <textarea 
                                    className="w-full border rounded-md p-2" 
                                    rows={4}
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    placeholder="How did it go?"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setWritingReviewFor(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const MessagesPage = ({ user }: { user: User }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        setBookings(db.getBookingsForUser(user.id, user.role));
        
        // Check URL params for auto-selection
        const params = new URLSearchParams(location.search);
        const bid = params.get('booking');
        if (bid) setSelectedBookingId(bid);
    }, [user, location]);

    const selectedBooking = bookings.find(b => b.id === selectedBookingId);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-64px)]">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex h-full border border-gray-200">
                {/* Sidebar */}
                <div className={`w-full md:w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col ${selectedBookingId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <h2 className="text-lg font-bold text-gray-800">Messages</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {bookings.length === 0 && <p className="p-4 text-gray-500 text-center">No active conversations.</p>}
                        {bookings.map(b => {
                            const pet = db.getPetById(b.petId);
                            const otherUser = user.role === UserRole.OWNER ? db.getUser(b.loverId) : db.getUser(b.ownerId);
                            const lastMsg = db['getLastMessage'] ? db['getLastMessage'](b.id) : null;
                            
                            return (
                                <div 
                                    key={b.id} 
                                    onClick={() => setSelectedBookingId(b.id)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition ${selectedBookingId === b.id ? 'bg-brand-50 border-l-4 border-l-brand-500' : ''}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <img src={otherUser?.avatarUrl} className="w-12 h-12 rounded-full object-cover" alt="" />
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                                <div className={`w-3 h-3 rounded-full ${b.status === BookingStatus.ACCEPTED ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-sm font-semibold text-gray-900 truncate">{otherUser?.name}</h3>
                                                <span className="text-xs text-gray-400">{lastMsg ? new Date(lastMsg.timestamp).toLocaleDateString() : ''}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{pet?.name} • {b.status}</p>
                                            <p className="text-xs text-gray-500 truncate mt-1">
                                                {lastMsg ? lastMsg.text : 'Start a conversation...'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`w-full md:w-2/3 flex flex-col bg-white ${!selectedBookingId ? 'hidden md:flex' : 'flex'}`}>
                    {selectedBooking ? (
                        <>
                             {/* Mobile Header to go back */}
                            <div className="md:hidden p-3 border-b flex items-center bg-gray-50">
                                <button onClick={() => setSelectedBookingId(null)} className="mr-3 text-gray-600">
                                    &larr; Back
                                </button>
                                <span className="font-bold">{user.role === UserRole.OWNER ? db.getUser(selectedBooking.loverId)?.name : db.getUser(selectedBooking.ownerId)?.name}</span>
                            </div>
                            <ChatWindow bookingId={selectedBooking.id} user={user} fullHeight />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                            <MessageSquare className="w-16 h-16 mb-4 text-gray-200" />
                            <p className="text-lg">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatWindow = ({ bookingId, user, fullHeight = false }: { bookingId: string, user: User, fullHeight?: boolean }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Poll for messages in this mock environment
    const load = () => setMessages(db.getMessages(bookingId));
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    db.sendMessage({
      id: `msg-${Date.now()}`,
      bookingId,
      senderId: user.id,
      text: input,
      timestamp: Date.now()
    });
    setInput('');
    setMessages(db.getMessages(bookingId));
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    const result = await summarizeChat(messages);
    setSummary(result);
    setLoadingSummary(false);
  };

  return (
    <div className={`flex flex-col ${fullHeight ? 'h-full' : 'h-[600px] rounded-lg shadow border border-gray-200'}`}>
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-700">Chat</h3>
        <button 
          onClick={generateSummary}
          className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center hover:bg-purple-200 transition"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          {loadingSummary ? 'Summarizing...' : 'Summarize Chat'}
        </button>
      </div>

      {summary && (
        <div className="p-3 bg-purple-50 border-b border-purple-100 text-sm text-purple-800 relative animate-in slide-in-from-top-2">
          <p><strong>AI Summary:</strong> {summary}</p>
          <button onClick={() => setSummary(null)} className="absolute top-1 right-2 text-purple-400 hover:text-purple-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map(m => {
          const isMe = m.senderId === user.id;
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe ? 'bg-brand-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t bg-white flex space-x-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-gray-50"
        />
        <button type="submit" className="bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700 shadow-md transition-transform active:scale-95">
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </form>
    </div>
  );
};

// --- Main App Wrapper ---

interface ProtectedRouteProps {
  user: User | null;
  children?: React.ReactNode;
}

const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => setUser(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage onSignup={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <Dashboard user={user!} />
            </ProtectedRoute>
          } />
          
          <Route path="/bookings" element={
            <ProtectedRoute user={user}>
              <Bookings user={user!} />
            </ProtectedRoute>
          } />

          <Route path="/messages" element={
            <ProtectedRoute user={user}>
              <MessagesPage user={user!} />
            </ProtectedRoute>
          } />

           <Route path="/reviews" element={
            <ProtectedRoute user={user}>
              <ReviewsPage user={user!} />
            </ProtectedRoute>
          } />

          <Route path="/pet/:id" element={
            <ProtectedRoute user={user}>
              <PetDetails user={user!} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;