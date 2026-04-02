import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjectsStorage } from '../hooks/useProjectsStorage';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProjectsStorage();
  
  const project = projects.find(p => p.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(project || {});

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h3 className="text-slate-900 font-bold mb-1 tracking-tight font-headline">Project Not Found</h3>
        <Link to="/" className="text-blue-500 underline text-sm mt-4 tracking-tighter">Go back to projects</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
      navigate('/');
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let finalData = { ...editData };
    
    // Auto fetch screenshot on save if missing
    if (!finalData.image && (finalData.vimchiUrl || finalData.localUrl || finalData.githubUrl)) {
      const targetUrl = finalData.vimchiUrl || finalData.localUrl || finalData.githubUrl;
      if (targetUrl.startsWith('http')) {
         finalData.image = `https://image.thum.io/get/width/600/crop/400/${targetUrl}`;
      }
    }

    updateProject(id, finalData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
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
        setEditData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHtmlUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({ ...prev, htmlContent: e.target.result }));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="text-sm font-bold tracking-tight">Back</span>
        </Link>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(!isEditing)} className="bg-surface-container-high px-3 py-1.5 rounded-full text-xs font-bold font-label uppercase text-on-surface-variant hover:bg-surface-variant">
            {isEditing ? 'Cancel Edit' : 'Edit Project'}
          </button>
          {!isEditing && (
             <button onClick={handleDelete} className="bg-error-container text-on-error-container px-3 py-1.5 rounded-full text-xs font-bold font-label uppercase hover:bg-red-200">
               Delete
             </button>
          )}
        </div>
      </div>

      {!isEditing ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Project Details</span>
          </div>

          <section className="relative group">
            {project.image ? (
              <div className="aspect-[21/9] w-full rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] bg-surface-container-low border border-slate-200/40 dark:border-slate-700/40">
                <img className="w-full h-full object-cover" src={project.image} alt={project.name}/>
              </div>
            ) : (
              <div className="aspect-[21/9] w-full flex items-center justify-center rounded-[24px] bg-surface-container-low border-2 border-dashed border-outline-variant/30 text-on-surface-variant">
                 <span className="material-symbols-outlined text-4xl">inventory_2</span>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div className="space-y-0.5">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-on-primary-container">Workspace App</p>
              <h2 className="font-headline font-extrabold text-2xl tracking-tight text-on-surface">{project.name}</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-surface-container-high px-2 py-0.5 rounded text-[11px] font-medium text-on-surface-variant">Status: {project.status}</span>
              <span className="bg-surface-container-high px-2 py-0.5 rounded text-[11px] font-medium text-on-surface-variant">Added: {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </section>

          <section className="space-y-3 pt-2">
            <div className="h-1 w-10 bg-on-tertiary-container/30 rounded-full"></div>
            <p className="font-body text-on-surface-variant leading-relaxed text-sm">
              {project.description || "No project description provided. Click the edit button to add details about your architecture, technology stack, and project goals."}
            </p>
            {(project.vimchiUrl || project.localUrl || project.githubUrl) && (
              <div className="bg-surface-container-highest/50 px-4 py-3 rounded-[16px] border border-outline-variant/30 mt-4 flex flex-col gap-1 shadow-sm">
                 <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Primary URL</span>
                 <p className="font-mono text-xs text-primary truncate selectable">
                   {project.vimchiUrl || project.localUrl || project.githubUrl}
                 </p>
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 gap-3 pt-4 border-t border-surface-container-highest/50">
            {project.vimchiUrl && (
              <a href={project.vimchiUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-on-primary rounded-[18px] font-headline font-bold text-sm tracking-tight active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                  Open Vimchi App
              </a>
            )}
            
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-black text-white rounded-[18px] font-headline font-bold text-sm tracking-tight border border-outline-variant/20 hover:bg-slate-900 active:scale-[0.98] transition-all shadow-sm">
                  <span className="material-symbols-outlined text-lg">code</span>
                  View on GitHub
              </a>
            )}

            {project.localUrl && (
              <a href={project.localUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 rounded-[18px] font-headline font-bold text-sm tracking-tight border border-outline-variant/20 hover:bg-blue-200 dark:hover:bg-blue-800 active:scale-[0.98] transition-all shadow-sm">
                  <span className="material-symbols-outlined text-lg">computer</span>
                  Open Local Environment
              </a>
            )}
          </section>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-5 pt-4 bg-white/60 dark:bg-slate-900/40 p-6 rounded-[24px] border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative -mx-2 backdrop-blur-md">
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Project Name</label>
            <input name="name" value={editData.name} onChange={handleChange} className="w-full bg-surface-container-highest rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none" required />
          </div>
          <div className="space-y-4">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Visual Asset</label>
            <label className="group relative w-full aspect-video rounded-xl bg-surface-container-highest flex flex-col items-center cursor-pointer justify-center gap-2 transition-all hover:bg-surface-container-high overflow-hidden shadow-sm">
              <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="hidden" />
              
              {editData.image ? (
                  <img src={editData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-on-surface-variant">image</span>
                    </div>
                    <div className="text-center">
                      <p className="font-body text-xs font-semibold text-on-surface">Upload Image</p>
                    </div>
                  </>
              )}
            </label>
          </div>
          
          {editData.isLocalHtml && (
             <div className="space-y-4 pt-2">
               <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Update HTML File</label>
               <label className={`group relative w-full pt-8 pb-8 rounded-xl border-2 border-dashed flex flex-col items-center cursor-pointer justify-center gap-3 transition-all overflow-hidden ${editData.htmlContent ? 'border-primary/50 bg-primary/5' : 'bg-surface-container-highest border-outline-variant/40 hover:bg-surface-container-high'}`}>
                 <input type="file" accept=".html,.htm" onChange={handleHtmlUpload} className="hidden" />
                 {editData.htmlContent ? (
                    <>
                       <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-sm">check</span>
                       </div>
                       <div className="text-center">
                         <p className="font-body text-xs font-bold text-on-surface text-primary">HTML Content Edited!</p>
                         <p className="font-body text-[10px] text-on-surface-variant mt-1">Tap to replace</p>
                       </div>
                    </>
                 ) : (
                    <>
                       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm font-bold text-[8px] tracking-widest uppercase">
                          HTML
                       </div>
                       <div className="text-center">
                         <p className="font-body text-xs font-bold text-on-surface">Upload HTML File</p>
                       </div>
                    </>
                 )}
               </label>
             </div>
          )}
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Vimchi URL</label>
            <input name="vimchiUrl" value={editData.vimchiUrl || ''} onChange={handleChange} className="w-full bg-surface-container-highest rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none" type="url" />
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">GitHub URL</label>
            <input name="githubUrl" value={editData.githubUrl || ''} onChange={handleChange} className="w-full bg-surface-container-highest rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none" type="url" />
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Local URL</label>
            <input name="localUrl" value={editData.localUrl || ''} onChange={handleChange} className="w-full bg-surface-container-highest rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none" />
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Status</label>
            <select name="status" value={editData.status} onChange={handleChange} className="w-full bg-surface-container-highest rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 border-none transition-all">
               <option value="Active">Active</option>
               <option value="Archived">Archived</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Description</label>
            <textarea name="description" value={editData.description || ''} onChange={handleChange} className="w-full bg-surface-container-highest rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none" rows="3"></textarea>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3.5 mt-2 rounded-full font-bold font-headline tracking-tighter shadow-[0_4px_14px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-transform">Save Changes</button>
        </form>
      )}
    </div>
  );
}
