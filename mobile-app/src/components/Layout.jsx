import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);

  useEffect(() => {
    // Reset scroll position when navigating between routes
    window.scrollTo(0, 0);

    // Listen for the hardware back button on Android
    const initBackButton = async () => {
      await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (location.pathname !== '/') {
           navigate(-1);
        } else {
           CapacitorApp.exitApp();
        }
      });
    };
    
    // Only init if Capacitor is available (not web)
    initBackButton().catch(console.error);
    
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [navigate, location]);

  const minSwipeDistance = 50;
  const routes = ['/', '/add', '/html', '/settings'];

  const onTouchStart = (e) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEndHandler = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return;
    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    
    // Disable swipe if we are inside project details view to not interfere with standard navigation
    if (location.pathname.startsWith('/project/')) return;

    // Only trigger swipe if horizontal distance is significantly more than vertical distance (prevents diagonal scrolling)
    if (Math.abs(distanceX) > Math.abs(distanceY) * 1.5) {
      if (isLeftSwipe || isRightSwipe) {
        const currentIndex = routes.indexOf(location.pathname);
        if (currentIndex === -1) return;

        if (isLeftSwipe && currentIndex < routes.length - 1) {
          navigate(routes[currentIndex + 1]);
        } else if (isRightSwipe && currentIndex > 0) {
          navigate(routes[currentIndex - 1]);
        }
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
      return "flex flex-col items-center justify-center bg-slate-900/5 dark:bg-slate-50/10 text-slate-900 dark:text-slate-50 rounded-full px-4 py-2.5 transition-all duration-300 ease-in-out group flex-1";
    }
    return "flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-2.5 transition-all duration-300 ease-in-out hover:text-slate-600 dark:hover:text-slate-300 group flex-1";
  };

  const getIconContainerClass = (path) => {
    const isActive = location.pathname === path || (path === '/' && location.pathname.startsWith('/project/'));
    if (isActive) return { fontVariationSettings: "'FILL' 1" };
    return {};
  };

  return (
    <div className="bg-surface dark:bg-slate-950 font-body text-on-surface dark:text-slate-50 min-h-screen relative overflow-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50 dark:bg-slate-950">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          {!isSearchOpen ? (
            <>
              <div className="flex items-center gap-3 animate-fade-in">
                <span className="material-symbols-outlined text-slate-900 dark:text-slate-50">architecture</span>
                <h1 className="font-headline font-extrabold text-xl tracking-tighter text-slate-900 dark:text-slate-50">Vimchi Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                {location.pathname === '/' && (
                  <button onClick={handleSearchToggle} className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 p-2 rounded-full transition-colors">search</button>
                )}
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
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-max min-w-[16rem] z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-slate-200/40 dark:border-slate-800/40 rounded-[32px] px-4 py-2 flex justify-center items-center gap-2">
        {/* Projects */}
        <Link to="/" className={getNavClass('/')}>
          <span className="material-symbols-outlined mb-0.5" style={getIconContainerClass('/')}>grid_view</span>
          <span className="font-label text-[10px] font-bold tracking-wide whitespace-nowrap">Projects</span>
        </Link>
        
        {/* Add New */}
        <Link to="/add" className={getNavClass('/add')}>
          <span className="material-symbols-outlined mb-0.5" style={getIconContainerClass('/add')}>add_box</span>
          <span className="font-label text-[10px] font-bold tracking-wide whitespace-nowrap">Add New</span>
        </Link>
        
        {/* HTML */}
        <Link to="/html" className={getNavClass('/html')}>
          <span className="material-symbols-outlined mb-0.5" style={getIconContainerClass('/html')}>code</span>
          <span className="font-label text-[10px] font-bold tracking-wide whitespace-nowrap">HTML</span>
        </Link>

        {/* Settings */}
        <Link to="/settings" className={getNavClass('/settings')}>
          <span className="material-symbols-outlined mb-0.5" style={getIconContainerClass('/settings')}>settings</span>
          <span className="font-label text-[10px] font-bold tracking-wide whitespace-nowrap">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
