import authParameters from './auth';
import projectParameters from './project';
import reminderParameters from './reminder';

export default {
  ...authParameters,
  ...projectParameters,
  ...reminderParameters
};