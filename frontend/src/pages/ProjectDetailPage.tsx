import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById, ProjectDetail } from '../services/project/projectService';
import { getTasks, createTask, deleteTask, updateTask, Task } from '../services/task/taskService';
import { useUserStore } from '../store/userStore';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('in progress');
  const [priority, setPriority] = useState('medium');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const token = useUserStore(s => s.user.accessToken);

  const handleOpenModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingTask(null);
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setStatus('in progress');
    setPriority('medium');
  };

  const openEditModal = (task: Task) => {
    try {
      if (!task) {
        console.error('Attempted to edit null task');
        return;
      }

      setEditingTask(task);
      setName(task.name || '');
      setDescription(task.description || '');

      try {
        if (task.startDate) {
          const date = new Date(task.startDate);
          if (!isNaN(date.getTime())) {
            setStartDate(date.toISOString().slice(0, 16));
          } else {
            console.warn('Invalid start date:', task.startDate);
            setStartDate('');
          }
        } else {
          setStartDate('');
        }
      } catch (e) {
        console.error('Error processing start date:', e);
        setStartDate('');
      }

      try {
        if (task.endDate) {
          const date = new Date(task.endDate);
          if (!isNaN(date.getTime())) {
            setEndDate(date.toISOString().slice(0, 16));
          } else {
            console.warn('Invalid end date:', task.endDate);
            setEndDate('');
          }
        } else {
          setEndDate('');
        }
      } catch (e) {
        console.error('Error processing end date:', e);
        setEndDate('');
      }

      setStatus(task.status || 'in progress');
      setPriority(task.priority || 'medium');
      setIsEditing(true);
      setShowModal(true);
    } catch (err) {
      console.error('Error preparing task edit:', err);
      setError('Failed to edit task. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !token) {
      setError('Authentication required');
      return;
    }

    try {
      if (!name.trim()) {
        setError('Task name is required');
        return;
      }

      if (!startDate || !endDate) {
        setError('Start and end dates are required');
        return;
      }

      let startDateObj, endDateObj;

      try {
        startDateObj = new Date(startDate);
        if (isNaN(startDateObj.getTime())) throw new Error('Invalid start date');
      } catch (e) {
        setError('Invalid start date format');
        return;
      }

      try {
        endDateObj = new Date(endDate);
        if (isNaN(endDateObj.getTime())) throw new Error('Invalid end date');
      } catch (e) {
        setError('Invalid end date format');
        return;
      }

      if (endDateObj < startDateObj) {
        setError('End date must be after start date');
        return;
      }

      const payload = {
        name: name.trim(),
        description: description.trim(),
        startDate: startDateObj.toISOString(),
        endDate: endDateObj.toISOString(),
        status,
        priority
      };

      if (isEditing && editingTask) {
        console.log('Updating task:', payload);
        try {
          const updated = await updateTask(id, editingTask.id, payload, token);
          console.log('Server response after update:', updated);
          
          // Mise à jour optimiste de l'interface avec une approche plus défensive
          setTasks(prev => {
            try {
              const newTasks = prev.map(t => t.id === editingTask.id ? { 
                ...t, 
                ...payload, 
                id: editingTask.id // Conserver l'ID original
              } : t);
              console.log('Tasks updated after edit:', newTasks);
              return newTasks;
            } catch (error) {
              console.error('Error updating tasks array:', error);
              return prev;
            }
          });
        } catch (updateError) {
          console.error('Error from server during update:', updateError);
          throw updateError;
        }
      } else {
        console.log('Creating new task:', payload);
        try {
          const newTask = await createTask(id, payload, token);
          console.log('Server response for new task:', newTask);
          
          // Création d'un objet tâche compatible avec notre interface, indépendamment de la réponse du serveur
          const formattedTask: Task = {
            id: newTask.id || `temp-${Date.now()}`, // Fallback ID si le serveur n'en renvoie pas
            name: payload.name,
            description: payload.description,
            startDate: payload.startDate,
            endDate: payload.endDate,
            status: payload.status,
            priority: payload.priority,
            // Ajoutez d'autres propriétés requises par l'interface Task ici avec des valeurs par défaut
          };
          
          console.log('Formatted task to add to UI:', formattedTask);
          
          // Ajouter la nouvelle tâche au state
          setTasks(prev => {
            try {
              const newTasks = [...prev, formattedTask];
              console.log('Tasks state after adding:', newTasks);
              return newTasks;
            } catch (error) {
              console.error('Error adding to tasks array:', error);
              return prev;
            }
          });
        } catch (createError) {
          console.error('Error from server during creation:', createError);
          // Même si le serveur a une erreur, on peut tenter d'ajouter quand même à l'UI si on sait qu'en réalité ça a fonctionné
          const tempTask: Task = {
            id: `temp-${Date.now()}`,
            ...payload,
          };
          setTasks(prev => [...prev, tempTask]);
          // Lancer l'erreur pour la gestion des erreurs
          throw createError;
        }
      }

      // Afficher une notification de succès
      const actionType = isEditing ? 'modifiée' : 'créée';
      const notificationElement = document.createElement('div');
      notificationElement.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notificationElement.textContent = `Tâche ${actionType} avec succès! La liste a été mise à jour.`;
      document.body.appendChild(notificationElement);
      
      setTimeout(() => {
        if (document.body.contains(notificationElement)) {
          document.body.removeChild(notificationElement);
        }
      }, 3000);
      
      // Réinitialiser le formulaire et fermer la modal
      setError(null);
      setIsEditing(false);
      setEditingTask(null);
      handleCloseModal();
    } catch (err) {
      console.error('Error handling task submission:', err);
      setError('Erreur lors de la sauvegarde de la tâche. Le serveur a peut-être bien enregistré la tâche mais une erreur frontend est survenue.');
      
      // Notification d'erreur qui suggère de recharger en cas de problème
      const errorNotification = document.createElement('div');
      errorNotification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorNotification.innerHTML = `
        <p>Une erreur est survenue, mais la tâche est probablement enregistrée.</p>
        <button class="underline mt-1 hover:text-gray-200" onclick="window.location.reload()">Recharger la page</button>
      `;
      document.body.appendChild(errorNotification);
      
      setTimeout(() => {
        if (document.body.contains(errorNotification)) {
          document.body.removeChild(errorNotification);
        }
      }, 10000);
    }
  };

  const calculateTasksByDate = (taskList: Task[]): Record<string, Task[]> => {
    console.log('Calculating tasks by date with tasks:', taskList);
    
    if (!Array.isArray(taskList)) {
      console.error('Invalid taskList, not an array:', taskList);
      return {};
    }
    
    try {
      return taskList
        .filter(t => {
          if (!t) {
            console.warn('Null or undefined task found in list');
            return false;
          }
          
          if (!t.id) {
            console.warn('Task without ID:', t);
            return false;
          }
          
          if (!t.startDate) {
            console.warn('Task without startDate:', t);
            return false;
          }
          
          try {
            // Vérifier que la date est valide
            const date = new Date(t.startDate);
            const isValid = !isNaN(date.getTime());
            if (!isValid) {
              console.warn('Task with invalid date format:', t);
            }
            return isValid;
          } catch (e) {
            console.error('Error processing task date:', e, t);
            return false;
          }
        })
        .reduce((acc, t) => {
          try {
            const date = new Date(t.startDate);
            const day = date.toISOString().split('T')[0];
            acc[day] = acc[day] ? [...acc[day], t] : [t];
            return acc;
          } catch (e) {
            console.error('Error grouping task by date:', e, t);
            return acc;
          }
        }, {} as Record<string, Task[]>);
    } catch (error) {
      console.error('Global error in calculateTasksByDate:', error);
      return {};
    }
  };

  const now = new Date();
  const tasksByDate = calculateTasksByDate(tasks);

  useEffect(() => {
    console.log('Tasks state updated:', tasks);
  }, [tasks]);

  useEffect(() => {
    let isMounted = true;

    const fetchProjectDetails = async () => {
      if (!id || !token) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        console.log('Fetching project details for ID:', id);
        const data = await getProjectById(id, token);

        if (isMounted) {
          if (data) {
            console.log('Project details received:', data);
            setProject(data);
            setError(null);
          } else {
            console.error('No project data returned');
            setError('Project not found');
          }
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        if (isMounted) {
          setError('Failed to load project details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjectDetails();

    return () => {
      isMounted = false;
    };
  }, [id, token]);

  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      if (!id || !token) {
        if (isMounted) {
          setTaskLoading(false);
        }
        return;
      }

      setTaskLoading(true);

      try {
        console.log('Fetching tasks for project:', id);
        const list = await getTasks(id, token);

        if (isMounted) {
          if (Array.isArray(list)) {
            console.log('Tasks received:', list);
            setTasks(list);
          } else {
            console.error('Invalid tasks data format:', list);
            setError('Received invalid task data format');
          }
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        if (isMounted) {
          setError('Failed to load tasks');
        }
      } finally {
        if (isMounted) {
          setTaskLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, [id, token]);

  const handleDeleteTask = async (taskId: string) => {
    if (!id || !token) {
      setError('Authentication required');
      return;
    }

    try {
      await deleteTask(id, taskId, token);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setError(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/home" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
            Retour aux Projets
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/home" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
            Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        <Link to="/home" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Projects
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{project.name}</h1>
          <p className="text-gray-700 mb-6">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-800">Start Date</p>
                <p className="text-gray-600">{new Date(project.startDate).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-800">End Date</p>
                <p className="text-gray-600">{new Date(project.endDate).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Project Tasks</h2>
            <button
              onClick={handleOpenModal}
              className="mt-3 md:mt-0 inline-flex items-center px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Task
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Total Tasks</h3>
              <p className="text-3xl font-bold text-blue-600">{tasks.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">In Progress</h3>
              <p className="text-3xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'in progress').length}</p>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl w-full max-w-md z-60 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {isEditing ? 'Edit Task' : 'New Task'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">Task Name</label>
                    <input
                      id="taskName"
                      type="text"
                      placeholder="Enter task name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="taskDescription"
                      placeholder="Enter task description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="taskStartDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        id="taskStartDate"
                        type="datetime-local"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="taskEndDate" className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        id="taskEndDate"
                        type="datetime-local"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        id="taskStatus"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700">Priority</label>
                      <select
                        id="taskPriority"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setEditingTask(null); handleCloseModal(); }}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      {isEditing ? 'Update Task' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Task Schedule</h2>

          {Object.keys(tasksByDate).length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Tasks Scheduled</h3>
              <p className="text-gray-600 mb-6">Add tasks to your project to see them in the schedule</p>
              <button
                onClick={handleOpenModal}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add First Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(tasksByDate).map(([day, dayTasks]) => (
                <div key={day} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4">
                    <h3 className="text-lg font-medium">
                      {new Date(day).toLocaleDateString(undefined, {
                        weekday: 'long', month: 'long', day: 'numeric'
                      })}
                    </h3>
                    <p className="text-sm text-blue-100">
                      {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {dayTasks.filter(task => task && task.id).map(task => {
                      try {
                        const s = task.startDate ? new Date(task.startDate) : new Date();
                        const e = task.endDate ? new Date(task.endDate) : new Date();
                        
                        // Vérifier que les dates sont valides
                        if (isNaN(s.getTime()) || isNaN(e.getTime())) {
                          console.warn('Task with invalid date skipped:', task);
                          return null;
                        }
                        
                        const startTime = s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const endTime = e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const isOverdue = e < now && task.status !== 'completed';
                        const isInProgress = s <= now && now <= e;
                        
                        let statusBadge = 'bg-blue-100 text-blue-800';
                        if (task.status === 'completed') statusBadge = 'bg-green-100 text-green-800';
                        else if (task.status === 'pending') statusBadge = 'bg-yellow-100 text-yellow-800';
                        else if (!task.status) statusBadge = 'bg-gray-100 text-gray-800';
                        
                        let priorityBadge = 'bg-gray-100 text-gray-800';
                        if (task.priority === 'high') priorityBadge = 'bg-red-100 text-red-800';
                        else if (task.priority === 'medium') priorityBadge = 'bg-yellow-100 text-yellow-800';
                        else if (task.priority === 'low') priorityBadge = 'bg-green-100 text-green-800';
                        
                        return (
                          <div key={task.id} className="p-5 relative hover:bg-gray-50 transition">
                            <div className="absolute top-3 right-3 flex space-x-2 z-10">
                              <button
                                onClick={() => openEditModal(task)}
                                className="p-1 text-blue-600 hover:text-blue-800 transition rounded-full hover:bg-blue-50"
                                title="Edit task"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1 text-red-600 hover:text-red-800 transition rounded-full hover:bg-red-50"
                                title="Delete task"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            
                            <h4 className="font-semibold text-gray-800 text-lg mb-1 pr-16">{task.name}</h4>
                            
                            <div className="flex items-center text-sm text-gray-600 mb-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {startTime} - {endTime}
                            </div>
                            
                            <p className="text-gray-700 mb-3 text-sm">{task.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge}`}>
                                {task.status && typeof task.status === 'string' 
                                  ? task.status.charAt(0).toUpperCase() + task.status.slice(1) 
                                  : 'No Status'}
                              </span>
                              
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityBadge}`}>
                                {task.priority && typeof task.priority === 'string'
                                  ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) + ' Priority'
                                  : 'No Priority'}
                              </span>
                              
                              {isInProgress && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  In Progress
                                </span>
                              )}
                              
                              {isOverdue && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Overdue
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      } catch (err) {
                        console.error('Error rendering task:', err, task);
                        return null; // Skip rendering this task if there's an error
                      }
                    }).filter(Boolean)} {/* Remove nulls from the map */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
