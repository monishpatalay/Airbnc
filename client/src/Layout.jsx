import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout(){
    return (
        <div className="min-h-screen flex flex-col bg-surface">
            <Header/>
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
