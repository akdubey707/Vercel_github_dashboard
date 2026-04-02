import { useState } from 'react';
import { useProjectsStorage } from '../hooks/useProjectsStorage';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function HtmlTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'list';

  const setView = (newView) => {
    if (newView === 'list') {
      searchParams.delete('view');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ view: newView });
    }
  };

  const { projects, addProject, deleteProject } = useProjectsStorage();
  const navigate = useNavigate();

  const localProjects = projects.filter(p => p.isLocalHtml);

  const [formData, setFormData] = useState({
    name: '',
    localUrl: '',
    description: '',
    image: '',
    htmlContent: '',
    autoPort: false,
    runLocally: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleHtmlUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, htmlContent: e.target.result }));
      };
      reader.readAsText(file);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeploy = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Project name is required.");
      return;
    }
    
    let finalUrl = formData.localUrl;
    let assignedPort = null;

    if (formData.autoPort) {
      // Auto-assign start at 3000
      let maxPort = 2999;
      projects.forEach(p => {
        if (p.port && p.port > maxPort) {
          maxPort = p.port;
        }
      });
      assignedPort = maxPort + 1;
      finalUrl = `http://localhost:${assignedPort}`;
    }

    addProject({
      name: formData.name,
      description: formData.description,
      localUrl: finalUrl,
      image: formData.image,
      htmlContent: formData.htmlContent,
      port: assignedPort,
      isLocalHtml: true
    });

    // Reset form
    setFormData({
      name: '',
      localUrl: '',
      description: '',
      image: '',
      htmlContent: '',
      autoPort: false,
      runLocally: false
    });
    
    setView('list');
  };

  return (
    <>
      <header className="mb-6">
        {view === 'list' ? (
          <>
            <div className="flex items-center gap-3">
              <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface">Local Environment</h2>
              <span className="bg-slate-200/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold text-xs px-2.5 py-1 rounded-md">
                {localProjects.length}
              </span>
            </div>
            <p className="text-on-surface-variant mt-2 font-body text-sm">Manage and sync your locally running development instances.</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setView('list')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors text-on-surface-variant shrink-0 -ml-2">
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface">Add New Project</h2>
            </div>
            <p className="text-on-surface-variant mt-2 font-body text-sm pl-[44px]">Deploy a fresh architectural vision to the cloud.</p>
          </>
        )}
      </header>



      {view === 'list' && localProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-10 pb-8 px-6 text-center animate-fade-in">
          <div className="w-20 h-20 bg-surface-container-high/50 rounded-3xl flex items-center justify-center mb-6 text-on-surface-variant">
             <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>tab_close</span>
          </div>
          <h3 className="font-headline font-extrabold text-xl mb-3 text-on-surface">No projects found</h3>
          <p className="font-body text-on-surface-variant text-sm mb-8 leading-relaxed px-4">
            You haven't added any local projects yet. Start by adding your first project to manage it here.
          </p>
          <button 
            onClick={() => setView('add')}
            className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-6 py-3.5 rounded-xl font-label font-bold tracking-tight flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm min-w-[200px]"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Project
          </button>
        </div>
      )}

      {view === 'list' && localProjects.length > 0 && (
         <div className="animate-fade-in space-y-4">
            {localProjects.map(proj => (
              <div key={proj.id} onClick={() => navigate(`/project/${proj.id}`)} className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-surface-container-highest transition-colors">
                 <div>
                    <h4 className="font-headline font-bold text-on-surface">{proj.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-1">{proj.port ? `Running on port ${proj.port}` : (proj.localUrl || 'No custom URL')}</p>
                 </div>
                 <div className="flex gap-2">
                    {proj.htmlContent && (
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/viewer/${proj.id}`); }} className="bg-primary/10 text-primary dark:bg-primary/20 p-2 rounded-lg flex items-center justify-center">
                         <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }} className="bg-error/10 text-error dark:bg-error-container/50 dark:text-error p-2 rounded-lg flex items-center justify-center transition-colors hover:bg-error/20">
                       <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                 </div>
              </div>
            ))}
            
            <button 
               onClick={() => setView('add')}
               className="w-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-6 py-3.5 rounded-xl font-label font-bold flex items-center justify-center gap-2 mt-4"
            >
               <span className="material-symbols-outlined text-lg">add</span>
               Add Another
            </button>
         </div>
      )}

      {view === 'add' && (
        <form onSubmit={handleDeploy} className="space-y-6 animate-fade-in pb-10">
          {/* Project Name */}
          <div className="space-y-2">
            <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Project Name</label>
            <div className="focus-bar-input bg-surface-container-highest rounded-xl transition-all duration-200 border border-transparent focus-within:border-slate-300">
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 text-slate-800 dark:text-slate-200 font-medium font-body placeholder:text-outline/50" 
                placeholder="e.g. My Project" 
                type="text" 
                required
              />
            </div>
          </div>

          {/* Local Address */}
          <div className="space-y-2">
            <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Local Address / Custom URL</label>
            <div className="relative flex items-center bg-surface-container-highest rounded-xl border border-transparent focus-within:border-slate-300 overflow-hidden">
              <input 
                name="localUrl"
                value={formData.localUrl}
                onChange={handleChange}
                disabled={formData.autoPort}
                className={`w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 pr-24 text-slate-800 dark:text-slate-200 font-medium font-body placeholder:text-outline/50 ${formData.autoPort ? 'opacity-50' : ''}`} 
                placeholder="http://localhost:3000" 
                type="text" 
              />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
                Detect
              </button>
            </div>
            <div className="flex items-center justify-between px-1 pt-1">
               <span className="text-[10px] text-on-surface-variant font-body italic">Auto-select available port and host</span>
               <label className={`w-8 h-4 rounded-full flex items-center p-0.5 justify-between cursor-pointer transition-colors ${formData.autoPort ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <input type="checkbox" name="autoPort" checked={formData.autoPort} onChange={handleChange} className="hidden" />
                  <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${formData.autoPort ? 'translate-x-4' : 'translate-x-0'}`}></div>
               </label>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Short Description</label>
            <div className="focus-bar-input bg-surface-container-highest rounded-xl transition-all duration-200 border border-transparent focus-within:border-slate-300">
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 text-slate-800 dark:text-slate-200 font-medium font-body placeholder:text-outline/50 resize-none min-h-[100px]" 
                placeholder="Brief technical summary of the project architecture and goals..." 
              ></textarea>
            </div>
          </div>

          {/* HTML Upload section */}
          <div className="space-y-4 pt-2">
             <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">HTML Upload</label>
             <label className={`group relative w-full pt-10 pb-10 rounded-2xl border-2 border-dashed flex flex-col items-center cursor-pointer justify-center gap-3 transition-all overflow-hidden ${formData.htmlContent ? 'border-primary/50 bg-primary/5' : 'bg-surface-container-highest/30 border-outline-variant/40 hover:bg-surface-container-high/50'}`}>
               <input type="file" accept=".html,.htm" onChange={handleHtmlUpload} className="hidden" />
               
               {formData.htmlContent ? (
                  <>
                     <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined">check</span>
                     </div>
                     <div className="text-center">
                       <p className="font-body text-sm font-bold text-on-surface text-primary">HTML Content Loaded!</p>
                       <p className="font-body text-xs text-on-surface-variant mt-1.5">Click to replace</p>
                     </div>
                  </>
               ) : (
                  <>
                     <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">html</span>
                     </div>
                     <div className="text-center">
                       <p className="font-body text-sm font-bold text-on-surface">Upload HTML File</p>
                       <p className="font-body text-xs text-on-surface-variant mt-1.5">Index.html or ZIP package</p>
                     </div>
                  </>
               )}
             </label>
             <div className="bg-surface-container-highest/60 rounded-xl p-4 flex items-center justify-between">
                <div>
                   <h5 className="font-body text-sm font-bold text-on-surface">Run project locally</h5>
                   <p className="font-body text-[10px] text-on-surface-variant mt-0.5">Enable local execution for the uploaded HTML</p>
                </div>
                <label className={`w-10 h-6 rounded-full flex items-center p-1 justify-between cursor-pointer transition-colors ${formData.runLocally ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <input type="checkbox" name="runLocally" checked={formData.runLocally} onChange={handleChange} className="hidden" />
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.runLocally ? 'translate-x-4' : 'translate-x-0'}`}></div>
               </label>
             </div>
          </div>

          {/* Upload Screenshot */}
          <div className="space-y-4 pt-2">
            <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Visual Asset</label>
            <label className="group relative w-full pt-10 pb-10 rounded-2xl bg-surface-container-highest/30 border-2 border-dashed border-outline-variant/40 flex flex-col items-center cursor-pointer justify-center gap-3 transition-all hover:bg-surface-container-high/50 overflow-hidden">
              <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="hidden" />
              
              {formData.image ? (
                 <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm z-10">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">image</span>
                  </div>
                  <div className="text-center z-10 relative">
                    <p className="font-body text-sm font-bold text-on-surface">Upload Screenshot</p>
                    <p className="font-body text-xs text-on-surface-variant mt-1.5">PNG, JPG up to 10MB</p>
                  </div>
                </>
              )}
            </label>
          </div>

          {/* Save Project Button */}
          <div className="pt-6">
            <button className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-body font-bold py-4 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
              <span className="material-symbols-outlined text-lg">cloud_upload</span>
              Deploy
            </button>
          </div>
        </form>
      )}
    </>
  );
}
