import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes } from '../utils/routes';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

interface Project { id: string; name: string; }

const ProjectsPage: React.FC = () => {
  const token = useUserStore(state => state.user.accessToken);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const resp = await axios.get<Project[]>(Routes.GET_PROJECTS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
        <Link
          to="/projects/new"
          className="mt-4 md:mt-0 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Project
        </Link>
      </header>

      {loading
        ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-500">Loading...</span>
          </div>
        )
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
              <Link
                to={`/projects/${p.id}`}
                key={p.id}
                className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{p.name}</h2>
                <p className="text-sm text-gray-500">View details &rarr;</p>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
};

export default ProjectsPage;
