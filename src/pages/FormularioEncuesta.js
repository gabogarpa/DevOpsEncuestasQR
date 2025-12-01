import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../backend/client";

function FormularioEncuesta() {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchSurvey = async () => {
            const { data } = await client.from('encuestas').select('*').eq('id', id).single();
            if (data) setSurvey(data);
        };
        if (id) fetchSurvey();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await client.from('respuestas').insert([{ encuesta_id: id, respuesta: answers }]);
        if (!error) setSubmitted(true);
    };

    if (submitted) return <div style={{ padding: 20, textAlign: 'center' }}><h1>¡Gracias! ✅</h1></div>;
    if (!survey) return <div style={{ padding: 20 }}>Cargando encuesta...</div>;

    const questionsList = Array.isArray(survey.preguntas) ? survey.preguntas : [];

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: 20 }}>
            <h1>{survey.nombre}</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                {questionsList.map((q, index) => (
                    <div key={q.id || index} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 8 }}>
                        <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{q.texto}</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: 8 }}
                            onChange={(e) => setAnswers({ ...answers, [q.id || index]: e.target.value })}
                            required
                        />
                    </div>
                ))}
                <button type="submit" style={{ padding: 10, background: '#007bff', color: 'white', border: 'none' }}>Enviar</button>
            </form>
        </div>
    );
}

export default FormularioEncuesta;