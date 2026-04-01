import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Projects from './pages/Projects';
import AddProject from './pages/AddProject';
import Settings from './pages/Settings';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Projects />} />
        <Route path="add" element={<AddProject />} />
        <Route path="settings" element={<Settings />} />
        <Route path="project/:id" element={<ProjectDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
