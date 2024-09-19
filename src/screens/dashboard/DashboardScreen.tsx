import { Button } from "@/components/ui/button";
import TituloPagina from "@/components/ui/TituloPagina"
import { Link } from "react-router-dom";

const dashboardOptions = [
  { text: "Ver novedades", color: "blue" },
  { text: "Registrar asistencia", color: "green" },
  { text: "Ver reportes", color: "purple" },
  { text: "Gestionar permisos", color: "yellow" },
  { text: "Configurar cuenta", color: "red" }
];

const DashboardScreen = () => {
  return (
    <div>
        <TituloPagina titulo="Bienvenido" descripcion={`Bienvenido a ${import.meta.env.VITE_PUBLIC_APP_NAME} asistencia`} />
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">¿Qué deseas hacer hoy?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardOptions.map((option, index) => (
                    <Button className={`p-8`} asChild key={index}>
                        <Link to="/novedades">
                            <span className={`text-lg`}>{option.text}</span>
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
    </div>
  )
}

export default DashboardScreen