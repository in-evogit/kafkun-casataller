import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal from "@/components/pagina-legal";
import { EMPRESA } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Privacidad · Casa Taller Kafkün",
  description:
    "Qué datos pide Casa Taller Kafkün, dónde se guardan, quién los ve y cómo pedir que se borren.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/privacidad`,
  },
};

export default function PrivacidadPage() {
  // La pagina se adapta a lo que el sitio tiene ENCENDIDO de verdad. Google
  // Analytics y el pixel de Meta estan cableados pero apagados: sin esto, la pagina
  // prometeria que no hay seguimiento y el dia que se enciendan quedaria mintiendo,
  // o al contrario, declararia un seguimiento que hoy no existe.
  const conAnalytics = Boolean(process.env.NEXT_PUBLIC_GA_ID);
  const conPixel = Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID);
  const conMedicion = conAnalytics || conPixel;

  return (
    <PaginaLegal
      antetitulo="Legal"
      titulo="Qué hacemos con tus datos"
      bajada="Qué te pedimos, para qué lo usamos, dónde queda guardado y cómo pedir que lo borremos. Sin letra chica."
    >
      <section>
        <h2>Lo corto</h2>
        <p>
          Pedimos lo mínimo para poder responderte y para entregarte lo que compraste.{" "}
          <strong>No vendemos tus datos, no los cedemos a nadie para publicidad</strong>{" "}
          y no te vamos a llenar el correo. Si quieres que borremos lo que tenemos de
          ti, escríbenos a <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> y lo
          hacemos.
        </p>
      </section>

      <section>
        <h2>Qué pedimos, y para qué</h2>

        <h3>Si mandas un encargo</h3>
        <p>
          Tu nombre, tu correo, tu teléfono si lo dejas, qué pieza quieres, cómo la
          imaginas, para cuándo la necesitas, la hora que elegiste para conversar, y las
          fotos de referencia que subas.
        </p>
        <p>
          Se usa para una sola cosa: conversar tu encargo y tejerlo. El teléfono es
          opcional — si no lo dejas, te escribimos por correo.
        </p>
        <p>
          <strong>Las fotos que subes quedan en un lugar privado.</strong> No tienen
          dirección pública: para verlas hay que generar un enlace que caduca en una
          hora, y eso solo lo puede hacer Katty desde su panel. Nadie las encuentra
          adivinando una dirección ni aparecen en Google.
        </p>

        <h3>Si dejas tu correo para las novedades</h3>
        <p>
          Solo el correo, y de qué parte del sitio lo dejaste. Se usa para avisarte
          cuando haya cupos, un taller presencial o algo nuevo publicado. Cada correo
          que te mandemos lleva un enlace para borrarte de la lista de un clic, y si lo
          aprietas dejas de recibirlos de inmediato.
        </p>

        <h3>Si escribes por el formulario de contacto</h3>
        <p>
          Tu nombre, tu correo y tu mensaje. Se usa para responderte. Guardamos el
          mensaje para saber qué quedó contestado y qué no.
        </p>

        <h3>Si te creas una cuenta y compras</h3>
        <p>
          Tu correo y tu contraseña —que queda cifrada: <strong>nadie</strong>, nosotros
          incluidos, puede leerla—, y tu nombre, teléfono o RUT si los completas.
          También qué compraste y cuándo.
        </p>
        <p>
          <strong>Los datos de tu tarjeta no pasan por acá en ningún momento.</strong>{" "}
          Van directo a MercadoPago. Nosotros no los vemos, no los recibimos y no los
          guardamos: de tu pago solo sabemos que se aprobó, por cuánto y qué compraste.
        </p>
      </section>

      <section>
        <h2>Dónde queda guardado</h2>
        <p>
          En <strong>Supabase</strong>, en sus servidores de São Paulo, Brasil. Eso
          significa que tus datos <strong>salen de Chile</strong> y se guardan allá, con
          las medidas de seguridad de ese servicio. Si eso no te acomoda, escríbenos
          antes de dejarnos tus datos.
        </p>
        <p>
          El sitio se sirve desde <strong>Vercel</strong>, que registra datos técnicos
          de las visitas —dirección IP, navegador, qué página se pidió— para que la
          página funcione y para detectar ataques.
        </p>
      </section>

      <section>
        <h2>Quién más ve algo</h2>
        <p>
          Solo los servicios que hacen falta para que el sitio funcione, y cada uno ve
          únicamente su parte:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> — guarda la base de datos, las cuentas y las fotos
            de los encargos.
          </li>
          <li>
            <strong>Vercel</strong> — sirve el sitio.
          </li>
          <li>
            <strong>Resend</strong> — manda los correos. Ve la dirección a la que
            escribe y el contenido de ese correo.
          </li>
          <li>
            <strong>MercadoPago</strong> — procesa los pagos y es quien recibe los datos
            de tu tarjeta, no nosotros.
          </li>
          <li>
            <strong>Mux</strong> — entrega el video de las clases.
          </li>
          {conAnalytics && (
            <li>
              <strong>Google Analytics</strong> — mide qué páginas se visitan, de forma
              agregada.
            </li>
          )}
          {conPixel && (
            <li>
              <strong>Meta (Instagram y Facebook)</strong> — mide qué visitas llegan
              desde sus redes y permite mostrar publicidad.
            </li>
          )}
        </ul>
        <p>
          Nadie más. No hay ningún tercero comprando ni recibiendo esta información.
        </p>
      </section>

      <section>
        <h2>Cookies y lo que queda en tu navegador</h2>
        <p>
          El sitio guarda dos cosas en tu navegador, y ninguna sirve para seguirte:
        </p>
        <ul>
          <li>
            <strong>Tu carrito</strong>, para que no se vacíe al cambiar de página. Vive
            solo en tu navegador: no llega a nuestros servidores hasta que compras.
          </li>
          <li>
            <strong>Tu sesión</strong>, si tienes cuenta, para no pedirte la contraseña
            en cada página.
          </li>
        </ul>
        {conMedicion ? (
          <p>
            Además, las herramientas de medición nombradas arriba dejan sus propias
            cookies. Puedes bloquearlas desde la configuración de tu navegador; el sitio
            sigue funcionando igual.
          </p>
        ) : (
          <p>
            <strong>No hay cookies de publicidad ni de seguimiento de terceros.</strong>{" "}
            Si eso cambia, esta página lo va a decir.
          </p>
        )}
      </section>

      <section>
        <h2>Cuánto tiempo lo guardamos</h2>
        <ul>
          <li>
            <strong>Los encargos y sus fotos:</strong> mientras dure la conversación y
            el trabajo. Cuando el encargo se cierra, si quieres que borremos las fotos,
            lo pides y se borran.
          </li>
          <li>
            <strong>Tu correo en la lista:</strong> hasta que te des de baja.
          </li>
          <li>
            <strong>Los mensajes de contacto:</strong> el tiempo necesario para
            responderte y dejar constancia de lo conversado.
          </li>
          <li>
            <strong>Tu cuenta y tus compras:</strong> mientras tengas la cuenta. El
            registro de una compra se conserva el tiempo que la ley obligue por temas
            tributarios, aunque cierres la cuenta.
          </li>
        </ul>
      </section>

      <section>
        <h2>Qué puedes pedirnos</h2>
        <p>
          Sobre tus datos personales puedes pedirnos, en cualquier momento y sin dar
          explicaciones:
        </p>
        <ul>
          <li>Saber exactamente qué tenemos de ti.</li>
          <li>Corregir algo que esté mal.</li>
          <li>Que lo borremos.</li>
          <li>Que dejemos de usarlo para mandarte correos.</li>
        </ul>
        <p>
          Escríbenos a <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> desde el
          correo del que se trate. Respondemos lo antes posible, y si no podemos borrar
          algo por una obligación legal, te decimos cuál es en vez de dejarte esperando.
        </p>
        <p>
          Estos derechos te los da la ley chilena de protección de la vida privada, y
          esta página no los limita.
        </p>
      </section>

      <section>
        <h2>Si algo se filtrara</h2>
        <p>
          No prometemos que sea imposible, porque nadie puede. Sí prometemos esto: si
          pasara algo que afecte tus datos, te lo decimos —qué pasó, qué datos
          alcanzó y qué estamos haciendo— en vez de callarlo.
        </p>
      </section>

      <section>
        <h2>Menores de edad</h2>
        <p>
          Las clases están pensadas para adultos y no pedimos datos a menores a
          propósito. Si eres menor de edad, compra o manda un encargo con tu madre,
          padre o quien te cuide.
        </p>
      </section>

      <section>
        <h2>Lo demás</h2>
        <p>
          Las condiciones de compra están en{" "}
          <Link href="/terminos">términos y condiciones</Link>, y las devoluciones en{" "}
          <Link href="/devoluciones">su propia página</Link>.
        </p>
      </section>
    </PaginaLegal>
  );
}
