import authPaths from './auth';
import projectPaths from './project';
import reminderPaths from './reminder';

export default {
  ...authPaths,
  ...projectPaths,
  ...reminderPaths
};