import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-100 p-4 flex gap-4">
      <Link to="/" className="font-bold">Inicio</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;
