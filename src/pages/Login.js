import { useState, useEffect } from "react";
import { client } from '../backend/client';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

function Login() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // NUEVO: Verificamos si ya hay sesión iniciada
    useEffect(() => {
        // 1. Verificar sesión actual
        client.auth.getSession().then(({ data: { session } }) => {
            if (session) navigate('/menu');
        });

        // 2. Escuchar cambios (cuando el usuario hace clic en el link del correo)
        const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
            if (session) navigate('/menu');
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await client.auth.signInWithOtp({
                email: email,
                options: {
                    // Ahora redirigimos explícitamente a la página principal, 
                    // donde el useEffect lo detectará
                    emailRedirectTo: window.location.origin,
                }
            });
            if (error) console.error(error);
            else alert("¡Enlace enviado! Revisa tu correo.");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: 20, textAlign: 'center' }}>
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tu correo para acceder al sistema</p>
            <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '0 auto' }}>
                <input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: 10, marginBottom: 10 }}
                />
                <button type="submit" style={{ width: '100%', padding: 10, cursor: 'pointer' }}>
                    Enviar Magic Link
                </button>
            </form>
        </div>
    )
}

export default Login;