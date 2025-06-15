import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InputView.css";

export default function InputView() {

    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);

        const handleFileChange = (event) => {
            if (event.target.files.length > 0) {
                const selectedFile = event.target.files[0];
                setFileName(selectedFile.name);
                setFile(selectedFile);
            }
        };

        const handleSubmit = () => {
            if (!file) {
                alert("Por favor, selecione um arquivo primeiro.");
            return;
        }

        alert(`Arquivo "${file.name}" enviado com sucesso;`);
        
        };

    return (

    <div className = "input-container">

        <header className = "input-header">
             
            <img src="/goreader.png" alt="Logo do GoReader" class="logo-goreader"></img>

            <h2  className = "header-title">Leitor de gabaritos da OCI</h2>

            <img src="/oci.png" alt="Logo da OCI" class="logo-oci"></img>

        </header>



    <div className = "input-box">

            <h2 className = "input-title">Boas-vindas! 🔎</h2>

            <h2 className = "input-text">Para começar a leitura de um gabarito,</h2>

    <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".png, .jpeg"
            onChange={handleFileChange}

    />
    

            <label htmlFor="fileInput" className="uploadButton">Faça Upload</label>

            {fileName && (
                <p className="input-subtext" id="fileName">{fileName}</p>
            )}

            <h3 className = "input-subtext">*O arquivo deve estar em .png ou .jpeg</h3>

            <label className="submitButton" onClick={handleSubmit}>Enviar</label>
    </div>

</div>

)}