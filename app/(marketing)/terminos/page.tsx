import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal from "@/components/pagina-legal";
import { EMPRESA, CONDICIONES } from "@/lib/data/legal";
import { seedCourses } from "@/lib/data/clases";

export const metadata: Metadata = {
  title: "Términos y condiciones · Casa Taller Kafkün",
  description:
    "Las condiciones de compra de las clases y de los encargos de Casa Taller Kafkün: qué incluye cada cosa, cómo se paga y qué pasa si algo sale mal.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/terminos`,
  },
};

const curso = seedCourses[0];

export default function TerminosPage() {
  return (
    <PaginaLegal
      antetitulo="Legal"
      titulo="Términos y condiciones"
      bajada="Qué estás comprando exactamente, cómo se paga y qué pasa si algo no sale como esperabas. Escrito para entenderse, no para cubrirnos."
    >
      <section>
        <h2>Quién te vende</h2>
        <p>
          <strong>{EMPRESA.nombre}</strong>, el taller de Katty, tejedora de telar
          mapuche. Para cualquier cosa relacionada con una compra, un encargo o estas
          condiciones, escríbenos a{" "}
          <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>.
        </p>
        {EMPRESA.razonSocial && EMPRESA.rut && (
          <p>
            Responde legalmente <strong>{EMPRESA.razonSocial}</strong>, RUT{" "}
            {EMPRESA.rut}
            {EMPRESA.direccion && `, con domicilio en ${EMPRESA.direccion}`}
            {EMPRESA.comuna && `, ${EMPRESA.comuna}`}.
          </p>
        )}
        <p>
          Comprar en este sitio o mandar un encargo significa que aceptas lo que dice
          esta página. Si algo acá no te parece, escríbenos antes de comprar.
        </p>
      </section>

      <section>
        <h2>Lo que se vende acá son dos cosas distintas</h2>
        <p>
          Conviene tenerlo claro desde el principio, porque las condiciones no son las
          mismas.
        </p>

        <h3>1. Las clases</h3>
        <ul>
          <li>
            Son <strong>online y grabadas</strong>. Las ves cuando puedas y las veces
            que quieras. Katty también hace talleres presenciales, pero esos se avisan
            aparte y no son lo que se compra en este sitio.
          </li>
          <li>
            El pago es <strong>único</strong>: se paga una vez y la clase queda tuya{" "}
            <strong>para siempre</strong>. No es una suscripción, no se renueva y no
            vence.
          </li>
          <li>
            El acceso es <strong>personal</strong>. Compartir tu cuenta o el material
            con otras personas no está permitido: es el trabajo de Katty y de eso vive.
          </li>
          <li>
            El precio que ves en la página es el que se cobra, en pesos chilenos, con
            impuestos incluidos cuando correspondan. Hoy el taller inicial está en{" "}
            {new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
              maximumFractionDigits: 0,
            }).format(curso.price_clp)}
            .
          </li>
        </ul>

        <h3>2. Las piezas a pedido</h3>
        <ul>
          <li>
            Cada pieza se teje <strong>para ti</strong>: tus medidas, la forma y el
            diseño conversados, y la lana elegida después de tocarla.
          </li>
          <li>
            <strong>El precio no está publicado, y es a propósito.</strong> Sale
            después de conversar, cuando la pieza está definida. Poner un &ldquo;desde
            $X&rdquo; sería darte un número que después no se cumple.
          </li>
          <li>
            Para empezar a tejer se paga un <strong>{CONDICIONES.abonoEncargoPorciento}%</strong>{" "}
            de abono, y el resto al entregar. El abono es lo que compra la lana y
            reserva el tiempo de Katty.
          </li>
          <li>
            Los plazos se acuerdan en esa conversación. Son plazos de trabajo hecho a
            mano: si algo se atrasa, te lo decimos, no lo descubres tú.
          </li>
          <li>
            Una pieza tejida a mano tiene <strong>variaciones</strong> — el tono de la
            lana, la textura, milímetros de diferencia. No son defectos: es lo que
            distingue una pieza tejida de una industrial.
          </li>
        </ul>
      </section>

      <section>
        <h2>Cómo se paga</h2>
        <p>
          Los pagos se procesan con <strong>MercadoPago</strong>. Nosotros no vemos ni
          guardamos los datos de tu tarjeta en ningún momento: esos datos viajan
          directo a ellos. Lo que sí queda registrado de tu lado es qué compraste,
          cuánto y cuándo.
        </p>
        <p>
          Si un pago queda rechazado o pendiente, la compra no se confirma y no se
          libera el acceso. Si te aparece cobrado y no tienes acceso, escríbenos y lo
          revisamos: es un problema nuestro, no tuyo.
        </p>
      </section>

      <section>
        <h2>Tu cuenta</h2>
        <p>
          Necesitas una cuenta para ver la clase que compraste. Eres responsable de
          mantener tu contraseña a resguardo, y nosotros de que tus datos estén
          protegidos — lo que hacemos con ellos está en{" "}
          <Link href="/privacidad">la página de privacidad</Link>.
        </p>
        <p>
          Podemos cerrar una cuenta que comparta el material pagado con otras personas.
          Si pasa eso, no se devuelve lo pagado.
        </p>
      </section>

      <section>
        <h2>Devoluciones y retracto</h2>
        <p>
          Tienen su propia página, porque es lo que más se pregunta y lo que peor se
          suele explicar: <Link href="/devoluciones">cómo funcionan las devoluciones</Link>
          .
        </p>
      </section>

      <section>
        <h2>El contenido del sitio es de Katty</h2>
        <p>
          Las fotos de las piezas, los textos, los videos de las clases y el material
          descargable son de su autoría. Puedes usar lo que aprendes para tejer todo lo
          que quieras —incluso para vender tus piezas, con todo el gusto—, pero no
          republicar ni revender el material de la clase.
        </p>
      </section>

      <section>
        <h2>Si cambiamos estas condiciones</h2>
        <p>
          Podemos actualizarlas, y la fecha de arriba dice cuándo fue la última vez.
          Los cambios no se aplican para atrás: lo que compraste se rige por las
          condiciones que estaban publicadas el día que compraste.
        </p>
      </section>

      <section>
        <h2>Si hay un problema</h2>
        <p>
          Escríbenos primero a <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>.
          Casi todo se resuelve así y más rápido. Lo que no, se rige por la ley chilena
          —incluida la Ley 19.496 de protección de los derechos del consumidor, que te
          ampara y que nada de lo que dice esta página puede reducir— y lo ven los
          tribunales de Chile.
        </p>
      </section>
    </PaginaLegal>
  );
}
