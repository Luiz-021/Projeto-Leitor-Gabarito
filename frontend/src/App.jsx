import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import InputView from "./pages/InputView/InputView.jsx";
import EditReadView from "./pages/EditReadView/EditReadView.jsx";
import ReadView from "./pages/ReadView/ReadView.jsx";
import StudentDetailView from "./pages/StudentDetailView/StudentDetailView.jsx";
import StudentsView from "./pages/StudentsView/StudentsView.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<InputView />} />
{/*                 
                <Route path="/leitura" element={<ReadView />} />
                <Route path="/leitura/editar" element={<EditReadView />} />
                <Route path="/estudantes" element={<StudentsView />} />
                <Route path="/estudantes/:id" element={<StudentDetailView />} /> */}
                
            </Routes>
        </Router>
    );
}

export default App;