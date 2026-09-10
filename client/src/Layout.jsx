import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useServerWaking } from './lib/serverStatus.js';

export default function Layout(){
    const isServerWaking = useServerWaking();

    return (
        <div className="min-h-screen flex flex-col bg-surface">
            <Header/>
            {isServerWaking && (
              <div className="bg-primary/10 text-primary text-sm text-center py-2 px-5">
                Waking up the server — this can take up to a minute on our free hosting tier. Hang tight!
              </div>
            )}
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
