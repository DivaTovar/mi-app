import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn, SignInButton, useUser } from "@clerk/clerk-react"; 

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn } = useUser(); // 👈 obtenemos estado de sesión

  // 👇 Redirige si ya hay sesión activa
  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    const newErrors = {};
    if (!email.trim()) newErrors.email = "El correo es obligatorio";
    if (!password.trim()) newErrors.password = "La contraseña es obligatoria";
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    if (!isLoaded) return;

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === "needs_first_factor") {
        await signIn.attemptFirstFactor({ strategy: "password", password });
        navigate("/"); // 👈 Redirección después del login
      }
    } catch (err) {
      console.error("❌ Error Clerk:", err.errors);
      if (err.errors && err.errors.length > 0) {
        setErrorMsg(err.errors[0].message);
      } else {
        setErrorMsg("Error al iniciar sesión. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl px-10 py-12 w-full max-w-md border border-blue-200">
        <div className="flex flex-col items-center mb-6">
          <Link to="/">
            <img src="/Logo_IMG.png" alt="Logo" className="w-20 h-20 mb-2" />
          </Link>
          <h2 className="text-3xl font-extrabold text-blue-700">Iniciar sesión</h2>
        </div>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 text-sm rounded mb-4 text-center border border-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                fieldErrors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                fieldErrors.password
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-500 transition"
          >
            Ingresar
          </button>
        </form>

        <div className="my-6 text-center text-sm text-gray-400">ó</div>

        <div className="text-center">
          <SignInButton mode="modal">
            <button className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition text-sm font-medium">
              Iniciar sesión con Google
            </button>
          </SignInButton>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">¿No tienes cuenta?</p>
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Crear una cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
