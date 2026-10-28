import { useRef, type KeyboardEvent } from "react";
import { nivelesMadurez } from "../data/catalogo/escalas";
import type { Nivel, NivelEvaluado } from "../data/tipos";
import { PistaNivel } from "./PistaNivel";
import { RampaMadurez } from "./RampaMadurez";
import estilos from "./SelectorNivel.module.css";

type Props = {
  nivel: NivelEvaluado;
  control: string;
  etiqueta: string;
  sugerido?: NivelEvaluado;
  alCambiar?: (nivel: NivelEvaluado) => void;
};

const opciones: Nivel[] = [0, 1, 2, 3, 4];

export function SelectorNivel({
  nivel,
  control,
  etiqueta,
  sugerido = null,
  alCambiar,
}: Props) {
  const grupo = useRef<HTMLDivElement>(null);

  if (!alCambiar) return <RampaMadurez nivel={nivel} control={control} />;

  function alPresionar(evento: KeyboardEvent<HTMLDivElement>) {
    const hacia =
      evento.key === "ArrowRight" || evento.key === "ArrowDown"
        ? 1
        : evento.key === "ArrowLeft" || evento.key === "ArrowUp"
          ? -1
          : 0;
    if (hacia === 0 || !alCambiar) return;
    evento.preventDefault();
    const actual = nivel === null ? -1 : opciones.indexOf(nivel);
    const posicion =
      actual === -1
        ? hacia > 0
          ? 0
          : opciones.length - 1
        : (actual + hacia + opciones.length) % opciones.length;
    const siguiente = opciones[posicion];
    if (siguiente === undefined) return;
    alCambiar(siguiente);
    const botones =
      grupo.current?.querySelectorAll<HTMLButtonElement>("button");
    botones?.[posicion]?.focus();
  }

  return (
    <div className={estilos.contenedor}>
      <div
        ref={grupo}
        className={estilos.selector}
        role="radiogroup"
        aria-label={etiqueta}
        onKeyDown={alPresionar}
      >
        {opciones.map((valor) => {
          const activo = valor === nivel;
          const esSugerido = sugerido !== null && valor === sugerido;
          const nombre = `${valor}: ${nivelesMadurez[valor]?.nombre ?? ""}`;
          const etiquetaOpcion = esSugerido
            ? `${nombre}, nivel sugerido`
            : nombre;
          const tabulable = activo || (nivel === null && valor === 0);
          return (
            <PistaNivel key={valor} control={control} nivel={valor}>
              {(disparador) => (
                <button
                  {...disparador}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  aria-label={etiquetaOpcion}
                  tabIndex={tabulable ? 0 : -1}
                  className={`pulsador ${estilos.opcion}`}
                  data-nivel={valor}
                  data-tono="nivel"
                  data-sugerido={esSugerido ? true : undefined}
                  onClick={() => alCambiar(valor)}
                >
                  {valor}
                </button>
              )}
            </PistaNivel>
          );
        })}
      </div>
      {nivel !== null && (
        <button
          type="button"
          className={estilos.limpiar}
          onClick={() => alCambiar(null)}
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
