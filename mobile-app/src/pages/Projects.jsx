import { Link, useSearchParams } from 'react-router-dom';
import { useProjectsStorage } from '../hooks/useProjectsStorage';

const getBackgroundColor = (name) => {
  if (!name) return 'bg-slate-500';
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function Projects() {
  const { projects } = useProjectsStorage();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const filteredProjects = projects.filter(p => 
      p.name.toLowerCase().includes(query) || 
      (p.description || '').toLowerCase().includes(query)
  );

  const activeCount = filteredProjects.filter(p => p.status === 'Active').length;
  const archivedCount = filteredProjects.filter(p => p.status === 'Archived').length;
  const totalDeployed = filteredProjects.length;

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <h2 className="font-headline font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-50">My Projects</h2>
        <span className="bg-slate-200/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold text-xs px-2.5 py-1 rounded-md">
          {totalDeployed}
        </span>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white/50 border-2 border-dashed border-slate-200 rounded-xl">
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">folder_open</span>
          <h3 className="text-slate-900 font-bold mb-1">No projects found</h3>
          <p className="text-slate-500 text-sm max-w-[200px] mx-auto">Try a different search term or add a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map(project => (
            <Link key={project.id} to={`/project/${project.id}`} className="bg-surface-container-low p-4 rounded-[20px] block border border-slate-200/40 dark:border-slate-800/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-outline-variant/50 transition-all duration-200 ease-out cursor-pointer relative top-0 hover:-top-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm">
              <div className="flex justify-between items-start mb-3 gap-3">
                <div className="flex gap-3 items-center flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm text-white font-headline font-bold text-lg ${getBackgroundColor(project.name)}`}>
                    {project.name ? project.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-on-surface text-lg leading-tight truncate">{project.name}</h3>
                    <p className="font-body text-xs text-on-surface-variant truncate mt-1">{project.vimchiUrl || project.localUrl || 'No URL specified'}</p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/30 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-on-surface flex items-center gap-1.5 shrink-0 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'Active' ? 'bg-tertiary-fixed-dim' : 'bg-slate-300'}`}></div>
                  {project.status === 'Active' ? 'READY' : project.status.toUpperCase()}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-outline-variant/20 flex gap-4 text-xs font-label">
                <div className="bg-surface-container-highest px-3 py-1.5 rounded-md flex items-center gap-1.5 font-mono text-on-surface-variant flex-1 justify-center">
                  <span className="material-symbols-outlined text-[14px]">commit</span>
                  {project.id.slice(-7)}
                </div>
                <div className="bg-surface-container-highest px-3 py-1.5 rounded-md flex items-center gap-1.5 font-mono text-on-surface-variant flex-1 justify-center">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
