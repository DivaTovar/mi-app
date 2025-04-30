import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";

const HomePage = () => {
    const [state, setState] = useState(false)

    const navigation = [
        { title: "Inicio", path: "/" },
        { title: "Vuelos", path: "/vuelos" },
        { title: "Contacto", path: "/contacto" }
    ]

    useEffect(() => {
        const handleClick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) setState(false);
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="relative min-h-screen bg-white font-sans">
            <header className="border-b shadow-sm bg-blue-50">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-4 md:px-8">
                    <a href="/">
                        <img src="/Logo_IMG.png" className="h-12 w-auto object-contain" alt="Aeropuerto logo" />
                    </a>
                    <div className="md:hidden">
                        <button className="menu-btn" onClick={() => setState(!state)}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    <nav className="hidden md:flex gap-6 text-sm">
                        {navigation.map((item, idx) => (
                            <a key={idx} href={item.path} className="text-gray-700 hover:text-blue-600 font-medium">
                                {item.title}
                            </a>
                        ))}
                        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition">Iniciar Sesión</Link>
                    </nav>
                </div>
                {state && (
                    <div className="md:hidden px-4 pb-4">
                        <div className="space-y-2">
                            {navigation.map((item, idx) => (
                                <a key={idx} href={item.path} className="block text-gray-700 hover:text-blue-600">
                                    {item.title}
                                </a>
                            ))}
                            <Link to="/login" className="block mt-2 px-4 py-2 bg-blue-600 text-white rounded-full text-center">Iniciar Sesión</Link>
                        </div>
                    </div>
                )}
            </header>

            <main className="max-w-screen-xl mx-auto px-4 py-20 grid md:grid-cols-2 items-center gap-12">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Reserva tus vuelos fácilmente
                    </h1>
                    <p className="text-gray-700 mb-6">
                        Bienvenido a nuestro sistema de reservas aéreas. Consulta rutas, aerolíneas y vuelos nacionales en tiempo real desde cualquier dispositivo.
                    </p>
                    <Link to="/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-medium text-lg hover:bg-blue-500">
                        Iniciar sesión
                    </Link>
                </div>
                <div className="flex justify-center">
                    <img src="/Logo_IMG.png" alt="Banner" className="rounded-xl shadow-xl object-contain h-60 w-60" />
                </div>
            </main>

            <section className="bg-blue-50 py-20">
                <div className="max-w-screen-xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">¿Por qué elegirnos?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Nuestro sistema facilita la visualización de vuelos disponibles, aerolíneas asociadas y horarios de operación para todos los aeropuertos de Colombia. Optimiza tu viaje con confianza y seguridad.
                        </p>
                    </div>
                    <div>
                        <img src="/aeropuerto.png" alt="Aeropuerto" className="rounded-lg shadow-md object-cover h-72 w-full" />
                    </div>
                </div>
            </section>

            <footer className="bg-gray-100 text-center py-8 text-sm text-gray-600">
                Sistema Aeroportuario Nacional © 2025. Todos los derechos reservados.
            </footer>
        </div>
    )
}

export default HomePage;
