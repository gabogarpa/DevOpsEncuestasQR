import { useState } from "react";
import { client } from '../backend/client';

function Login() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // CAMBIO AQUÍ: Usamos signInWithOtp en lugar de signIn
            const { data, error } = await client.auth.signInWithOtp({
                email: email,
                options: {
                    // Redirige al usuario al mismo sitio después de hacer clic en el correo
                    emailRedirectTo: window.location.origin, 
                }
            });

            if (error) {
                console.error("Error al enviar el magic link:", error.message);
            } else {
                console.log("Magic link enviado, revisa tu correo:", data);
                alert("¡Enlace enviado! Revisa tu correo.");
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email"
                    placeholder="youremailsite.com"
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <button type="submit">
                    Send
                </button>
            </form>
        </div>
    )
}

export default Login;