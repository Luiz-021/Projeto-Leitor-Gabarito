import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReadView.css";

export default function ReadView() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        aluno: 'nome aluno',
        escola: 'nome escola',
        modalidade: 'modalidade',
        fase: 'fase',
        data: 'data',
        inscricao: 'inscricao',
        gabarito: ['R 1','R 2','R 3','R 4','R 5','R 6','R 7','R 8','R 9','R 10','R 11','R 12','R 13','R 14','R 15','R 16','R 17','R 18','R 19','R 20']
    });

    const handleEdit = () => {
        navigate('/');
    };

    const handleConfirm = () => {
        console.log("Leitura confirmada:", formData);
        alert("Leitura confirmada com sucesso!");
    };

    const handleDelete = () => {
        if (window.confirm("Tem certeza que deseja excluir esta leitura?")) {
            console.log("Leitura excluída:", formData);
            navigate('/'); 
        }
    };

    return (
        <div className="read-container">
            <header className="read-header">
                <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                <h2 className="header-title">Leitor de gabaritos da OCI</h2>
                <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
            </header>
            <main className="main-content">
                <div className="form-section" style={{width:'400px'}}>
                    <h1>Resultado da leitura 👓</h1>
                    <form>
                        <label>Nome do aluno: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.aluno} readOnly/></label>
                        <label>Nome da escola: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.escola} readOnly/></label>
                        <label>Modalidade: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.modalidade} readOnly/></label>
                        <label>Fase: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.fase} readOnly/></label>
                        <label>Data: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.data} readOnly/></label>
                        <label>Inscrição: <input type="text" style={{width:'250px', background: "transparent"}} value={formData.inscricao} readOnly/></label>
                    </form>
                    
                    <div className="buttons">
                        <button className="edite-button" onClick={handleEdit}>Editar leitura</button>
                        <button className="confirm-button" onClick={handleConfirm}>Confirmar leitura</button>
                        <button className="delete-button" onClick={handleDelete}>Excluir leitura</button>
                    </div>
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
                <div className="legenda" style={{width:'50px'}}>
                    <p>0: questão em branco</p>
                    <p>X: questão com mais de uma opção marcada</p>
                </div>
            </main>
        </div>
    );
}
