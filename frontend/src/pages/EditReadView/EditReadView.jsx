import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReadingById, updateReading } from '../../api/leitorApi'; 
import "./EditReadView.css";

export default function EditReadView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        aluno: '',
        escola: '',
        modalidade: '',
        fase: '',
        data: '',
        inscricao: '',
        gabarito: Array(20).fill('')
    });
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchReadingData = async () => {
            setIsLoading(true);
            setErrorMessage('');
            try {
                const data = await getReadingById(id); 
                setFormData({
                    aluno: data.participante_details?.nome || 'N/A',
                    escola: data.escola_details?.nome || 'N/A', 
                    modalidade: data.prova_details?.modalidade || 'N/A', 
                    fase: data.prova_details?.fase || 'N/A',
                    data: data.data_leitura ? new Date(data.data_leitura).toLocaleDateString('pt-BR') : 'N/A',
                    inscricao: data.participante_details?.id || 'N/A', 
                    gabarito: data.leitura_respostas ? data.leitura_respostas.split('') : Array(20).fill('') 
                });
            } catch (error) {
                console.error("Erro ao carregar dados da leitura:", error);
                setErrorMessage(`Erro ao carregar dados: ${error.message || 'Verifique sua conexão.'}`);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchReadingData();
        } else {
           
            setIsLoading(false);
            setErrorMessage('ID da leitura não fornecido para edição.');
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleGabaritoChange = (e, index) => {
        const newValue = e.target.value;
        setFormData((prevData) => {
            const newGabarito = [...prevData.gabarito];
            newGabarito[index] = newValue.toUpperCase().trim(); 
            return {
                ...prevData,
                gabarito: newGabarito,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            
            const dataToUpdate = {
               
                leitura_respostas: formData.gabarito.join('')
    
            };

            await updateReading(id, dataToUpdate); // Chama a função de atualização na API
            setSuccessMessage("Leitura atualizada com sucesso!");
            // Opcional: navegar para a página de detalhes da leitura após a edição
            navigate(`/leitura/${id}`, { replace: true });
        } catch (error) {
            console.error("Erro ao atualizar leitura:", error);
            setErrorMessage(`Erro ao salvar: ${error.message || 'Falha na comunicação com o servidor.'}`);
        } finally {
            setIsLoading(false);
        }
    };


    if (isLoading && !formData.aluno) {
        return (
            <div className="read-container">
                <header className="read-header">
                    <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                    <h2 className="header-title">Leitor de gabaritos da OCI</h2>
                    <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
                </header>
                <main className="main-content" style={{textAlign: 'center', marginTop: '50px'}}>
                    <p>Carregando dados da leitura...</p>
                </main>
            </div>
        );
    }

    if (errorMessage && !formData.aluno) { 
        return (
            <div className="read-container">
                <header className="read-header">
                    <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                    <h2 className="header-title">Leitor de gabaritos da OCI</h2>
                    <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
                </header>
                <main className="main-content" style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>
                    <p>{errorMessage}</p>
                    <button className="back-button" onClick={() => navigate(-1)} style={{marginTop: '20px'}}>Voltar</button>
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
            <main className="main-content">
                <div className="form-section">
                    <h1 style={{ textAlign: 'left' }}>Edição da leitura ✍️</h1>
                    <form id="editForm" onSubmit={handleSubmit} style={{ flexDirection: 'column', gap: '10px' }}> {/* Adicionado id e flex-direction */}
                        <label>Nome do aluno: <input name="aluno" type="text" style={{ width: '250px', borderRadius: '10px' }} value={formData.aluno} onChange={handleChange} readOnly={true} /></label>
                        <label>Nome da escola: <input name="escola" type="text" style={{ width: '250px', borderRadius: '10px' }} value={formData.escola} onChange={handleChange} readOnly={true} /></label>
                        <label>Modalidade: <input name="modalidade" type="text" style={{ width: '250px', borderRadius: '10px' }} value={formData.modalidade} onChange={handleChange} readOnly={true} /></label>
                        <label>Fase: <input name="fase" type="text" style={{ width: '250px', borderRadius: '10px' }} value={formData.fase} onChange={handleChange} readOnly={true} /></label>
                        <label>Data: <input name="data" type="text" style={{ width: '250px', borderRadius: '10px' }} value={formData.data} onChange={handleChange} readOnly={true} /></label>
                        <label>Inscrição: <input name="inscricao" type="text" style={{ width: '250px', borderRadius: '10px' }} value={formData.inscricao} onChange={handleChange} readOnly={true} /></label>
                    
                        {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
                        {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
                    </form>
                    <div>
                        <button className="edita-button" type="submit" form="editForm" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Confirmar edição'}
                        </button>
                        <button className="back-button" onClick={() => navigate(`/leitura/${id}`)} disabled={isLoading} style={{ marginLeft: '10px' }}>
                            Cancelar
                        </button>
                    </div>
                </div>
                <div style={{ width: "2px", background: "black" }} />
                <div className="gabarito-section" style={{ width: '250px' }}>
                    <h3 style={{ textAlign: "left" }}>Gabarito:</h3>
                    <table style={{ width: '100%' }}>
                        <tbody>
                            {Array.from({ length: 10 }, (_, i) => (
                                <tr key={i}>
                                    <td style={{ width: '25%' }}>{String(i + 1).padStart(2, '0')}</td>
                                    <td style={{ width: '25%' }}><input style={{ width: '30px' }} type="text" value={formData.gabarito[i]} onChange={(e) => handleGabaritoChange(e, i)} maxLength="1" /></td>
                                    <td style={{ width: '25%' }}>{String(i + 11).padStart(2, '0')}</td>
                                    <td style={{ width: '25%' }}><input style={{ width: '30px' }} type="text" value={formData.gabarito[i + 10]} onChange={(e) => handleGabaritoChange(e, i + 10)} maxLength="1" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="legenda" style={{ width: '120px', textAlign: 'left' }}>
                    <p>0: questão em branco</p>
                    <p>X: questão com mais de uma opção marcada</p>
                </div>
            </main>
        </div>
    );
}