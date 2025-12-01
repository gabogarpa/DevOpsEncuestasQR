import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useNavigate } from 'react-router-dom';

function EscanearQR() {
    const [data, setData] = useState('Escanea un código...');
    const navigate = useNavigate();

    const handleScan = (result) => {
        if (result && result.length > 0) {
            const rawValue = result[0].rawValue;
            setData(rawValue);

            try {
                const url = new URL(rawValue);
                // Validamos la nueva ruta en español
                if (url.pathname.startsWith('/encuesta/')) {
                    navigate(url.pathname);
                } else {
                    window.location.href = rawValue;
                }
            } catch (e) {
                console.log("No es una URL válida");
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h2>Escanear QR</h2>
            <div style={{ marginTop: 20, border: '2px solid #333', borderRadius: 10, overflow: 'hidden' }}>
                <Scanner onScan={handleScan} scanDelay={2000} />
            </div>
            <p style={{ marginTop: 20 }}>{data}</p>
        </div>
    );
}

export default EscanearQR;