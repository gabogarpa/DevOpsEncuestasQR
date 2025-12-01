import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useSearchParams } from 'react-router-dom';
import { client } from '../backend/client'; // Importamos Supabase para buscar la lista

function GenerarQR() {
    const [surveys, setSurveys] = useState([]); // Lista de encuestas disponibles
    const [selectedId, setSelectedId] = useState(""); // La encuesta seleccionada actualmente
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    // 1. Cargar la lista de encuestas al iniciar
    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                // Pedimos ID y Nombre, ordenados por los más recientes primero
                // Asegúrate de que tu tabla tenga columna 'created_at' o quita el .order()
                const { data, error } = await client
                    .from('encuestas')
                    .select('id, nombre')

                if (error) throw error;

                setSurveys(data);

                // Si venimos redirigidos de "Crear Encuesta", seleccionamos esa automáticamente
                const paramId = searchParams.get('id');
                if (paramId) {
                    setSelectedId(paramId);
                } else if (data.length > 0) {
                    // Opcional: Seleccionar la primera por defecto si no hay parámetro
                    // setSelectedId(data[0].id);
                }

            } catch (error) {
                console.error("Error cargando lista:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSurveys();
    }, [searchParams]);

    // DOMINIO DE PRODUCCIÓN (Asegúrate de que este sea tu dominio real de Vercel)
    const DOMINIO_PRODUCCION = 'https://dev-ops-encuestas-qr.vercel.app';
    const surveyUrl = `${DOMINIO_PRODUCCION}/encuesta/${selectedId}`;

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', textAlign: 'center' }}>
            <h2>Generar QR</h2>
            <p>Selecciona una encuesta para generar su código QR:</p>

            {loading ? (
                <p>Cargando lista de encuestas...</p>
            ) : (
                <div style={{ marginBottom: '20px' }}>
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        style={{
                            padding: '10px',
                            width: '100%',
                            fontSize: '16px',
                            borderRadius: '5px',
                            border: '1px solid #ccc'
                        }}
                    >
                        <option value="">-- Selecciona una encuesta --</option>
                        {surveys.map((survey) => (
                            <option key={survey.id} value={survey.id}>
                                {survey.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Solo mostramos el QR si hay una encuesta seleccionada */}
            {selectedId && (
                <div style={{
                    marginTop: 30,
                    border: '1px solid #ddd',
                    padding: 30,
                    borderRadius: 10,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    display: 'inline-block'
                }}>
                    {/* Título de la encuesta seleccionada arriba del QR */}
                    <h3 style={{ margin: '0 0 15px 0' }}>
                        {surveys.find(s => s.id === selectedId)?.nombre}
                    </h3>

                    <QRCodeCanvas value={surveyUrl} size={200} />

                    <p style={{ marginTop: 15, fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                        {surveyUrl}
                    </p>

                    <button
                        onClick={() => window.print()}
                        style={{
                            marginTop: 10,
                            cursor: 'pointer',
                            padding: '10px 20px',
                            background: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px'
                        }}
                    >
                        Imprimir QR
                    </button>
                </div>
            )}
        </div>
    );
}

export default GenerarQR;