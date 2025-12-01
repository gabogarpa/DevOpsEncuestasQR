import { QRCodeCanvas } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function GenerarQR() {
    const [searchParams] = useSearchParams();
    const [surveyId, setSurveyId] = useState("");

    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) setSurveyId(idFromUrl);
    }, [searchParams]);

    const baseUrl = window.location.origin;
    // CAMBIO IMPORTANTE: Ahora la URL es /encuesta/
    const surveyUrl = `${baseUrl}/encuesta/${surveyId}`;

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Generar QR</h2>
            <input
                type="text"
                placeholder="ID de la encuesta"
                value={surveyId}
                onChange={(e) => setSurveyId(e.target.value)}
                style={{ padding: '10px', width: '300px' }}
            />

            {surveyId && (
                <div style={{ marginTop: 20, border: '1px solid #ccc', padding: 20, display: 'inline-block' }}>
                    <QRCodeCanvas value={surveyUrl} size={256} />
                    <p style={{ marginTop: 10 }}>URL: {surveyUrl}</p>
                </div>
            )}
        </div>
    );
}

export default GenerarQR;