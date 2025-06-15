import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDetailView.css";

export default function StudentDetailView() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        aluno: 'nome aluno',
        escola: 'nome escola',
        modalidade: 'modalidade',
        fase: 'fase',
        data: 'data',
        inscricao: 'inscricao',
        acertos: 'acertos',
        nota: 'nota',
        erro: 'erro',
        gabarito: ['R 1','R 2','R 3','R 4','R 5','R 6','R 7','R 8','R 9','R 10','R 11','R 12','R 13','R 14','R 15','R 16','R 17','R 18','R 19','R 20']
    });

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="read-container">
            <header className="read-header">
                <img src="/goreader.png" alt="Logo do GoReader" class="logo-goreader"></img>
                <h2 className="header-title">Leitor de gabaritos da OCI</h2>
                <img src="/oci.png" alt="Logo da OCI" class="logo-oci"></img>
            </header>
            <main className="SDmain-content">
                <div className="SDform-section">
                    <h1>Estudante {'{'}{formData.aluno}{'}'} 🎲</h1>
                    <form>
                        <label>Nome do aluno: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.aluno} readOnly/></label>
                        <label>Nome da escola: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.escola} readOnly/></label>
                        <label>Modalidade: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.modalidade} readOnly/></label>
                        <label>Fase: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.fase} readOnly/></label>
                        <label>Data: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.data} readOnly/></label>
                        <label>Inscrição: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.inscricao} readOnly/></label>
                        <label>Acertos: <input type="text" style={{width:'80px',marginRight:'170px', background: "transparent"}} value={formData.acertos} readOnly/></label>
                        <label>Nota: <input type="text" style={{width:'80px',marginRight:'170px', background: "transparent"}} value={formData.nota} readOnly/></label>
                        <label>Erro: <input type="text" style={{width:'80px',marginRight:'170px', background: "transparent"}} value={formData.erro} readOnly/></label>
                    </form>
                </div>
                <div style={{ width: "2px", background: "black" }} />
                <div className="gabarito-section" style={{width:'100px'}}>
                    <h3 style={{textAlign: "left"}}>Gabarito:</h3>
                    <table style={{width:'250px'}}>
                        <tbody>
                            {Array.from({ length: 10 }, (_, i) => (
                                <tr key={i}>
                                    <td style={{width: '25%'}}>{String(i + 1).padStart(2, '0')}</td>
                                    <td style={{width: '25%'}}><input style={{width:'30px'}} type="text" value={formData.gabarito[i]} readOnly/></td>
                                    <td style={{width: '25%'}}>{String(i + 11).padStart(2, '0')}</td>
                                    <td style={{width: '25%'}}><input style={{width:'30px'}} type="text" value={formData.gabarito[i+10]} readOnly/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="legenda" style={{width:'120px', textAlign:'left'}}>
                    <p>Erros:</p>
                    <p>0: não houve erro</p>
                    <p>1: erro na leitura do código Aztec</p>
                    <p>2: imprecisão ou erro na identificação da área</p>
                    <p>3: erro fatal durante a leitura</p>
                    <p>-1: não foi possível identificar</p>
                    <p>0: questão em branco</p>
                    <p>X: questão com mais de uma opção marcada</p>
                    <button className="back-button" onClick={handleBack}>Voltar</button>
                </div>
            </main>
        </div>
    );
}
