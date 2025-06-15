import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getParticipantes } from '../../api/leitorApi'; 
import "./StudentsView.css";

export default function StudentsView() {
    const navigate = useNavigate();

    const [participantes, setParticipantes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchParticipantes = async () => {
            setIsLoading(true);
            setStatusMessage('Carregando lista de estudantes...');
            try {
                const data = await getParticipantes();
                setParticipantes(data);
                setStatusMessage('');
            } catch (error) {
                console.error("Erro ao carregar participantes:", error);
                setStatusMessage(`Erro: ${error.message || 'Falha ao carregar estudantes.'}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchParticipantes();
    }, []);

    const handleViewDetails = (id) => {
        navigate(`/estudante/${id}`);
    };

    return (
        <div className="students-container">
            <header className="students-header">
                <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                <h2 className="header-title">Leitor de gabaritos da OCI</h2>
                <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
            </header>

            <main className="students-main-content">
                <h1 style={{ textAlign: 'center' }}>Lista de Estudantes Cadastrados 🧑‍🎓</h1>

                {isLoading && <p style={{ textAlign: 'center', color: '#007bff' }}>{statusMessage}</p>}
                {statusMessage && statusMessage.includes('Erro') && (
                    <p style={{ textAlign: 'center', color: 'red' }}>{statusMessage}</p>
                )}

                {!isLoading && participantes.length === 0 && !statusMessage.includes('Erro') && (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>Nenhum estudante encontrado.</p>
                )}

                {!isLoading && participantes.length > 0 && (
                    <div className="students-list">
                        {participantes.map(participante => (
                            <div key={participante.id} className="student-card">
                                <h3>{participante.nome || `Estudante ID: ${participante.id}`}</h3>
                                <p><strong>Email:</strong> {participante.email || 'N/A'}</p>
                                <p><strong>Data de Criação:</strong> {participante.data_criacao ? new Date(participante.data_criacao).toLocaleDateString() : 'N/A'}</p>
                                <button
                                    onClick={() => handleViewDetails(participante.id)}
                                    className="view-details-button"
                                >
                                    Ver Detalhes
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button
                        onClick={() => navigate('/')} 
                        className="back-to-home-button"
                        style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Voltar
                    </button>
                </div>
            </main>
        </div>
    );
}