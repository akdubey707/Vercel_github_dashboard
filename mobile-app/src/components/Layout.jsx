import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const getNavClass = (path) => {
    const isActive = location.pathname === path || (path === '/' && location.pathname.startsWith('/project/'));
    
    if (isActive) {
      return "flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl px-5 py-2 transition-all duration-300 ease-in-out group";
    }
    return "flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 transition-all duration-300 ease-in-out hover:text-slate-600 dark:hover:text-slate-300 group";
  };

  const getIconContainerClass = (path) => {
    const isActive = location.pathname === path || (path === '/' && location.pathname.startsWith('/project/'));
    if (isActive) return { fontVariationSettings: "'FILL' 1" };
    return {};
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50 dark:bg-slate-950">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-900 dark:text-slate-50">architecture</span>
            <h1 className="font-headline font-extrabold text-xl tracking-tighter text-slate-900 dark:text-slate-50">Vercel Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 p-2 rounded-full transition-colors">search</button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-32 px-6 min-h-screen max-w-xl mx-auto">
        <Outlet />
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.04)] border-t border-slate-200/15 dark:border-slate-800/15 rounded-t-xl px-4 pb-6 pt-3 flex justify-around items-center">
        {/* Projects */}
        <Link to="/" className={getNavClass('/')}>
          <span className="material-symbols-outlined mb-1" style={getIconContainerClass('/')}>grid_view</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.05em]">Projects</span>
        </Link>
        
        {/* Add New */}
        <Link to="/add" className={getNavClass('/add')}>
          <span className="material-symbols-outlined mb-1" style={getIconContainerClass('/add')}>add_box</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.05em]">Add New</span>
        </Link>

        {/* Settings */}
        <Link to="/settings" className={getNavClass('/settings')}>
          <span className="material-symbols-outlined mb-1" style={getIconContainerClass('/settings')}>settings</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.05em]">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
