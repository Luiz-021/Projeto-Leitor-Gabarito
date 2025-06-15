import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from '../../api/leitorApi'; 
import "./InputView.css";

export default function InputView() {
    const navigate = useNavigate();

    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFileName(selectedFile.name);
            setFile(selectedFile);
            setUploadStatus(''); 
        } else {
            setFileName("");
            setFile(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setUploadStatus("Por favor, selecione um arquivo primeiro.");
            return;
        }

        setIsLoading(true);
        setUploadStatus('Enviando e processando...');

        try {
            const result = await uploadImage(file);
            setUploadStatus(`Arquivo "${file.name}" processado com sucesso!`);
        
            navigate('/revisar-gabarito', { state: { readData: result } });

        } catch (error) {
            console.error("Erro no upload:", error);
            setUploadStatus(`Erro: ${error.message || 'Falha ao conectar com o servidor.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="input-container">
            <header className="input-header">
                <img src="/goreader.png" alt="Logo do GoReader" className="logo-goreader"></img>
                <h2 className="header-title">Leitor de gabaritos da OCI</h2>
                <img src="/oci.png" alt="Logo da OCI" className="logo-oci"></img>
            </header>

            <div className="input-box">
                <h2 className="input-title">Boas-vindas! 🔎</h2>
                <h2 className="input-text">Para começar a leitura de um gabarito,</h2>

                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept=".png, .jpeg"
                    onChange={handleFileChange}
                    disabled={isLoading} 
                />
                
                <label htmlFor="fileInput" className="uploadButton" style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                    Faça Upload
                </label>

                {fileName && (
                    <p className="input-subtext" id="fileName">{fileName}</p>
                )}

                <h3 className="input-subtext">*O arquivo deve estar em .png ou .jpeg</h3>

                <label className="submitButton" onClick={handleSubmit} style={{ cursor: (!file || isLoading) ? 'not-allowed' : 'pointer' }}>
                    {isLoading ? 'Enviando...' : 'Enviar'} 
                </label>

                {uploadStatus && ( 
                    <p className="input-status-message" style={{ color: uploadStatus.includes('Erro') ? 'red' : 'green', marginTop: '10px' }}>
                        {uploadStatus}
                    </p>
                )}
            </div>
        </div>
    );
}
