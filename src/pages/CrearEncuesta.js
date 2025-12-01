import { useState } from 'react';
import { client } from '../backend/client';
import { useNavigate } from 'react-router-dom';

function CrearEncuesta() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ id: Date.now(), texto: '' }]);

    const addQuestion = () => setQuestions([...questions, { id: Date.now(), texto: '' }]);
    const removeQuestion = (id) => setQuestions(questions.filter(q => q.id !== id));

    const handleQuestionChange = (id, text) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, texto: text } : q));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return alert("Falta el título");

        try {
            const { data, error } = await client
                .from('encuestas')
                .insert([{ nombre: title, preguntas: questions }])
                .select();

            if (error) throw error;

            const newId = data[0].id;
            // Redirigimos a la ruta en español
            navigate(`/admin/generar?id=${newId}`);

        } catch (error) {
            console.error(error);
            alert("Error al guardar");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: 20 }}>
            <h1>Crear Encuesta</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                    <label>Título:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 8 }} required />
                </div>
                {questions.map((q, index) => (
                    <div key={q.id} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                        <span>{index + 1}.</span>
                        <input type="text" value={q.texto} onChange={(e) => handleQuestionChange(q.id, e.target.value)} style={{ flex: 1, padding: 8 }} required />
                        <button type="button" onClick={() => removeQuestion(q.id)} style={{ color: 'red' }}>X</button>
                    </div>
                ))}
                <button type="button" onClick={addQuestion} style={{ marginRight: 10 }}>+ Pregunta</button>
                <button type="submit" style={{ background: 'green', color: 'white' }}>Guardar</button>
            </form>
        </div>
    );
}

export default CrearEncuesta;