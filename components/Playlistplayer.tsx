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

  // Load files
  // function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
  //   const files = Array.from(e.target.files || []);

  //   const newTracks: Track[] = files.map((file) => ({
  //     file,
  //     name: file.name,
  //     repeats: 1,
  //     url: URL.createObjectURL(file),
  //   }));

  //   setTracks(newTracks);
  //   setCurrentIndex(0);
  //   setCurrentRepeat(0);
  // }

  // Update repeat count
  function updateRepeat(index: number, value: number) {
    const updated = [...tracks];
    updated[index].repeats = value;
    setTracks(updated);
  }

  // Play a track
  function playTrack(index: number) {
  console.log("PLAY CLICKED", index);
  console.log("TRACKS", tracks);

  const track = tracks[index];
  console.log("CURRENT TRACK", track);

  if (!track || !audioRef.current) return;

  audioRef.current.src = track.url;
  audioRef.current.play();
}
  // function playTrack(index: number) {
  //   const track = tracks[index];
  //   if (!track || !audioRef.current) return;

  //   audioRef.current.src = track.url;
  //   audioRef.current.play();
  //   setIsPlaying(true);
  // }

  // Toggle play/pause
  function togglePlay() {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  // Handle repeat logic
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

  // Progress tracking
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
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">

      {/* AUDIO ENGINE */}
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* MAIN */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <div className="w-1/3 bg-white border-r border-gray-200 p-4 space-y-4">

          <h2 className="text-lg font-bold">Playlist</h2>

          {/* <input
          title="Upload songs"
            type="file"
            multiple
            onChange={handleFiles}
            className="border border-gray-300 p-2 rounded w-full"
          /> */}

          <div className="space-y-2 mt-4">

            {tracks.length === 0 && (
              <p className="text-gray-500 text-sm">
                No songs uploaded yet
              </p>
            )}

            {tracks.map((t, i) => (
              <div
                key={i}
                className={`p-2 rounded border transition-all ${
                  i === currentIndex
                    ? "bg-blue-100 border-blue-400 scale-[1.02]"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-center">

                  <span className="text-sm">{t.name}</span>

                  <input
                  title="Set repeat count"
                    type="number"
                    min={1}
                    value={t.repeats}
                    onChange={(e) =>
                      updateRepeat(i, Number(e.target.value))
                    }
                    className="w-14 border border-gray-300 rounded px-1 text-gray-900"
                  />

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NOW PLAYING */}
        <div className="flex-1 flex flex-col items-center justify-center">

          <h2 className="text-xl font-bold">
            {tracks[currentIndex]?.name || "No song selected"}
          </h2>

          <p className="text-gray-500 mt-2">
            Repeat {currentRepeat + 1} /{" "}
            {tracks[currentIndex]?.repeats || 0}
          </p>

          {/* progress bar */}
          <div className="w-64 mt-4">
            <div className="h-2 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
          type="button"
            onClick={() => playTrack(currentIndex)}
            className="mt-6 px-4 py-2 bg-white border rounded shadow hover:bg-gray-50 cursor-pointer"
          >
            Play
          </button>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="h-20 border-t bg-white flex items-center justify-center gap-4">

        <button
          onClick={togglePlay}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

      </div>
    </div>
  );
}