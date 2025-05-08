import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes } from '../utils/routes';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useProjectStore } from '../store/projectStore';

interface Project { id: string; name: string; }

const ProjectsPage: React.FC = () => {
  const token = useUserStore(state => state.user.accessToken);

  const deleteProject = useProjectStore(state => state.deleteProject);
  const updateProject = useProjectStore(state => state.updateProjectService);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteProject(id, token);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
    }
  };

  const openEditModal = (proj: Project) => {
    try {
      setEditingProject(proj);
      setEditName(proj.name || '');

      const description = (proj as any)?.description;
      setEditDescription(typeof description === 'string' ? description : '');

      let startDate = '';
      let endDate = '';

      try {
        if ((proj as any)?.startDate) {
          const date = new Date((proj as any).startDate);
          if (!isNaN(date.getTime())) {
            startDate = date.toISOString().slice(0, 16);
          }
        }
      } catch (e) {
        console.warn('Invalid start date format:', e);
      }

      try {
        if ((proj as any)?.endDate) {
          const date = new Date((proj as any).endDate);
          if (!isNaN(date.getTime())) {
            endDate = date.toISOString().slice(0, 16);
          }
        }
      } catch (e) {
        console.warn('Invalid end date format:', e);
      }

      setEditStartDate(startDate);
      setEditEndDate(endDate);
      setShowEditModal(true);
    } catch (err) {
      console.error('Error preparing project edit:', err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProject) return;

    try {
      let startDateObj, endDateObj;

      try {
        startDateObj = editStartDate ? new Date(editStartDate) : new Date();
        if (isNaN(startDateObj.getTime())) throw new Error('Invalid start date');
      } catch (e) {
        setError('Invalid start date format');
        return;
      }

      try {
        endDateObj = editEndDate ? new Date(editEndDate) : new Date();
        if (isNaN(endDateObj.getTime())) throw new Error('Invalid end date');
      } catch (e) {
        setError('Invalid end date format');
        return;
      }

      const payload = {
        name: editName.trim(),
        description: editDescription.trim(),
        startDate: startDateObj.toISOString(),
        endDate: endDateObj.toISOString(),
      };

      const updated = await updateProject(editingProject.id, payload, token);
      if (updated) {
        setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      }
      setShowEditModal(false);
      setEditingProject(null);
      setError(null);
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project. Please check your inputs and try again.');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching projects...');
        const resp = await axios.get<Project[]>(Routes.GET_PROJECTS, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Projects received:', resp.data);

        if (isMounted) {
          if (Array.isArray(resp.data)) {
            setProjects(resp.data);
          } else {
            console.error('Invalid projects data format:', resp.data);
            setError('Received invalid data format from server');
          }
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        if (isMounted) {
          setError('Failed to load projects. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V9m0 0V7m0 2h2m-2 0H9" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Expirée</h2>
          <p className="text-gray-600 mb-6">Veuillez vous reconnecter pour accéder à vos projets.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
            Se Connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">My Projects</h1>
          <p className="text-lg text-gray-600 mb-8">Manage and organize all your projects in one place</p>
          <Link
            to="/projects/new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Project
          </Link>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No projects yet</h2>
            <p className="text-gray-600 mb-6">Create your first project to get started</p>
            <Link
              to="/projects/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
                <div className="h-2 bg-blue-600"></div>
                <div className="p-6">
                  <Link to={`/projects/${p.id}`} className="block">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600 transition">{p.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      {(p as any).description ?
                        (p as any).description.length > 100 ?
                          `${(p as any).description.substring(0, 100)}...` :
                          (p as any).description
                        : 'No description provided'}
                    </p>
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {(p as any).startDate ? new Date((p as any).startDate).toLocaleDateString() : 'No start date'}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {(p as any).endDate ? new Date((p as any).endDate).toLocaleDateString() : 'No end date'}
                    </div>
                  </Link>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition text-sm font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex items-center text-red-600 hover:text-red-800 transition text-sm font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-md z-60 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Project</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="editName" className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    id="editName"
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="editDescription"
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="editStartDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      id="editStartDate"
                      type="datetime-local"
                      value={editStartDate}
                      onChange={e => setEditStartDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="editEndDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      id="editEndDate"
                      type="datetime-local"
                      value={editEndDate}
                      onChange={e => setEditEndDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
