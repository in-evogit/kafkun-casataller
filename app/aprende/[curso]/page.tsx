import { redirect, notFound } from "next/navigation";
import { seedModules } from "@/lib/data/seed";

type Props = { params: Promise<{ curso: string }> };

export default async function AprenderCursoPage({ params }: Props) {
  const { curso } = await params;
  const modules = seedModules[curso];
  if (!modules) notFound();

  const firstLesson = modules[0]?.lessons[0];
  if (!firstLesson) notFound();

  redirect(`/aprende/${curso}/${firstLesson.slug}`);
}
