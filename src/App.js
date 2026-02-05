import { useEffect, useState } from "react";

// 🔄 Cargando
function Cargando() {
  return <h2 style={{ textAlign: "center" }}>⏳ Cargando clientes...</h2>;
}

// ❌ Error
function ErrorMensaje({ onRetry }) {
  return (
    <div style={{ textAlign: "center", color: "red" }}>
      <h2>❌ Error</h2>
      <p>No se pudo conectar con la API</p>
      <button onClick={onRetry}>🔄 Reintentar</button>
    </div>
  );
}

// 👤 Tarjeta
function TarjetaCliente({ cliente }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "10px"
    }}>
      <h3>{cliente.name}</h3>
      <p>📧 {cliente.email}</p>
      <p>📱 {cliente.phone}</p>
      <p>🌐 {cliente.website}</p>
      <p>🏢 {cliente.companyName}</p>
      <p>💬 {cliente.catchPhrase}</p>
      <p>📍 {cliente.city}</p>
      <p>🏠 {cliente.street} - {cliente.suite}</p>
    </div>
  );
}

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // 📝 Formulario
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    companyName: "",
    catchPhrase: "",
    city: "",
    street: "",
    suite: ""
  });

  // 🔹 GET clientes
  const cargarClientes = async () => {
    try {
      setCargando(true);
      setError(false);

      const response = await fetch("https://localhost:7055/api/clientes");
      const data = await response.json();

      setClientes(data);
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // ✍️ Inputs
  const manejarCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ➕ POST cliente
  const agregarCliente = async (e) => {
    e.preventDefault();

    try {
      await fetch("https://localhost:7055/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        website: "",
        companyName: "",
        catchPhrase: "",
        city: "",
        street: "",
        suite: ""
      });

      cargarClientes();
    } catch {
      alert("Error al guardar cliente");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>👤 Sistema de Clientes</h1>

      {/* ➕ FORMULARIO */}
      <form
        onSubmit={agregarCliente}
        style={{
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "grid",
          gap: "8px"
        }}
      >
        <h3>➕ Agregar Cliente</h3>

        <input name="name" placeholder="Nombre" value={form.name} onChange={manejarCambio} required />
        <input name="email" placeholder="Email" value={form.email} onChange={manejarCambio} required />
        <input name="phone" placeholder="Teléfono" value={form.phone} onChange={manejarCambio} />
        <input name="website" placeholder="Website" value={form.website} onChange={manejarCambio} />
        <input name="companyName" placeholder="Empresa" value={form.companyName} onChange={manejarCambio} />
        <input name="catchPhrase" placeholder="Slogan" value={form.catchPhrase} onChange={manejarCambio} />
        <input name="city" placeholder="Ciudad" value={form.city} onChange={manejarCambio} />
        <input name="street" placeholder="Calle" value={form.street} onChange={manejarCambio} />
        <input name="suite" placeholder="Suite" value={form.suite} onChange={manejarCambio} />

        <button type="submit">💾 Guardar</button>
      </form>

      {cargando && <Cargando />}
      {error && <ErrorMensaje onRetry={cargarClientes} />}

      {!cargando && !error &&
        clientes.map(c => (
          <TarjetaCliente key={c.id} cliente={c} />
        ))
      }
    </div>
  );
}
