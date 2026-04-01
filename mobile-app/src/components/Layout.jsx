import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;
  const routes = ['/', '/add', '/settings'];

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // Disable swipe if we are inside project details view to not interfere with standard navigation
    if (location.pathname.startsWith('/project/')) return;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = routes.indexOf(location.pathname);
      if (currentIndex === -1) return;

      if (isLeftSwipe && currentIndex < routes.length - 1) {
        navigate(routes[currentIndex + 1]);
      } else if (isRightSwipe && currentIndex > 0) {
        navigate(routes[currentIndex - 1]);
      }
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
       searchParams.delete('q');
       setSearchParams(searchParams);
    } else {
       if (location.pathname !== '/') {
           navigate('/');
       }
    }
  };

  const handleSearchChange = (e) => {
    if (e.target.value) {
       searchParams.set('q', e.target.value);
    } else {
       searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

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
    <div className="bg-surface font-body text-on-surface min-h-screen relative overflow-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50 dark:bg-slate-950">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          {!isSearchOpen ? (
            <>
              <div className="flex items-center gap-3 animate-fade-in">
                <span className="material-symbols-outlined text-slate-900 dark:text-slate-50">architecture</span>
                <h1 className="font-headline font-extrabold text-xl tracking-tighter text-slate-900 dark:text-slate-50">Vercel Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleSearchToggle} className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 p-2 rounded-full transition-colors">search</button>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center gap-2 animate-fade-in">
                <div className="flex-1 bg-surface-container-highest rounded-full flex items-center px-4 py-2">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-[20px]">search</span>
                    <input 
                       autoFocus
                       className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm" 
                       placeholder="Search projects by name..."
                       value={searchParams.get('q') || ''}
                       onChange={handleSearchChange}
                    />
                </div>
                <button onClick={handleSearchToggle} className="text-slate-500 text-sm font-bold ml-2">Close</button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main 
        className="pt-24 pb-32 px-6 min-h-screen max-w-xl mx-auto transition-transform"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
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
