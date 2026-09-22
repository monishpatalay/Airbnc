import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'motion/react';
import Header from './Header';
import { useServerWaking } from './lib/serverStatus.js';

export default function Layout(){
    const isServerWaking = useServerWaking();
    const reduceMotion = useReducedMotion();

    return (
        <div className="min-h-screen flex flex-col bg-surface">
            <Header/>
            <AnimatePresence>
              {isServerWaking && (
                <Motion.aside
                  key="server-wake-notice"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-black/10 bg-white/95 p-4 shadow-lifted backdrop-blur-md sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-light" aria-hidden="true">
                      <Motion.span
                        animate={reduceMotion ? undefined : { rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        className="size-4 rounded-full border-2 border-primary/25 border-t-primary"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Please hold on, it&apos;s almost done</p>
                      <p className="mt-1 text-xs leading-5 text-ink/60">
                        Sorry for the wait—this demo runs on a free hosting tier, so the server may need a moment to wake up. <span aria-hidden="true">😅</span>
                      </p>
                    </div>
                  </div>
                </Motion.aside>
              )}
            </AnimatePresence>
            <main className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-8 pb-20">
              <Outlet/>
            </main>
            <footer className="border-t border-black/5 py-8 px-5 sm:px-8 text-sm text-ink/50">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>&copy; {new Date().getFullYear()} Airbnc &middot; Made for wandering minds.</span>
                <span>Find your place, anywhere.</span>
              </div>
            </footer>
        </div>
    )
};
