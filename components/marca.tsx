import Link from "next/link";

/**
 * La marca en la barra superior.
 *
 * Existe como componente aparte por la misma razon que figura.tsx: el logo definitivo
 * todavia no llega. Hoy dibuja el nombre en Fraunces; cuando Gabriel entregue el archivo,
 * se cambia SOLO este archivo y aparece en toda la barra, el pie y donde se use.
 *
 * Mientras tanto no es un cuadro vacio ni un "logo aqui": es la marca escrita, que en una
 * marca personal es una solucion legitima y no un placeholder.
 */
type Props = {
  /** Ruta del logo cuando exista. Si falta, se dibuja el nombre. */
  src?: string;
  className?: string;
};

export default function Marca({ src, className }: Props) {
  return (
    <Link
      href="/"
      aria-label="Casa Taller Kafkún — ir a la portada"
      className={
        className ??
        "font-heading text-xl font-semibold tracking-[-0.01em] text-primary transition-colors duration-[var(--dur-color)] hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      }
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="Casa Taller Kafkún" className="h-8 w-auto" />
      ) : (
        "Casa Taller Kafkún"
      )}
    </Link>
  );
}
