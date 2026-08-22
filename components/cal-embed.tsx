/**
 * Calendario de Cal.com, embebido como iframe.
 *
 * A propósito NO se usa el paquete @calcom/embed-react: eso trae una dependencia más
 * y carga un script de terceros. Con el iframe basta, y el agujero que hay que abrir
 * en la CSP es sólo `frame-src` — no `script-src`, que es el peligroso.
 *
 * `NEXT_PUBLIC_CAL_LINK` es el tramo de la URL de Cal, por ejemplo "kafkun/encargo".
 * Mientras Katy no cree la cuenta la variable no existe, y en vez de un iframe roto
 * se muestra el correo. La página funciona igual.
 */

type Props = {
  /** Se precargan en Cal para que la persona no reescriba lo que ya puso. */
  nombre?: string;
  email?: string;
  notas?: string;
};

export default function CalEmbed({ nombre, email, notas }: Props) {
  const link = process.env.NEXT_PUBLIC_CAL_LINK;

  if (!link) {
    return (
      <div className="border border-dashed border-border-strong p-6">
        <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
          Recibí tu pedido. Para cuadrar la hora te escribo por WhatsApp, o si prefieres
          escríbeme tú a{" "}
          <a
            href="mailto:kafkuntelares@gmail.com"
            className="hilo font-medium text-foreground"
          >
            kafkuntelares@gmail.com
          </a>
          .
        </p>
      </div>
    );
  }

  const params = new URLSearchParams({ embed: "true", layout: "month_view" });
  if (nombre) params.set("name", nombre);
  if (email) params.set("email", email);
  if (notas) params.set("notes", notas);

  return (
    <iframe
      src={`https://cal.com/${link}?${params.toString()}`}
      title="Elige la hora de tu videollamada con Katy"
      loading="lazy"
      className="h-[620px] w-full border border-border"
    />
  );
}
