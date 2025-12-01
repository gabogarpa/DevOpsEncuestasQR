import './App.css';
import { Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import MenuPrincipal from './pages/MenuPrincipal'; // Importamos el nuevo archivo
import CrearEncuesta from './pages/CrearEncuesta';
import GenerarQR from './pages/GenerarQR';
import EscanearQR from './pages/EscanearQR';
import FormularioEncuesta from './pages/FormularioEncuesta';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Login es la página predeterminada */}
        <Route path="/" element={<Login />} />

        {/* Una vez logueado, entras aquí */}
        <Route path="/menu" element={<MenuPrincipal />} />

        {/* Resto de rutas */}
        <Route path="/admin/crear" element={<CrearEncuesta />} />
        <Route path="/admin/generar" element={<GenerarQR />} />
        <Route path="/escanear" element={<EscanearQR />} />
        <Route path="/encuesta/:id" element={<FormularioEncuesta />} />
        <Route path="/admin/respuestas" element={<Respuestas />} />
      </Routes>
    </div>
  );
}

export default App;