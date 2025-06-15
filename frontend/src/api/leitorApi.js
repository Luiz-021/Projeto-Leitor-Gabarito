const API_BASE_URL = 'http://localhost:8000/api';

async function handleResponse(response) {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: `Erro HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.detail || 'Ocorreu um erro desconhecido na API.');
    }
   
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('arquivo', file);

  const response = await fetch(`${API_BASE_URL}/upload/leitura/upload/`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(response);
};

export const confirmReading = async (data) => {
    const response = await fetch(`${API_BASE_URL}/upload/leitura/confirmar/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const getSavedReadings = async () => {
    const response = await fetch(`${API_BASE_URL}/upload/leituras/`, {
        method: 'GET',
    });
    return handleResponse(response);
};

export const getReadingById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/upload/leituras/${id}/`, {
        method: 'GET',
    });
    return handleResponse(response);
};

export const updateReading = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/upload/leituras/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const deleteReading = async (id) => {
    const response = await fetch(`${API_BASE_URL}/upload/leituras/${id}/`, {
        method: 'DELETE',
    });

    return handleResponse(response); 
};

export const getProvas = async () => {
    const response = await fetch(`${API_BASE_URL}/provas/`, { method: 'GET' });
    return handleResponse(response);
};

export const getParticipantes = async () => {
    const response = await fetch(`${API_BASE_URL}/participantes/`, { method: 'GET' });
    return handleResponse(response);
};

export const getParticipanteById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/participantes/${id}/`, { method: 'GET' });
    return handleResponse(response);
};

export const getReadingsByParticipantId = async (participanteId) => {
  const response = await fetch(
    `${API_BASE_URL}/upload/leituras/report/?externo_participante_id=${participanteId}`,
    { method: 'GET' }
  );
  return handleResponse(response);
};