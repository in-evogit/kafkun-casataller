import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal from "@/components/pagina-legal";
import { EMPRESA, CONDICIONES } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Devoluciones · Casa Taller Kafkün",
  description:
    "Cuándo se puede devolver una clase o un encargo de Casa Taller Kafkün, y qué hacemos si una pieza llega con un problema.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/devoluciones`,
  },
};

export default function DevolucionesPage() {
  const dias = CONDICIONES.diasRetractoClase;

  return (
    <PaginaLegal
      antetitulo="Legal"
      titulo="Devoluciones"
      bajada="Cuándo puedes pedir tu plata de vuelta y cuándo no, dicho antes de que compres y no después."
    >
      <section>
        <h2>Las clases: {dias} días para arrepentirte</h2>
        <p>
          Si compraste una clase y te arrepentiste, tienes{" "}
          <strong>{dias} días corridos</strong> desde la compra para pedir la
          devolución, sin tener que explicar por qué. Se devuelve el{" "}
          <strong>100%</strong> por el mismo medio con que pagaste.
        </p>
        <p>
          Escríbenos a <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> desde el
          correo con el que compraste y listo. No hay formulario ni trámite.
        </p>
        <p>
          Después de esos {dias} días la clase no se devuelve, porque el material ya
          quedó visto y descargado. Por eso está toda la información en la página de la
          clase antes de comprar: si te queda una duda, pregúntala primero —te
          respondemos aunque no compres—.
        </p>
      </section>

      <section>
        <h2>Los encargos: no se devuelven, y vale la pena entender por qué</h2>
        <p>
          Una pieza a pedido{" "}
          <strong>
            {CONDICIONES.retractoEncargo
              ? "se puede devolver según lo acordado"
              : "no se puede devolver por cambio de opinión"}
          </strong>
          . No es una condición dura por gusto: la pieza se teje con tus medidas, tu
          forma y tu diseño. Terminada, no le sirve a nadie más, y son semanas del
          trabajo de Katty más la lana ya comprada.
        </p>
        <p>
          Por eso el encargo <strong>no parte con un pago</strong>, parte con una
          conversación. Ahí se definen las medidas, la forma, la lana y el precio. Nada
          se teje hasta que las dos partes estén de acuerdo, y recién entonces se paga
          el {CONDICIONES.abonoEncargoPorciento}% de abono.
        </p>

        <h3>Si cancelas antes de que esté lista</h3>
        <ul>
          <li>
            <strong>Antes de que Katty empiece:</strong> se devuelve el abono completo.
          </li>
          <li>
            <strong>Ya empezada:</strong> se devuelve lo que quede después de descontar
            la lana comprada y el trabajo hecho. Te mostramos el cálculo, no un número
            a secas.
          </li>
          <li>
            <strong>Terminada:</strong> no hay devolución por cambio de opinión. Sí la
            hay si el problema es de la pieza, y eso está más abajo.
          </li>
        </ul>
      </section>

      <section>
        <h2>Si la pieza tiene un problema, es otra cosa</h2>
        <p>
          Esto no es una devolución por arrepentimiento y no tiene las mismas reglas.
          Si la pieza llega con una falla, si no es lo que se acordó, o si se daña en el
          envío, <strong>lo arreglamos</strong>: se repara, se rehace o se devuelve tu
          plata, y lo eliges tú. El costo del envío de vuelta en ese caso lo pagamos
          nosotros.
        </p>
        <p>
          Avísanos en cuanto la recibas, con una foto de lo que ves. Mientras antes, más
          fácil es resolverlo.
        </p>
        <p>
          Lo que no cuenta como falla: las variaciones propias de lo hecho a mano —el
          tono exacto de la lana, la textura, milímetros de diferencia— y el desgaste
          por uso o un lavado que no siguió las indicaciones de cuidado.
        </p>
      </section>

      <section>
        <h2>Cuánto tarda la plata en volver</h2>
        <p>
          Una vez que confirmamos la devolución, la procesamos por el mismo medio de
          pago. Desde ahí el plazo lo pone tu banco o tu tarjeta, y suele tomar algunos
          días hábiles. No depende de nosotros, pero sí te avisamos cuando está hecha de
          nuestro lado.
        </p>
      </section>

      <section>
        <h2>Tus derechos no dependen de esta página</h2>
        <p>
          Todo lo de arriba se suma a lo que ya te garantiza la Ley 19.496 de
          protección de los derechos del consumidor. Nada de lo que diga esta página
          puede quitarte esos derechos, y si algo acá los contradijera, gana la ley.
        </p>
        <p>
          Las condiciones generales de compra están en{" "}
          <Link href="/terminos">términos y condiciones</Link>.
        </p>
      </section>
    </PaginaLegal>
  );
}
