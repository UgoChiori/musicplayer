"use client";

import { useRef, useState, useEffect } from "react";
import { fetchTracks } from "@/lib/jamendo";

type Track = {
  file: File | null;
  name: string;
  repeats: number;
  url: string;
};

export default function PlaylistPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function updateRepeat(index: number, value: number) {
    const updated = [...tracks];
    updated[index].repeats = value;
    setTracks(updated);
  }

  function playTrack(index: number) {
    console.log("PLAY CLICKED", index);
    console.log("TRACKS", tracks);

    const track = tracks[index];
    console.log("CURRENT TRACK", track);

    if (!track || !audioRef.current) return;

    audioRef.current.src = track.url;
    audioRef.current.play();
  }

  function togglePlay() {
    if (!audioRef.current || tracks.length === 0) return;

    if (!audioRef.current.src) {
      playTrack(currentIndex);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  function stopTrack() {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentRepeat(0);
  }

  function nextTrack() {
    const next = currentIndex + 1;
    if (next < tracks.length) {
      setCurrentIndex(next);
      setCurrentRepeat(0);
      playTrack(next);
    }
  }

  function prevTrack() {
    const prev = currentIndex - 1;
    if (prev >= 0) {
      setCurrentIndex(prev);
      setCurrentRepeat(0);
      playTrack(prev);
    }
  }

  function handleEnded() {
    const track = tracks[currentIndex];
    if (!track) return;

    if (currentRepeat + 1 < track.repeats) {
      setCurrentRepeat((r) => r + 1);
      playTrack(currentIndex);
      return;
    }

    const next = currentIndex + 1;

    if (next < tracks.length) {
      setCurrentIndex(next);
      setCurrentRepeat(0);
      playTrack(next);
    } else {
      setIsPlaying(false);
    }
  }

  function handleTimeUpdate() {
    if (!audioRef.current) return;

    const percent =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;

    setProgress(percent || 0);
  }

  useEffect(() => {
    async function load() {
      console.log("LOADING JAMENDO...");
      const data = await fetchTracks();
      console.log("JAMENDO RESPONSE:", data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatted = data.map((t: any) => ({
        file: null,
        name: `${t.name} - ${t.artist}`,
        repeats: 1,
        url: t.url,
      }));

      console.log("FORMATTED:", formatted);
      setTracks(formatted);
    }

    load();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="w-full md:w-1/3 bg-white md:border-r border-b md:border-b-0 border-gray-200 p-4 flex flex-col h-64 md:h-auto overflow-hidden">
          <h2 className="text-base md:text-lg font-bold text-gray-800 shrink-0">
            Playlist
          </h2>

          <div className="space-y-2 mt-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {tracks.length === 0 ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(5)].map((_, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-100 border border-gray-200 rounded-lg flex justify-between items-center"
                  >
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                  </div>
                ))}
              </div>
            ) : (
              tracks.map((t, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border transition-all ${
                    i === currentIndex
                      ? "bg-green-50 border-green-300 shadow-sm"
                      : "bg-gray-50 border-green-200 hover:bg-green-100"
                  }`}
                >
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-xs sm:text-sm font-medium line-clamp-2 flex-1 text-gray-700">
                      {t.name}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xxs uppercase text-gray-400 font-semibold tracking-wider hidden sm:inline"></span>
                      <input
                        title="Set repeat count"
                        type="number"
                        min={1}
                        value={t.repeats}
                        onChange={(e) =>
                          updateRepeat(i, Number(e.target.value))
                        }
                        className="w-12 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-medium text-center text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50 min-h-[350px]">
          <div className="max-w-md w-full space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 px-4 line-clamp-2">
                {tracks[currentIndex]?.name || "No song selected"}
              </h2>

              <p className="text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-3 py-1 mt-2 rounded-full inline-block">
                Repeat {currentRepeat + 1} /{" "}
                {tracks[currentIndex]?.repeats || 0}
              </p>
            </div>

            <div className="w-full max-w-xs mx-auto">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-green-500 transition-all duration-150 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                onClick={prevTrack}
                disabled={currentIndex === 0 || tracks.length === 0}
                className="p-3 text-gray-600 hover:text-green-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-all active:scale-90 cursor-pointer"
                title="Previous Track"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 6h2v12H6zm3.5 6L18 6v12z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={stopTrack}
                disabled={tracks.length === 0}
                className="p-3 text-gray-600 hover:text-red-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-all active:scale-90 cursor-pointer"
                title="Stop"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 6h12v12H6z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={togglePlay}
                disabled={tracks.length === 0}
                className="p-4 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform active:scale-95 hover:scale-105 cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={nextTrack}
                disabled={
                  currentIndex === tracks.length - 1 || tracks.length === 0
                }
                className="p-3 text-gray-600 hover:text-green-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-all active:scale-90 cursor-pointer"
                title="Next Track"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
