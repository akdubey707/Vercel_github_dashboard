import { useState, useEffect } from 'react';

const STORAGE_KEY = 'vimchi_dashboard_projects';

export function useProjectsStorage() {
  const [projects, setProjects] = useState(() => {
    try {
      let item = window.localStorage.getItem(STORAGE_KEY);
      
      // Automatic data migration from old vercel storage
      if (!item) {
         const oldItem = window.localStorage.getItem('vercel_dashboard_projects');
         if (oldItem) {
            const parsed = JSON.parse(oldItem);
            const migrated = parsed.map(p => {
               if (p.vercelUrl) {
                   p.vimchiUrl = p.vercelUrl;
                   delete p.vercelUrl;
               }
               return p;
            });
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
            return migrated;
         }
      }
      
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Error reading localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [projects]);

  const addProject = (project) => {
    setProjects([
      {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'Active',
        ...project
      },
      ...projects
    ]);
  };

  const updateProject = (id, updatedFields) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, ...updatedFields } : p
    ));
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };
  
  const clearProjects = () => {
    setProjects([]);
  };

  return { projects, addProject, updateProject, deleteProject, clearProjects };
}
