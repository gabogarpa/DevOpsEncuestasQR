import { Link, useNavigate } from 'react-router-dom';
import { client } from '../backend/client'; // Importamos el cliente para poder salir

function MenuPrincipal() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        // 1. Cierra la sesión en Supabase
        await client.auth.signOut();
        // 2. Te manda de vuelta al Login
        navigate('/');
    };

    return (
        <div style={{ padding: 20, textAlign: 'center' }}>

            <p>Bienvenido al sistema de encuestas.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, maxWidth: 300, margin: '20px auto' }}>

                {/* Opción para Usuarios */}
                <Link to="/escanear">
                    <button style={{ padding: 15, width: '100%', fontSize: 16, cursor: 'pointer' }}>
                        📷 Escanear QR
                    </button>
                </Link>

                <hr style={{ width: '100%' }} />

                {/* Opciones para Administradores */}
                <Link to="/admin/crear">
                    <button style={{ padding: 10, width: '100%', cursor: 'pointer' }}>📝 Crear Encuesta Nueva</button>
                </Link>

                <Link to="/admin/generar">
                    <button style={{ padding: 10, width: '100%', cursor: 'pointer' }}> 🖇️ Generar QR</button>
                </Link>
            </div>
            {/* Botón de Salir pequeño arriba a la derecha */}
            <button
                onClick={handleLogout}
                style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Cerrar Sesión
            </button>
        </div>
    );
}

export default MenuPrincipal;