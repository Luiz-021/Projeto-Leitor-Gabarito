import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReadingById, deleteReading } from '../../api/leitorApi'; 
import { getErrorDescription } from '../../utils/errorMap'; 
import "./ReadView.css";

export default function ReadView() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [leitura, setLeitura] = useState(null); 
    const [isLoading, setIsLoading] = useState(true); 
    const [statusMessage, setStatusMessage] = useState(''); 

    const MEDIA_BASE_URL = 'http://localhost:8000/media/';

    useEffect(() => {
        const fetchLeitura = async () => {
            setIsLoading(true);
            setStatusMessage('Carregando detalhes da leitura...');
            try {
                const data = await getReadingById(id); 
                setLeitura(data); 
                setStatusMessage(''); 
            } catch (error) {
                console.error(`Erro ao carregar leitura ${id}:`, error);
                setStatusMessage(`Erro: ${error.message || 'Leitura não encontrada ou falha na comunicação.'}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeitura();
    }, [id]); r

    const handleEdit = () => {
        navigate(`/leitura/${id}/editar`);
    };

    const handleDelete = async () => {
        if (window.confirm(`Tem certeza que deseja deletar a leitura ID: ${id}? Esta ação não pode ser desfeita.`)) {
            setIsLoading(true);
            setStatusMessage(`Deletando leitura ID ${id}...`);
            try {
                await deleteReading(id);
                setStatusMessage(`Leitura ID ${id} deletada com sucesso! Redirecionando...`);
                setTimeout(() => navigate('/leituras'), 1500);
            } catch (error) {
                console.error(`Erro ao deletar leitura ID ${id}:`, error);
                setStatusMessage(`Erro ao deletar: ${error.message || 'Verifique o console.'}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="read-container">
                <header className="read-header">
                    <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                    <h2 className="header-title">Carregando Detalhes da Leitura...</h2>
                    <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
                </header>
                <main className="main-content" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p>{statusMessage || 'Aguarde...'}</p>
                </main>
            </div>
        );
    }

    if (statusMessage.includes('Erro') && !leitura) {
        return (
            <div className="read-container">
                <header className="read-header">
                    <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                    <h2 className="header-title">Erro ao Carregar Leitura</h2>
                    <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
                </header>
                <main className="main-content" style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
                    <p>{statusMessage}</p>
                    <button className="edite-button" onClick={() => navigate('/leituras')} style={{marginTop: '20px'}}>Voltar para a Lista</button>
                </main>
            </div>
        );
    }

    if (!leitura) {
        return (
            <div className="read-container">
                <header className="read-header">
                    <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                    <h2 className="header-title">Leitura Não Encontrada</h2>
                    <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
                </header>
                <main className="main-content" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p>A leitura com ID "{id}" não foi encontrada.</p>
                    <button className="edite-button" onClick={() => navigate('/leituras')} style={{marginTop: '20px'}}>Voltar para a Lista</button>
                </main>
            </div>
        );
    }

    const formatGabarito = (respostasString) => {
       
        return Array.from(respostasString || '').map(char => {
            if (char === '0') return 'BRANCO';
            if (char === '?') return 'MÚLTIPLA';
            return char.toUpperCase();
        });
    };

    const formattedGabarito = formatGabarito(leitura.leitura_respostas);
    const imageUrl = leitura.caminho_imagem ? `${MEDIA_BASE_URL}${leitura.caminho_imagem}` : null;

    return (
        <div className="read-container">
            <header className="read-header">
                <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                <h2 className="header-title">Leitor de gabaritos da OCI</h2>
                <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
            </header>
            <main className="main-content">
                <div className="form-section" style={{ width: '400px' }}>
                    <h1 style={{ textAlign: 'left' }}>Resultado da leitura 👓</h1>
                    <form>
                        <label>ID da Prova: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.prova_details?.id || 'N/A'} readOnly /></label>
                        <label>Nome da Prova: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.prova_details?.nome || 'N/A'} readOnly /></label>
                        <label>ID do Participante: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.participante_details?.id || 'N/A'} readOnly /></label>
                        <label>Nome do Participante: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.participante_details?.nome || 'N/A'} readOnly /></label>
                        <label>Nota: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.nota !== null ? leitura.nota.toFixed(2) : 'N/A'} readOnly /></label>
                        <label>Acertos: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.acertos || 'N/A'} readOnly /></label>
                        
                        <label>Nº Inscrição: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.numero_inscricao || 'N/A'} readOnly /></label>
                        <label>Nome do Aluno: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.nome_aluno || 'N/A'} readOnly /></label>
                        <label>Escola: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.escola_aluno || 'N/A'} readOnly /></label>
                        <label>Modalidade: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.modalidade || 'N/A'} readOnly /></label>
                        <label>Fase: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.fase || 'N/A'} readOnly /></label>
                        <label>Data: <input type="text" style={{ width: '250px', background: "transparent" }} value={leitura.data ? new Date(leitura.data).toLocaleDateString() : 'N/A'} readOnly /></label>

                        <label>Erro: <input type="text" style={{ width: '35px', marginRight: '215px', background: "transparent" }} value={`${leitura.erro} - ${getErrorDescription(leitura.erro)}`} readOnly /></label>
                    </form>

                    <div className="buttons">
                        <button className="edite-button" onClick={handleEdit}>Editar leitura</button>
                        <button className="confirm-button" onClick={handleDelete} style={{backgroundColor: '#dc3545'}}>Deletar leitura</button>
                        <button className="confirm-button" onClick={() => navigate('/leituras')}>Ver Todas as Leituras</button>
                    </div>
                </div>
                <div style={{ width: "2px", background: "black" }} />
                
                {imageUrl && (
                    <div className="image-section" style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Imagem do Gabarito:</h3>
                        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                            <img
                                src={imageUrl}
                                alt="Gabarito Escaneado"
                                style={{ maxWidth: '100%', maxHeight: '400px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </a>
                    </div>
                )}

                <div className="gabarito-section" style={{ width: '100px' }}>
                    <h3 style={{ textAlign: "left" }}>Gabarito:</h3>
                    <table style={{ width: '250px' }}>
                        <tbody>
                            {Array.from({ length: Math.ceil(formattedGabarito.length / 2) }, (_, i) => (
                                <tr key={i}>
                                    <td style={{ width: '25%' }}>{String(i + 1).padStart(2, '0')}</td>
                                    <td style={{ width: '25%' }}><input style={{ width: '30px' }} type="text" value={formattedGabarito[i] || ''} readOnly /></td>
                                    {formattedGabarito[i + Math.ceil(formattedGabarito.length / 2)] !== undefined && (
                                        <>
                                            <td style={{ width: '25%' }}>{String(i + 1 + Math.ceil(formattedGabarito.length / 2)).padStart(2, '0')}</td>
                                            <td style={{ width: '25%' }}><input style={{ width: '30px' }} type="text" value={formattedGabarito[i + Math.ceil(formattedGabarito.length / 2)] || ''} readOnly /></td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="legenda" style={{ width: '120px', textAlign: 'left' }}>
                    <p>0: questão em branco</p>
                    <p>?: questão com mais de uma opção marcada</p>
                </div>
            </main>
        </div>
    );
}