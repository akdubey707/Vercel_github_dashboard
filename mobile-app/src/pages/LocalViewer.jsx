import { useParams, useNavigate } from 'react-router-dom';
import { useProjectsStorage } from '../hooks/useProjectsStorage';
import { useEffect, useState } from 'react';

export default function LocalViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useProjectsStorage();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      setProject(proj);
    } else {
      navigate('/html', { replace: true });
    }
  }, [id, projects, navigate]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top Header strictly for navigating out of the viewer */}
      <div className="bg-slate-900 text-white flex items-center justify-between px-4 py-3 shadow-md z-10 relative">
        <div className="flex flex-col">
           <span className="font-headline font-bold text-sm tracking-tight">{project.name}</span>
           <span className="font-mono text-[10px] text-slate-400 opacity-80">{project.localUrl}</span>
        </div>
        <button 
          onClick={() => navigate('/html')} 
          className="bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      {/* The isolated embedded HTML content */}
      <div className="flex-1 w-full bg-white relative">
        {project.htmlContent ? (
          <iframe 
             srcDoc={project.htmlContent}
             className="w-full h-full border-none inset-0 absolute"
             sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
             title={project.name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col text-slate-500 gap-4">
             <span className="material-symbols-outlined text-5xl">broken_image</span>
             <p className="font-body text-sm">No valid HTML content associated with this project.</p>
          </div>
        )}
      </div>
    </div>
  );
}
