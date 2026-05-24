import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, X } from "lucide-react";
import { seedCourses, seedModules } from "@/lib/data/seed";
import VideoPlayer from "@/components/video-player";

type Props = { params: Promise<{ curso: string; leccion: string }> };

function getAllLessons(curso: string) {
  const modules = seedModules[curso] ?? [];
  return modules.flatMap((m) => m.lessons);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { curso, leccion } = await params;
  const lesson = getAllLessons(curso).find((l) => l.slug === leccion);
  const course = seedCourses.find((c) => c.slug === curso);
  return {
    title: lesson ? `${lesson.title} · ${course?.title}` : "Lección",
    robots: { index: false },
  };
}

export default async function LeccionPage({ params }: Props) {
  const { curso, leccion } = await params;

  const course = seedCourses.find((c) => c.slug === curso);
  const modules = seedModules[curso];
  if (!course || !modules) notFound();

  const allLessons = getAllLessons(curso);
  const currentIndex = allLessons.findIndex((l) => l.slug === leccion);
  if (currentIndex === -1) notFound();

  const currentLesson = allLessons[currentIndex];
  const prevLesson = allLessons[currentIndex - 1] ?? null;
  const nextLesson = allLessons[currentIndex + 1] ?? null;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <Link
          href="/mis-cursos"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Volver a mis cursos</span>
        </Link>
        <p className="font-heading text-sm font-semibold text-foreground">
          {course.title}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{allLessons.length}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — módulos y lecciones */}
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-border lg:block">
          <div className="p-4">
            {modules.map((mod, mi) => (
              <div key={mi} className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {mod.title}
                </p>
                <ul className="space-y-1">
                  {mod.lessons.map((l) => {
                    const isActive = l.slug === leccion;
                    return (
                      <li key={l.slug}>
                        <Link
                          href={`/aprende/${curso}/${l.slug}`}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground/40"}`}
                          />
                          <span className="flex-1 leading-snug">{l.title}</span>
                          <span className="text-xs opacity-60">
                            {l.duration_minutes}min
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main — video + contenido */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl p-4 sm:p-6">
            {/* Player */}
            <VideoPlayer
              playbackId={currentLesson.mux_playback_id}
              courseSlug={curso}
              thumbnailUrl={course.thumbnail_url}
              title={currentLesson.title}
            />

            {/* Navegación prev/next */}
            <div className="mt-4 flex items-center justify-between gap-4">
              {prevLesson ? (
                <Link
                  href={`/aprende/${curso}/${prevLesson.slug}`}
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{prevLesson.title}</span>
                  <span className="sm:hidden">Anterior</span>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link
                  href={`/aprende/${curso}/${nextLesson.slug}`}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
                >
                  <span className="hidden sm:inline">{nextLesson.title}</span>
                  <span className="sm:hidden">Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/mis-cursos"
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
                >
                  Finalizar curso
                  <CheckCircle2 className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* Info de la lección */}
            <div className="mt-6 border-t border-border pt-6">
              <div className="flex items-center gap-3">
                <h1 className="font-heading text-2xl font-semibold text-foreground">
                  {currentLesson.title}
                </h1>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{currentLesson.duration_minutes} minutos</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
