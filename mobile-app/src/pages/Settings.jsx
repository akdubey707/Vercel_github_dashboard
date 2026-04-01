import { useProjectsStorage } from '../hooks/useProjectsStorage';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { clearProjects, projects } = useProjectsStorage();
  const navigate = useNavigate();

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all project data? This action cannot be undone.")) {
      clearProjects();
      alert("All data cleared.");
      navigate('/');
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <header className="mb-8">
        <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface">Settings</h2>
        <p className="text-on-surface-variant mt-2 font-body text-sm">Manage your local application data and preferences.</p>
      </header>
      
      <section className="bg-surface-container-low rounded-xl p-6 border border-slate-200/50 space-y-4">
        <div>
          <h3 className="font-headline font-bold text-lg text-on-surface">Data Management</h3>
          <p className="text-xs text-on-surface-variant mt-1 mb-4 leading-relaxed">
             This application stores all your data directly on your device. Clearing data will permanently remove all {projects.length} project(s) saved.
          </p>
        </div>
        
        <button onClick={handleClearData} className="w-full bg-error-container text-on-error-container hover:bg-red-200 transition-colors py-3 rounded-lg font-bold font-label text-sm uppercase flex items-center justify-center gap-2">
           <span className="material-symbols-outlined text-[18px]">delete_forever</span>
           Clear All Local Data
        </button>
      </section>
      
      <section className="bg-surface-container-low rounded-xl p-6 border border-slate-200/50 mt-4 space-y-4">
         <div>
          <h3 className="font-headline font-bold text-lg text-on-surface">About</h3>
          <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">
             Vercel Dashboard App <br /> Version 1.0.0
          </p>
        </div>
      </section>
    </div>
  );
}
