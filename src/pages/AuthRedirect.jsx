import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthRedirect() {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      const rol = user?.publicMetadata?.role;
      if (rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isSignedIn, user, navigate]);

  return <div className="p-8 text-center text-gray-500">Redireccionando...</div>;
}

export default AuthRedirect;
