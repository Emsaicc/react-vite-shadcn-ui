import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import parse from "html-react-parser";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Badge } from "@/components/ui/badge";
import { Novedad, User } from "@/types/types";
import TimeAgoBadge from "./TimeAgo";
import { getBadgeClass } from "../utils/getBadgeClass";

dayjs.extend(utc);
dayjs.extend(timezone);
type Props = {
  novedades: Novedad[];
  user: User;
  setNovedadActiva: (novedad: Novedad) => void;
};

const NovedadesList = (props: Props) => {
  const { novedades, user, setNovedadActiva } = props;
  return (
    <div>
      {novedades.map((novedad: any, index: any) => {
        const hasNewResponses = novedad?.respuestas?.some(
          (item: any) =>
            !item?.visualizada_por?.some(
              (entry: any) => entry.user_id === user?.id
            )
        );
        // console.log(user.id,)

        return (
          <Card
            key={index}
            onClick={() => {
              setNovedadActiva(novedad);
              
            }}
            className={`"rounded-t-3xl mt-4 hover:cursor-pointer ${
              novedad?.isAviso ? "bg-green-100" : "bg-gray-100"
            } overflow-hidden"`}
          >
            <CardHeader className="rounded-t-3xl">
              <CardTitle className="flex flex-wrap overflow-x-scroll lg:overflow-clip lg:items-center  gap-2 flex-col lg:flex-row">
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                  {!novedad?.visualizada_por
                    ?.map((item: any) => item.user_id)
                    .includes(user?.id) && (
                    <Badge className="bg-blue-500 ">NUEVA</Badge>
                  )}
                  {hasNewResponses && (
                    <Badge className="bg-blue-500 ">Nuevas respuestas</Badge>
                  )}
                  <Badge
                    className={`${
                      novedad?.isAviso
                        ? "bg-green-500"
                        : novedad?.estado === "PENDIENTE"
                          ? "bg-orange-400"
                          : novedad?.estado === "EN PROCESO"
                            ? "bg-yellow-100 text-black"
                            : "bg-green-500"
                    } 
      text-xs flex-shrink-0`}
                  >
                    {novedad?.isAviso
                      ? "Aviso"
                      : novedad?.estado?.toUpperCase()}
                  </Badge>
                  <Badge className="text-xs flex-shrink-0">
                    {novedad?.categoria?.label}
                  </Badge>
                  <TimeAgoBadge
                    fechaCreada={novedad?.fecha_creada}
                    estado={novedad?.estado}
                  />
                  <Badge
                    className={`${getBadgeClass(
                      novedad?.prioridad,
                      novedad?.estado
                    )} flex-shrink-0`}
                  >
                    Prioridad {novedad?.prioridad}
                  </Badge>
                </div>
                <div className="w-full"></div>
                <span className="flex-grow font-semibold text-lg break-words truncate">
                  {novedad?.asunto
                    ? novedad?.asunto.length > 64
                      ? `${novedad?.asunto.charAt(0).toUpperCase() + novedad?.asunto.slice(1).toLowerCase().substring(0, 63).trim()}...`
                      : novedad?.asunto.charAt(0).toUpperCase() +
                        novedad?.asunto.slice(1).toLowerCase().trim()
                    : ""}
                </span>
              </CardTitle>

              <CardDescription className="text">
                Creado por {novedad?.creador.nombre} {novedad?.creador.apellido}{" "}
                ({novedad?.area.nombre})
                {` el ${dayjs(novedad?.fecha_creada)
                  .tz("America/Montevideo")
                  .format("DD/MM/YYYY HH:mm")}`}
                <br />
                {novedad?.portero &&
                  "* Esta novedad está relacionada al funcionario: " +
                    novedad?.portero.label}
                <br />
                {novedad?.servicio &&
                  "* Esta novedad está relacionada al servicio: " +
                    novedad?.servicio.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <p className="truncate">
                {
                  typeof novedad?.contenido === "string" &&
                  novedad.contenido.length > 128
                    ? parse(
                        `${novedad.contenido
                          .substring(0, 128)
                          .replace(/<\/?(ul|li|b|hp|strong|b)[^>]*>/g, " ")
                          .trim()} <span className="text-blue-700 mx-2">continuar leyendo...</span>`
                      )
                    : typeof novedad?.contenido === "string"
                      ? parse(
                          novedad.contenido
                            .replace(/<\/?(ul|li|b|h2|p|strong|b)[^>]*>/g, " ")
                            .trim()
                        )
                      : null /* Or provide an appropriate fallback if needed */
                }
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default NovedadesList;
