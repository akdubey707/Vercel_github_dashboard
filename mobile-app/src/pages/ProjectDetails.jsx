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
    updateProject(id, editData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
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
              <div className="aspect-[21/9] w-full rounded-xl overflow-hidden shadow-sm bg-surface-container-low border border-slate-200/50">
                <img className="w-full h-full object-cover" src={project.image} alt={project.name}/>
              </div>
            ) : (
              <div className="aspect-[21/9] w-full flex items-center justify-center rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant/30 text-on-surface-variant">
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
          </section>

          <section className="grid grid-cols-1 gap-3 pt-4 border-t border-surface-container-highest">
            {project.vercelUrl && (
              <a href={project.vercelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-on-primary rounded-xl font-headline font-bold text-sm tracking-tight active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                  Open Vercel App
              </a>
            )}
            
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-surface-container-lowest text-on-surface-variant rounded-xl font-headline font-bold text-sm tracking-tight border border-outline-variant/15 hover:bg-surface-container-high active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined text-lg">code</span>
                  View on GitHub
              </a>
            )}

            {project.localUrl && (
              <a href={project.localUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-surface-container-lowest text-on-surface-variant rounded-xl font-headline font-bold text-sm tracking-tight border border-outline-variant/15 hover:bg-surface-container-high active:scale-[0.98] transition-all shadow-sm">
                  <span className="material-symbols-outlined text-lg">computer</span>
                  Open Local Environment
              </a>
            )}
          </section>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-6 pt-4 bg-white/50 p-6 rounded-xl border border-slate-200 relative -mx-2">
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Project Name</label>
            <input name="name" value={editData.name} onChange={handleChange} className="w-full bg-surface-container-highest rounded px-3 py-2 text-sm text-on-surface" required />
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Vercel URL</label>
            <input name="vercelUrl" value={editData.vercelUrl || ''} onChange={handleChange} className="w-full bg-surface-container-highest rounded px-3 py-2 text-sm text-on-surface" type="url" />
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">GitHub URL</label>
            <input name="githubUrl" value={editData.githubUrl || ''} onChange={handleChange} className="w-full bg-surface-container-highest rounded px-3 py-2 text-sm text-on-surface" type="url" />
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Local URL</label>
            <input name="localUrl" value={editData.localUrl || ''} onChange={handleChange} className="w-full bg-surface-container-highest rounded px-3 py-2 text-sm text-on-surface" />
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Status</label>
            <select name="status" value={editData.status} onChange={handleChange} className="w-full bg-surface-container-highest rounded px-3 py-2 text-sm text-on-surface">
               <option value="Active">Active</option>
               <option value="Archived">Archived</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold uppercase text-on-surface-variant/80">Description</label>
            <textarea name="description" value={editData.description || ''} onChange={handleChange} className="w-full bg-surface-container-highest rounded px-3 py-2 text-sm text-on-surface" rows="3"></textarea>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold font-headline tracking-tighter">Save Changes</button>
        </form>
      )}
    </div>
  );
}
