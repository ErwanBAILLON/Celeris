import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { getProjects, deleteProject, updateProject, Project } from '../services/project/projectService';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteProject(id);
      setProjects(projects.filter(project => project.id !== id));
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const validateForm = (data: any) => {
    const errors: Record<string, string> = {};
    
    if (!data.name.trim()) {
      errors.name = 'Project name is required';
    }
    
    if (!data.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!data.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!data.endDate) {
      errors.endDate = 'End date is required';
    }
    
    if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    return errors;
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProject) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const payload = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    };
    
    const errors = validateForm(payload);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setIsSaving(true);
      const updated = await updateProject(editingProject.id, payload);
      setProjects(projects.map(p => p.id === editingProject.id ? updated : p));
      setShowEditModal(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <Link to="/projects/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <FaPlus className="mr-2" /> New Project
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 mb-4">You don't have any projects yet</p>
              <Link to="/projects/new" className="text-blue-500 hover:underline flex items-center justify-center">
                <FaPlus className="mr-1" /> Create your first project
              </Link>
            </div>
          ) : (
            projects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <Link to={`/projects/${project.id}`} className="text-blue-500 hover:underline">
                      View Details
                    </Link>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(project)}
                        className="text-gray-500 hover:text-blue-500"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => {
                          setProjectToDelete(project.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Project</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">Project Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={editingProject.name}
                  className="w-full p-2 border rounded"
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={editingProject.description}
                  className="w-full p-2 border rounded"
                  rows={3}
                ></textarea>
                {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  defaultValue={editingProject.startDate}
                  className="w-full p-2 border rounded"
                />
                {formErrors.startDate && <p className="text-red-500 text-sm mt-1">{formErrors.startDate}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  defaultValue={editingProject.endDate}
                  className="w-full p-2 border rounded"
                />
                {formErrors.endDate && <p className="text-red-500 text-sm mt-1">{formErrors.endDate}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => projectToDelete && handleDelete(projectToDelete)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
