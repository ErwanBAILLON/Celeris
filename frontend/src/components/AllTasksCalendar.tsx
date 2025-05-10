import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';

interface AllTasksCalendarProps {
  token: string;
}

const AllTasksCalendar: React.FC<AllTasksCalendarProps> = ({ token }) => {
  const { projects, isHydrated: projHydrated } = useProjectStore();
  const { tasks } = useTaskStore();
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    if (!projHydrated) return;
    (async () => {
      try {
        const tasksArrays = tasks;
        const allTasks = tasksArrays.flat().filter(task => task !== undefined);
        setEvents(
          allTasks.map(task => ({
            id: task?.id,
            title: task?.name,
            start: task?.startDate,
            end: task?.endDate,
          }))
        );
      } catch (error) {
        console.error('Erreur chargement de toutes les tâches :', error);
      }
    })();
  }, [projHydrated, projects, token]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      events={events}
      height="100vh"
    />
  );
}

export default AllTasksCalendar;
