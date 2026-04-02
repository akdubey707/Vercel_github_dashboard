import { useRef } from 'react';
import { useProjectsStorage } from '../hooks/useProjectsStorage';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export default function Settings() {
  const { clearProjects, projects } = useProjectsStorage();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef(null);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all project data? This action cannot be undone.")) {
      clearProjects();
      alert("All data cleared.");
      navigate('/');
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "vimchi_dashboard_backup.json");
    dlAnchorElem.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json)) {
          window.localStorage.setItem('vimchi_dashboard_projects', JSON.stringify(json));
          alert('Backup imported successfully! App will reload.');
          window.location.reload();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
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

        <div className="grid grid-cols-2 gap-3 mb-2">
           <button onClick={handleExport} className="w-full bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-colors py-3 rounded-lg font-bold font-label text-[11px] uppercase flex flex-col items-center justify-center gap-1 shadow-sm">
             <span className="material-symbols-outlined text-[18px]">download</span>
             Export Backup
           </button>
           <button onClick={handleImportClick} className="w-full bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-colors py-3 rounded-lg font-bold font-label text-[11px] uppercase flex flex-col items-center justify-center gap-1 shadow-sm">
             <span className="material-symbols-outlined text-[18px]">upload</span>
             Import Backup
           </button>
           <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
        </div>
        
        <button onClick={handleClearData} className="w-full bg-error-container text-on-error-container hover:bg-red-200 transition-colors py-3 rounded-lg font-bold font-label text-sm uppercase flex items-center justify-center gap-2">
           <span className="material-symbols-outlined text-[18px]">delete_forever</span>
           Clear All Local Data
        </button>
      </section>
      
      <section className="bg-surface-container-low rounded-xl p-6 border border-slate-200/50 dark:border-slate-800/50 mt-4 space-y-4">
        <div className="flex justify-between items-center bg-surface-container-highest p-4 rounded-lg cursor-pointer shadow-sm mb-4" onClick={toggleTheme}>
           <div>
             <h3 className="font-headline font-bold text-sm text-on-surface">Dark Mode</h3>
             <p className="text-xs text-on-surface-variant mt-0.5 max-w-[200px]">Toggle dark UI theme</p>
           </div>
           <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`w-4 h-4 rounded-full shadow-sm bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
           </div>
        </div>

         <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <h3 className="font-headline font-bold text-lg text-on-surface">About</h3>
          <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">
             Vimchi Dashboard App <br /> Version 1.2
          </p>
        </div>
      </section>
    </div>
  );
}
