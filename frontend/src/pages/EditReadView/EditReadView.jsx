import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditReadView.css";

export default function EditReadView() {
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

    const handleChange = (e) => {
        const campo = e.target.name;
        const novoValor = e.target.value;
        setFormData((estadoAnterior) => ({
            ...estadoAnterior,
            [campo]: novoValor
        }));
    };

    const handleGabaritoChange = (e, index) => {
        const novoValor = e.target.value;
        setFormData((estadoAnterior) => {
            const novoGabarito = [...estadoAnterior.gabarito];
            novoGabarito[index] = novoValor;
            return {
                ...estadoAnterior,
                gabarito: novoGabarito,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dados enviados:");
        console.log("Nome do aluno:", formData.aluno);
        console.log("Nome da escola:", formData.escola);
        console.log("Modalidade:", formData.modalidade);
        console.log("Fase:", formData.fase);
        console.log("Data:", formData.data);
        console.log("Inscrição:", formData.inscricao);
        console.log("Gabarito:", formData.gabarito);
    };

    return (
        <div className="read-container">
            <header className="read-header">
                <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                <h2 className="header-title">Leitor de gabaritos da OCI</h2>
                <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
            </header>
            <main className="main-content">
                <div className="form-section">
                    <h1 style={{textAlign:'left'}}>Edição da leitura ✍️</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Nome do aluno: <input name="aluno" type="text" style={{width:'250px',borderRadius:'10px'}} value={formData.aluno} onChange={handleChange}/></label>
                        <label>Nome da escola: <input name="escola" type="text" style={{width:'250px',borderRadius:'10px'}} value={formData.escola} onChange={handleChange}/></label>
                        <label>Modalidade: <input name="modalidade" type="text" style={{width:'250px',borderRadius:'10px'}} value={formData.modalidade} onChange={handleChange}/></label>
                        <label>Fase: <input name="fase" type="text" style={{width:'250px',borderRadius:'10px'}} value={formData.fase} onChange={handleChange}/></label>
                        <label>Data: <input name="data" type="text" style={{width:'250px',borderRadius:'10px'}} value={formData.data} onChange={handleChange}/></label>
                        <label>Inscrição: <input name="inscricao" type="text" style={{width:'250px',borderRadius:'10px'}} value={formData.inscricao} onChange={handleChange}/></label>
                    </form>
                    <div>
                        <button className="edita-button" type="submit" form="editForm" onClick={handleSubmit}>Confirmar edição</button>
                    </div>
                </div>
                <div style={{ width: "2px", background: "black" }} />
                <div className="gabarito-section" style={{width:'250px'}}>
                    <h3 style={{textAlign: "left"}}>Gabarito:</h3>
                    <table style={{width:'250px'}}>
                        <tbody>
                            {Array.from({ length: 10 }, (_, i) => (
                                <tr key={i}>
                                    <td style={{width: '25%'}}>{String(i + 1).padStart(2, '0')}</td>
                                    <td style={{width: '25%'}}><input style={{width:'30px'}} type="text" value={formData.gabarito[i]} onChange={(e)=>handleGabaritoChange(e,i)}/></td>
                                    <td style={{width: '25%'}}>{String(i + 11).padStart(2, '0')}</td>
                                    <td style={{width: '25%'}}><input style={{width:'30px'}} type="text" value={formData.gabarito[i+10]} onChange={(e)=>handleGabaritoChange(e,i+10)}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="legenda" style={{width:'120px', textAlign:'left'}}>
                    <p>0: questão em branco</p>
                    <p>X: questão com mais de uma opção marcada</p>
                </div>
            </main>
        </div>
    );
}
