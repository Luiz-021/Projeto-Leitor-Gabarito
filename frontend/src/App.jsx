import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import InputView from './pages/InputView/InputView.jsx'; 
import ReadView from './pages/ReadView/ReadView.jsx';  
import StudentDetailView from './pages/StudentDetailView/StudentDetailView.jsx';
import StudentsView from './pages/StudentsView/StudentsView.jsx'; 



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InputView />} />
        <Route path="/revisar-gabarito" element={<InputView />} />
        <Route path="/leitura/:id" element={<ReadView />} />
        <Route path="/estudantes" element={<StudentsView />} />
        <Route path="/estudante/:id" element={<StudentDetailView />} />
      </Routes>
    </Router>
  );
}

export default App;