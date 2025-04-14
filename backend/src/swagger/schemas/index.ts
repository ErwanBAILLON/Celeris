import authSchemas from './auth';
import projectSchemas from './project';
import reminderSchemas from './reminder';

export default {
  ...authSchemas,
  ...projectSchemas,
  ...reminderSchemas
};