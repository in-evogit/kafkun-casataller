const OF_API_URL = "https://api.haulmer.com/v2/dte";

type BoleItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type BoleParams = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerRut?: string;
  items: BoleItem[];
  total_clp: number;
};

export async function emitirBoleta(params: BoleParams): Promise<{ folio?: number; pdfUrl?: string; devMode?: boolean }> {
  if (!process.env.OF_API_KEY) {
    console.log("[openfactura] OF_API_KEY no configurado — boleta omitida:", params.orderId);
    return { devMode: true };
  }

  const body = {
    dte: {
      tipoDTE: 39, // Boleta electrónica
      emisor: {
        rutEmisor: process.env.OF_RUT_EMISOR ?? "",
        razonSocial: "Casa Taller Kafkun",
        giroEmisor: "Enseñanza y venta de productos textiles",
      },
      receptor: {
        rutRecep: params.customerRut ?? "66666666-6",
        rznSocRecep: params.customerName || "Sin nombre",
        emailRecep: params.customerEmail,
      },
      totales: {
        mntTotal: params.total_clp,
        mntNeto: Math.round(params.total_clp / 1.19),
        iva: Math.round(params.total_clp - params.total_clp / 1.19),
      },
      detalle: params.items.map((item, idx) => ({
        nroLinDet: idx + 1,
        nmItem: item.description,
        qtyItem: item.quantity,
        prcItem: item.unitPrice,
        montoItem: item.quantity * item.unitPrice,
      })),
      referencias: [
        {
          nroLinRef: 1,
          razonRef: `Orden #${params.orderId}`,
        },
      ],
    },
  };

  const res = await fetch(`${OF_API_URL}/document`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.OF_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[openfactura] Error al emitir boleta:", err);
    throw new Error(`OpenFactura error: ${res.status}`);
  }

  const data = (await res.json()) as { folio?: number; urlPdf?: string };
  return { folio: data.folio, pdfUrl: data.urlPdf };
}
