import { useState, useEffect } from 'react';

const STORAGE_KEY = 'vercel_dashboard_projects';

export function useProjectsStorage() {
  const [projects, setProjects] = useState(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
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
