"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

type Props = {
  playbackId: string | null;
  courseSlug: string;
  thumbnailUrl: string;
  title: string;
};

export default function VideoPlayer({ playbackId, courseSlug, thumbnailUrl, title }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [devMode, setDevMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playbackId) {
      setDevMode(true);
      setLoading(false);
      return;
    }
    fetch(`/api/video-token?playback_id=${playbackId}&course_slug=${courseSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.devMode) setDevMode(true);
        else setToken(data.token);
      })
      .catch(() => setDevMode(true))
      .finally(() => setLoading(false));
  }, [playbackId, courseSlug]);

  if (loading) {
    return (
      <div className="aspect-video w-full animate-pulse rounded-xl bg-muted" />
    );
  }

  if (devMode || !playbackId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-foreground">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-primary-foreground">
          <svg className="h-16 w-16 opacity-60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <p className="text-sm font-medium opacity-70">
            Video disponible cuando se suba a Mux
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl">
      <MuxPlayer
        playbackId={playbackId}
        tokens={{ playback: token ?? undefined }}
        streamType="on-demand"
        metadata={{ video_title: title }}
        className="h-full w-full"
      />
    </div>
  );
}
