import Image from "next/image";

const obras = [
  { src: "/images/obra-langer-1.jpg", alt: "Faja tejida en telar mapuche" },
  { src: "/images/obra-correas-1.jpg", alt: "Clienta con su faja tejida a mano" },
  { src: "/images/obra-clientes.jpg", alt: "Clientas del taller con sus piezas" },
  { src: "/images/obra-correas-2.jpg", alt: "Correas y fajas tejidas a mano" },
  { src: "/images/obra-langer-2.jpg", alt: "Detalle de una faja en telar mapuche" },
  { src: "/images/obra-correas-3.jpg", alt: "Faja tejida usada por su dueña" },
  { src: "/images/obra-correas-4.jpg", alt: "Pieza tejida en telar mapuche" },
  { src: "/images/lanas-2.jpg", alt: "Lanas e hilos de colores del taller" },
];

export default function ObrasGallery() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-semibold text-foreground md:text-5xl">
            Obras del taller
          </h2>
          <p className="mt-3 text-muted-foreground">
            Piezas tejidas a mano que ya están con sus dueñas
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {obras.map((o) => (
            <div
              key={o.src}
              className="relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={o.src}
                alt={o.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
