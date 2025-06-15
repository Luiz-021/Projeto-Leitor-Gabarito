import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentsView.css";

export default function StudentsView() {

    const navigate = useNavigate();
    const handleNovaLeitura = () => {
        navigate("/");
    };

    const handleVerEstudante = (id) => {
        navigate(`/estudantes/id:${id}`);
    };

    return (
        <div className="students-container">

            <header className="read-header">

                <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader" />

                <h2 className="header-title">Leitor de gabaritos da OCI</h2>

                <img src="/oci.png" alt="Logo da OCI" className="logo-oci" />

            </header>

            <main className="students-main">

                <h1 className="students-title">Lista de estudantes 📋</h1>
                
                <div className="students-grid">
                    {[1, 2, 3, 4].map((id) => (
                        <div key={id} className="student-card">

                            <p>Aluno: <input type="text" readOnly value="" /></p>

                            <p>Escola: <input type="text" readOnly value="" /></p>

                            <button onClick={() => handleVerEstudante(id)} className="ver-button">Ver</button>

                        </div>

                    ))}

                </div>

                <button className="nova-leitura-button" onClick={handleNovaLeitura}>Fazer nova leitura</button>

            </main>

        </div>

    );

}