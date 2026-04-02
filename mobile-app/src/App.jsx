import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Projects from './pages/Projects';
import AddProject from './pages/AddProject';
import Settings from './pages/Settings';
import ProjectDetails from './pages/ProjectDetails';
import HtmlTab from './pages/HtmlTab';
import LocalViewer from './pages/LocalViewer';
import { useTheme } from './hooks/useTheme';

function App() {
  useTheme(); // Initialize theme on mount
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Projects />} />
        <Route path="html" element={<HtmlTab />} />
        <Route path="add" element={<AddProject />} />
        <Route path="settings" element={<Settings />} />
        <Route path="project/:id" element={<ProjectDetails />} />
      </Route>
      {/* Viewer is conceptually outside of Layout's bottom nav margins */}
      <Route path="/viewer/:id" element={<LocalViewer />} />
    </Routes>
  );
}

export default App;
