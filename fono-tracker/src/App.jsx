import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Patients } from './pages/Patients';
import { PatientDetail } from './pages/PatientDetail';

import { Dashboard } from './pages/Dashboard';
import { Calendar } from './pages/Calendar';
import { Settings } from './pages/Settings';
import { Activities } from './pages/Activities';
import { InteractiveActivities } from './pages/InteractiveActivities';



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="activities" element={<Activities />} />
          <Route path="actividades-interactivas" element={<InteractiveActivities />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
