import { Link } from 'react-router-dom';
import { useProjectsStorage } from '../hooks/useProjectsStorage';

export default function Projects() {
  const { projects } = useProjectsStorage();

  const activeCount = projects.filter(p => p.status === 'Active').length;
  const archivedCount = projects.filter(p => p.status === 'Archived').length;
  const totalDeployed = projects.length;

  return (
    <>
      <div className="mb-6">
        <h2 className="font-headline font-extrabold text-2xl tracking-tight text-primary mb-2">My Projects</h2>
        <div className="h-1 w-12 bg-on-tertiary-container rounded-full"></div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {/* Total Deployed Tile */}
        <div className="bg-white border border-slate-200 p-4 rounded flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-headline">Total Deployed</span>
          <div className="flex items-baseline gap-2"><span className="text-2xl font-extrabold text-[#0F172A] font-headline">{totalDeployed}</span></div>
        </div>

        {/* Active Tile */}
        <div className="bg-white border border-slate-200 p-4 rounded flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-headline">Active</span>
          <div className="flex items-baseline gap-2"><span className="text-2xl font-extrabold text-[#0F172A] font-headline">{activeCount}</span></div>
        </div>

        {/* Archived Tile */}
        <div className="bg-white border border-slate-200 p-4 rounded flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-headline">Archived</span>
          <div className="flex items-baseline gap-2"><span className="text-2xl font-extrabold text-[#0F172A] font-headline">{archivedCount}</span></div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white/50 border-2 border-dashed border-slate-200 rounded-xl">
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">folder_open</span>
          <h3 className="text-slate-900 font-bold mb-1">No projects yet</h3>
          <p className="text-slate-500 text-sm max-w-[200px] mx-auto">Add your first project to get started with monitoring and deployments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map(project => (
            <Link key={project.id} to={`/project/${project.id}`} className="bg-surface-container-low p-5 rounded-xl block border border-transparent hover:border-outline-variant/30 transition-all cursor-pointer relative top-0 hover:-top-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center overflow-hidden shrink-0">
                    {project.image ? (
                        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="material-symbols-outlined text-slate-400">deployed_code</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface text-lg leading-tight">{project.name}</h3>
                    <p className="font-body text-xs text-on-surface-variant line-clamp-1 mt-1">{project.vercelUrl || project.localUrl || 'No URL specified'}</p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/30 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-on-surface flex items-center gap-1.5">
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
