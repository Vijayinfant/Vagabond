'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api, Trip } from '../../utils/api';
import { Compass, Plus, Calendar, Clock, DollarSign, LogOut, Trash2, ArrowRight, PlaneTakeoff, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [fetchingTrips, setFetchingTrips] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<{ id: string; destination: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (!user) return;
      try {
        setFetchingTrips(true);
        const data = await api.getTrips();
        setTrips(data);
      } catch (err: any) {
        console.error('Error fetching trips:', err);
        setError('Failed to load trips. Please try again.');
      } finally {
        setFetchingTrips(false);
      }
    };
    fetchUserTrips();
  }, [user]);

  const confirmDelete = (id: string, destination: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTripToDelete({ id, destination });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!tripToDelete) return;
    const { id } = tripToDelete;

    try {
      setDeletingId(id);
      await api.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t._id !== id));
      setDeleteModalOpen(false);
      setTripToDelete(null);
    } catch (err: any) {
      alert('Failed to delete trip: ' + (err.message || 'Server error'));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Safe navigation guard
  if (loading || !user) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen theme-dashboard">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-400 text-sm">Validating session...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen relative theme-dashboard">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5FFAE0] opacity-[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C22ED0] opacity-[0.06] rounded-full blur-[120px]" />

      {/* Header */}
      <header className="relative z-10 bg-white/40 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Compass className="w-7 h-7 text-cyan-500" />
            <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 via-indigo-500 via-cyan-500 to-emerald-500 font-extrabold tracking-wider">VAGABOND</span>
          </Link>
          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-850 hover:bg-slate-100 text-sm font-medium transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and edit your travel itineraries.</p>
          </div>
          <Link
            href="/trips/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-500/10"
          >
            <Plus className="w-5 h-5" />
            Plan New Trip
          </Link>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm">
            {error}
          </div>
        )}

        {fetchingTrips ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
            <p className="mt-4 text-slate-500 text-sm">Loading your itineraries...</p>
          </div>
        ) : trips.length === 0 ? (
          /* Empty State */
          <div className="glass-panel rounded-2xl p-12 text-center max-w-xl mx-auto border border-slate-200 shadow-xl mt-6">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-600 mx-auto mb-6">
              <PlaneTakeoff className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No itineraries found</h2>
            <p className="text-slate-650 text-sm mb-8 leading-relaxed">
              You haven't generated any trips yet! Use our AI planner to craft your next customized adventure in seconds.
            </p>
            <Link
              href="/trips/create"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-cyan-500/15"
            >
              Start Planning Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Trips Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              // Calculate total expenses for display
              const totalExpenses = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
              const estimatedTotal = trip.estimatedBudget.reduce((sum, b) => sum + b.amount, 0);

              return (
                <div key={trip._id} className="group relative block">
                  <Link href={`/trips/${trip._id}`} className="glass-card rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
                    {/* Visual Card Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600" />

                    <div className="flex justify-between items-start mb-4 mt-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-1 pr-10">
                        {trip.destination}
                      </h3>
                    </div>

                    <div className="space-y-3.5 text-sm text-slate-600 flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-600" />
                        <span>{formatDate(trip.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-600" />
                        <span>{trip.durationDays} {trip.durationDays === 1 ? 'Day' : 'Days'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-cyan-600" />
                        <span className="font-medium">
                          Tier: <span className="text-slate-900 font-semibold">{trip.budgetPreference}</span>
                        </span>
                      </div>
                    </div>

                    {/* Cost Summary Tracker Subcomponent */}
                    <div className="mt-6 pt-5 border-t border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <p className="text-slate-500 font-semibold uppercase tracking-wider">AI Estimate</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">${estimatedTotal}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 font-semibold uppercase tracking-wider">Actual Spent</p>
                        <p className={`text-sm font-bold mt-0.5 ${totalExpenses > estimatedTotal ? 'text-rose-600' : 'text-emerald-600'}`}>
                          ${totalExpenses}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Delete Button (floats on top of the card using absolute positioning) */}
                  <button
                    onClick={(e) => confirmDelete(trip._id, trip.destination, e)}
                    className="absolute top-7 right-6 p-2 rounded-lg bg-slate-100 hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 transition-all border border-slate-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-20 cursor-pointer"
                    title="Delete Trip"
                    disabled={deletingId === trip._id}
                  >
                    {deletingId === trip._id ? (
                      <div className="w-4 h-4 border border-rose-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && tripToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-slate-200 shadow-2xl relative overflow-hidden bg-white text-left">
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
            
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-rose-600 text-lg">⚠️</span> Delete Itinerary
            </h3>
            
            <p className="text-slate-650 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete the travel plan for <span className="text-slate-950 font-semibold">{tripToDelete.destination}</span>? This action is permanent and cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setTripToDelete(null);
                }}
                className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 transition-all cursor-pointer"
                disabled={deletingId !== null}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                disabled={deletingId !== null}
              >
                {deletingId !== null ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Plan</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
