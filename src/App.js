import { useState, useEffect } from 'react';

// 📦 COMPONENTE: Pantalla de carga
function Cargando() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px'
    }}>
      <div style={{
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #2196f3',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'girar 1s linear infinite'
      }} />
      <style>{`
        @keyframes girar {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ marginLeft: '20px', fontSize: '18px', color: '#666' }}>
        Cargando datos...
      </p>
    </div>
  );
}

// 📦 COMPONENTE: Mensaje de error
function MensajeError({ mensaje, onReintentar }) {
  return (
    <div style={{
      padding: '30px',
      backgroundColor: '#ffebee',
      border: '3px solid #f44336',
      borderRadius: '10px',
      margin: '20px 0',
      textAlign: 'center'
    }}>
      <h2 style={{ margin: '0 0 15px 0', color: '#c62828' }}>
        ❌ Ocurrió un Error
      </h2>
      <p style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#666' }}>
        {mensaje}
      </p>
      <button
        onClick={onReintentar}
        style={{
          padding: '12px 30px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        🔄 Intentar de Nuevo
      </button>
    </div>
  );
}

// 📦 COMPONENTE: Tarjeta de cliente
function TarjetaCliente({ cliente }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div 
      style={{
        padding: '20px',
        margin: '15px 0',
        backgroundColor: 'white',
        border: '2px solid #2196f3',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.3s',
        cursor: 'pointer'
      }}
      onClick={() => setExpandido(!expandido)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#1976d2', fontSize: '20px' }}>
          👤 {cliente.name}
        </h3>
        <span style={{ fontSize: '20px' }}>
          {expandido ? '🔼' : '🔽'}
        </span>
      </div>

      <p style={{ margin: '10px 0 0 0', color: '#666' }}>
        📧 {cliente.email}
      </p>

      {expandido && (
        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <p style={{ margin: '8px 0', color: '#666' }}>
            <strong>📱 Teléfono:</strong> {cliente.phone}
          </p>
          <p style={{ margin: '8px 0', color: '#666' }}>
            <strong>🏢 Empresa:</strong> {cliente.company.name}
          </p>
          <p style={{ margin: '8px 0', color: '#666' }}>
            <strong>💼 Slogan:</strong> {cliente.company.catchPhrase}
          </p>
          <p style={{ margin: '8px 0', color: '#666' }}>
            <strong>🌐 Website:</strong> {cliente.website}
          </p>
          <p style={{ margin: '8px 0', color: '#666' }}>
            <strong>📍 Ciudad:</strong> {cliente.address.city}
          </p>
          <p style={{ margin: '8px 0', color: '#666' }}>
            <strong>🏠 Dirección:</strong> {cliente.address.street}, {cliente.address.suite}
          </p>
        </div>
      )}
    </div>
  );
}

// 🏠 COMPONENTE PRINCIPAL
export default function App() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Función para obtener clientes de la API
  async function obtenerClientes() {
    try {
      setCargando(true);
      setError(null);

      // API de prueba (funciona en Vercel)
      const respuesta = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: No se pudieron cargar los datos`);
      }

      const datos = await respuesta.json();
      
      if (!datos || datos.length === 0) {
        throw new Error('No se recibieron datos de la API');
      }
      
      setClientes(datos);

    } catch (err) {
      console.error('Error detallado:', err);
      setError(`Error al conectar con la API: ${err.message}`);
    } finally {
      setCargando(false);
    }
  }

  // Cargar datos cuando la app inicia
  useEffect(() => {
    obtenerClientes();
  }, []);

  // Filtrar clientes según la búsqueda
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.company.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* ENCABEZADO */}
      <div style={{
        textAlign: 'center',
        padding: '30px',
        backgroundColor: '#1976d2',
        color: 'white',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '36px' }}>
          🏢 Sistema de Gestión de Clientes
        </h1>
        <p style={{ margin: 0, fontSize: '18px', opacity: 0.9 }}>
          Proyecto React desplegado en Vercel
        </p>
      </div>

      {/* ESTADÍSTICAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '25px',
          backgroundColor: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '40px', color: '#4caf50' }}>
            {clientes.length}
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
            Total de Clientes
          </p>
        </div>

        <div style={{
          padding: '25px',
          backgroundColor: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '40px', color: '#2196f3' }}>
            {clientesFiltrados.length}
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
            Mostrando
          </p>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <label style={{
          display: 'block',
          marginBottom: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          🔍 Buscar Cliente:
        </label>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Escribe nombre, email o empresa..."
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            border: '2px solid #2196f3',
            borderRadius: '8px',
            outline: 'none'
          }}
        />
      </div>

      {/* ESTADOS: Cargando / Error / Datos */}
      {cargando && <Cargando />}

      {error && (
        <MensajeError
          mensaje={error}
          onReintentar={obtenerClientes}
        />
      )}

      {!cargando && !error && (
        <div>
          {clientesFiltrados.length === 0 ? (
            <div style={{
              padding: '60px',
              backgroundColor: 'white',
              borderRadius: '10px',
              textAlign: 'center',
              color: '#999'
            }}>
              <h2 style={{ fontSize: '24px' }}>😕 No se encontraron clientes</h2>
              <p style={{ fontSize: '16px' }}>
                {busqueda ? 'Intenta con otra búsqueda' : 'No hay clientes registrados'}
              </p>
            </div>
          ) : (
            <div>
              <h2 style={{ color: '#333', marginBottom: '20px' }}>
                📋 Lista de Clientes ({clientesFiltrados.length})
              </h2>
              {clientesFiltrados.map(cliente => (
                <TarjetaCliente key={cliente.id} cliente={cliente} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}