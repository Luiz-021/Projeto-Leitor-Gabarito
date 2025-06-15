import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getParticipanteById, getReadingsByParticipantId } from '../../api/leitorApi'; 
import { getErrorDescription } from '../../utils/errorMap'; 
import "./StudentDetailView.css";

export default function StudentDetailView() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [participante, setParticipante] = useState(null);
    const [leiturasDoParticipante, setLeiturasDoParticipante] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setStatusMessage('Carregando detalhes do estudante...');
            try {
                const participanteData = await getParticipanteById(id);
                setParticipante(participanteData);

                const leiturasData = await getReadingsByParticipantId(id);
                setLeiturasDoParticipante(leiturasData);
                setStatusMessage('');
            } catch (error) {
                console.error(`Erro ao carregar estudante ${id}:`, error);
                setStatusMessage(`Erro: ${error.message || 'Estudante não encontrado ou falha na comunicação.'}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBack = () => {
        navigate('/estudantes'); 
    };

    if (isLoading) {
        return (
            <div className="read-container">
                <header className="read-header">
                    <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                    <h2 className="header-title">Carregando Detalhes do Estudante...</h2>
                    <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
                </header>
                <main className="SDmain-content" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p>{statusMessage || 'Aguarde...'}</p>
                </main>
            </div>
        );
    }

    if (statusMessage.includes('Erro') && !participante) {
        return (
            <div className="read-container">
                <header className="read-header">
                    <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                    <h2 className="header-title">Erro ao Carregar Estudante</h2>
                    <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
                </header>
                <main className="SDmain-content" style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
                    <p>{statusMessage}</p>
                    <button className="back-button" onClick={handleBack} style={{ marginTop: '20px' }}>Voltar para a Lista</button>
                </main>
            </div>
        );
    }

    if (!participante) {
        return (
            <div className="read-container">
                <header className="read-header">
                    <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                    <h2 className="header-title">Estudante Não Encontrado</h2>
                    <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
                </header>
                <main className="SDmain-content" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p>O estudante com ID "{id}" não foi encontrado.</p>
                    <button className="back-button" onClick={handleBack} style={{ marginTop: '20px' }}>Voltar para a Lista</button>
                </main>
            </div>
        );
    }

    return (
        <div className="read-container">
            <header className="read-header">
                <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                <h2 className="header-title">Leitor de gabaritos da OCI</h2>
                <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
            </header>
            <main className="SDmain-content">
                <div className="SDform-section">
                    <h1>Estudante {participante.nome || participante.id} 🎲</h1>
                    <form>
                        <label>ID do Participante: <input type="text" style={{ width: '250px', background: "transparent" }} value={participante.id || 'N/A'} readOnly /></label>
                        <label>Nome do Aluno: <input type="text" style={{ width: '250px', background: "transparent" }} value={participante.nome || 'N/A'} readOnly /></label>
                        <label>Email: <input type="text" style={{ width: '250px', background: "transparent" }} value={participante.email || 'N/A'} readOnly /></label>
                        <label>Data de Criação: <input type="text" style={{ width: '250px', background: "transparent" }} value={participante.data_criacao ? new Date(participante.data_criacao).toLocaleDateString() : 'N/A'} readOnly /></label>
                    </form>
                </div>
                <div style={{ width: "2px", background: "black" }} />
                <div className="SDgabarito-section" style={{ width: '100%' }}> 
                    <h3 style={{ textAlign: "left" }}>Leituras Associadas:</h3>
                    {leiturasDoParticipante.length === 0 ? (
                        <p>Nenhuma leitura encontrada para este estudante.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ background: '#f2f2f2' }}>
                                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ID Leitura</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Prova</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Respostas</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Nota</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Acertos</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Erro</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leiturasDoParticipante.map(leitura => (
                                    <tr key={leitura.id}>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{leitura.id}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{leitura.prova_details?.nome || leitura.prova?.id || 'N/A'}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{leitura.leitura_respostas}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{leitura.nota !== null ? leitura.nota.toFixed(2) : 'N/A'}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{leitura.acertos || 'N/A'}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{leitura.status}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{getErrorDescription(leitura.erro)}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                            <button onClick={() => navigate(`/leitura/${leitura.id}`)} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="legenda" style={{ width: '120px', textAlign: 'left', marginTop: '20px' }}>
                    <p>Erros:</p>
                    <p>0: não houve erro</p>
                    <p>1: erro na leitura do código Aztec</p>
                    <p>2: imprecisão ou erro na identificação da área</p>
                    <p>3: erro fatal durante a leitura</p>
                    <p>-1: não foi possível identificar</p>
                    <p>0: questão em branco</p>
                    <p>?: questão com mais de uma opção marcada</p>
                    <button className="back-button" onClick={handleBack}>Voltar</button>
                </div>
            </main>
        </div>
    );
}