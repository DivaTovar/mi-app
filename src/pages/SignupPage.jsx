import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignUpButton, useUser } from "@clerk/clerk-react"; // 👈 se agregó useUser

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { isSignedIn } = useUser(); // 👈 detectar sesión activa

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Registro con:", email, password);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img
              src="/Logo_IMG.png"
              alt="Logo"
              className="w-20 h-20 mb-2"
            />
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Crear cuenta
        </h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition"
          >
            Crear cuenta
          </button>
        </form>

        <div className="my-6 text-center text-sm text-gray-500">o</div>

        <div className="text-center">
          <SignUpButton mode="modal">
            <button className="w-full py-2 px-4 border border-gray-300 rounded hover:bg-gray-100 transition text-sm">
              Registrarse con Google
            </button>
          </SignUpButton>
        </div>

        <div className="mt-6 text-center text-sm">
          <p>¿Ya tienes cuenta?</p>
          <Link to="/login" className="text-blue-600 hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
