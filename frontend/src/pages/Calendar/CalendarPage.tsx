import React from 'react';
import AllTasksCalendar from '../../components/AllTasksCalendar';

interface CalendarPageProps {
  token: string;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ token }) => {
  return (
    <div className="h-screen w-full">
      <AllTasksCalendar token={token} />
    </div>
  );
}

export default CalendarPage;
