import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectsStorage } from '../hooks/useProjectsStorage';

export default function AddProject() {
  const navigate = useNavigate();
  const { addProject } = useProjectsStorage();

  const [formData, setFormData] = useState({
    name: '',
    vercelUrl: '',
    githubUrl: '',
    localUrl: '',
    description: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Project Name is required.");
      return;
    }
    
    let finalData = { ...formData };
    if (!finalData.image && (finalData.vercelUrl || finalData.localUrl || finalData.githubUrl)) {
      const targetUrl = finalData.vercelUrl || finalData.localUrl || finalData.githubUrl;
      if (targetUrl.startsWith('http')) {
         finalData.image = `https://image.thum.io/get/width/600/crop/400/${targetUrl}`;
      }
    }

    addProject(finalData);
    navigate('/');
  };

  return (
    <>
      <header className="mb-6">
        <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface">Add New Project</h2>
        <p className="text-on-surface-variant mt-2 font-body text-sm">Deploy a fresh architectural vision to the cloud.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project Name */}
        <div className="space-y-2">
          <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Project Name</label>
          <div className="focus-bar-input bg-surface-container-highest rounded-md transition-all duration-200">
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 text-on-surface font-body placeholder:text-outline/50" 
              placeholder="e.g. Modernist Pavilion" 
              type="text" 
              required
            />
          </div>
        </div>

        {/* Vercel App URL */}
        <div className="space-y-2">
          <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Vercel App URL</label>
          <div className="focus-bar-input bg-surface-container-highest rounded-md transition-all duration-200">
            <input 
              name="vercelUrl"
              value={formData.vercelUrl}
              onChange={handleChange}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 text-on-surface font-body placeholder:text-outline/50" 
              placeholder="https://project-name.vercel.app" 
              type="url" 
            />
          </div>
        </div>

        {/* GitHub URL */}
        <div className="space-y-2">
          <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">GitHub URL</label>
          <div className="focus-bar-input bg-surface-container-highest rounded-md transition-all duration-200">
            <input 
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 text-on-surface font-body placeholder:text-outline/50" 
              placeholder="https://github.com/studio/repo" 
              type="url" 
            />
          </div>
        </div>

        {/* Local Address / Custom URL */}
        <div className="space-y-2">
          <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Local Address / Custom URL</label>
          <div className="focus-bar-input bg-surface-container-highest rounded-md transition-all duration-200">
            <input 
              name="localUrl"
              value={formData.localUrl}
              onChange={handleChange}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 text-on-surface font-body placeholder:text-outline/50" 
              placeholder="http://localhost:3000 or custom domain" 
              type="text" 
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Short Description</label>
          <div className="focus-bar-input bg-surface-container-highest rounded-md transition-all duration-200">
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 text-on-surface font-body placeholder:text-outline/50 resize-none" 
              placeholder="Brief technical summary of the project architecture and goals..." 
              rows="4"
            ></textarea>
          </div>
        </div>

        {/* Upload Screenshot */}
        <div className="space-y-4">
          <label className="font-label text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Visual Asset</label>
          <label className="group relative w-full aspect-video rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant/30 flex flex-col items-center cursor-pointer justify-center gap-3 transition-all hover:bg-surface-container hover:border-outline-variant/60 overflow-hidden">
            <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="hidden" />
            
            {formData.image ? (
               <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-on-surface-variant">image</span>
                  </div>
                  <div className="text-center">
                    <p className="font-body text-sm font-semibold text-on-surface">Upload Screenshot</p>
                    <p className="font-body text-xs text-on-surface-variant mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </>
            )}
          </label>
        </div>

        {/* Save Project Button */}
        <div className="pt-6">
          <button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-body font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
            <span className="material-symbols-outlined text-lg">cloud_upload</span>
            Save Project
          </button>
        </div>
      </form>
    </>
  );
}
