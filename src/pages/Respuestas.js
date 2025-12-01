import { useEffect, useState } from 'react';
import { client } from '../backend/client';

function Respuestas() {
    const [surveys, setSurveys] = useState([]);
    const [selectedSurveyId, setSelectedSurveyId] = useState("");
    const [surveyData, setSurveyData] = useState(null); // Datos de la encuesta (preguntas)
    const [responses, setResponses] = useState([]); // Datos de las respuestas (usuarios)
    const [loading, setLoading] = useState(false);

    // 1. Cargar lista de encuestas al inicio
    useEffect(() => {
        const fetchSurveys = async () => {
            const { data } = await client.from('encuestas').select('id, nombre');
            if (data) setSurveys(data);
        };
        fetchSurveys();
    }, []);

    // 2. Cargar respuestas cuando se selecciona una encuesta
    useEffect(() => {
        if (!selectedSurveyId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // A. Obtenemos la definición de la encuesta (para saber los títulos de las columnas)
                const surveyReq = await client
                    .from('encuestas')
                    .select('*')
                    .eq('id', selectedSurveyId)
                    .single();

                // B. Obtenemos todas las respuestas de esa encuesta
                const responsesReq = await client
                    .from('respuestas')
                    .select('*')
                    .eq('encuesta_id', selectedSurveyId)
                    .order('fecha', { ascending: false });

                if (surveyReq.data) setSurveyData(surveyReq.data);
                if (responsesReq.data) setResponses(responsesReq.data);

            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSurveyId]);

    // Función auxiliar para formatear fecha
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
            <h1>Resultados de Encuestas</h1>

            {/* Selector de Encuesta */}
            <select
                value={selectedSurveyId}
                onChange={(e) => setSelectedSurveyId(e.target.value)}
                style={{ padding: 10, fontSize: 16, width: '100%', marginBottom: 20 }}
            >
                <option value="">-- Selecciona una encuesta para ver resultados --</option>
                {surveys.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
            </select>

            {loading && <p>Cargando datos...</p>}

            {/* Tabla de Resultados */}
            {!loading && surveyData && responses.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                        <thead>
                            <tr style={{ background: '#f4f4f4' }}>
                                <th style={{ padding: 10, border: '1px solid #ddd' }}>Fecha</th>
                                {/* Generamos columnas dinámicas basadas en las preguntas */}
                                {surveyData.preguntas.map((q, index) => (
                                    <th key={index} style={{ padding: 10, border: '1px solid #ddd' }}>
                                        {q.texto}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map((row) => (
                                <tr key={row.id}>
                                    <td style={{ padding: 10, border: '1px solid #ddd' }}>
                                        {formatDate(row.fecha)}
                                    </td>

                                    {/* Mapeamos las respuestas coincidiendo con el ID o índice de la pregunta */}
                                    {surveyData.preguntas.map((q, index) => {
                                        // Buscamos la respuesta usando el ID de la pregunta (o el índice como fallback)
                                        const answerKey = q.id || index;
                                        const answerValue = row.respuesta[answerKey] || "-";

                                        return (
                                            <td key={index} style={{ padding: 10, border: '1px solid #ddd' }}>
                                                {answerValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && selectedSurveyId && responses.length === 0 && (
                <p>Aún no hay respuestas para esta encuesta.</p>
            )}
        </div>
    );
}

export default Respuestas;