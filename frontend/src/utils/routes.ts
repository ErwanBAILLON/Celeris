export class Routes {
  static readonly BASE_URL = 'https://api.celeris.studio';
  // static readonly BASE_URL = 'http://localhost:3004';

  // USER
  static readonly LOGIN = `${Routes.BASE_URL}/auth/login`;
  static readonly REGISTER = `${Routes.BASE_URL}/auth/register`;
  static readonly LOGOUT = `${Routes.BASE_URL}/auth/logout`;
  static readonly REFRESH = `${Routes.BASE_URL}/auth/refresh`;

  // PROJECTS
  static readonly GET_PROJECTS = `${Routes.BASE_URL}/projects`;
  static readonly GET_PROJECT_BY_ID = (id: string) => `${Routes.GET_PROJECTS}/${id}`;
  static readonly CREATE_PROJECT = `${Routes.BASE_URL}/projects`;
  static readonly UPDATE_PROJECT = (id: string) => `${Routes.GET_PROJECTS}/${id}`;
  static readonly DELETE_PROJECT = (id: string) => `${Routes.GET_PROJECTS}/${id}`;

  // TASKS
  static readonly GET_TASKS = `${Routes.GET_PROJECT_BY_ID}/tasks`;
  static readonly CREATE_TASK = `${Routes.GET_PROJECT_BY_ID}/tasks`;
  static readonly GET_TASK_BY_ID = (taskId: string) => `${Routes.GET_TASKS}/${taskId}`;
  static readonly UPDATE_TASK = (taskId: string) => `${Routes.GET_TASKS}/${taskId}`;
  static readonly DELETE_TASK = (taskId: string) => `${Routes.GET_TASKS}/${taskId}`;

  // REMINDERS
  static readonly GET_REMINDERS = `${Routes.BASE_URL}/reminders`;
  static readonly CREATE_REMINDER = `${Routes.BASE_URL}/reminders`;
  static readonly GET_REMINDER_BY_ID = (reminderId: string) => `${Routes.GET_REMINDERS}/${reminderId}`;
  static readonly UPDATE_REMINDER = (reminderId: string) => `${Routes.GET_REMINDERS}/${reminderId}`;
  static readonly DELETE_REMINDER = (reminderId: string) => `${Routes.GET_REMINDERS}/${reminderId}`;

  // TAGS
  static readonly GET_TAGS = `${Routes.BASE_URL}/tags`;
  static readonly CREATE_TAG = `${Routes.BASE_URL}/tags`;
}