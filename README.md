# Repeat Playlist Player

A simple music player built with Next.js that allows you to control how many times each song repeats before moving to the next track.

This project was built as a personal experiment to explore programmable playback behavior using the HTML Audio API.

---

##  Features

* Upload local audio files
* Set custom repeat count for each song
* Automatic playback queue
* Auto-repeat per track
* Smooth transition to next song
* Simple and lightweight (no backend required)

---

##  Concept

Unlike traditional music players that simply play a queue from start to finish, this player introduces the idea of **repeat-aware playback**.

Each track has a defined number of plays:

```
Song A → plays 5 times
Song B → plays 2 times
Song C → plays 1 time
```

The player handles:

* Repeating a song until its count is exhausted
* Moving automatically to the next song
* Maintaining playback state in the browser

---

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/repeat-playlist-player.git
cd repeat-playlist-player
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Open the app

Visit:

```
http://localhost:3000
```

---

##  Tech Stack

* Next.js (App Router)
* React
* TypeScript
* HTML Audio API
* Tailwind CSS

---

##  How It Works

1. User uploads audio files
2. Each file is added to a playlist with a repeat count
3. On playback:

   * The current song plays
   * When it ends, the repeat counter is checked
   * If repeats remain → song replays
   * If finished → move to next track

---

##  Future Improvements

* Drag-and-drop playlist ordering
* Progress bar and time tracking
* “Repeat for duration” mode (e.g. 10 minutes)
* Shuffle after repeat cycles
* Persistent playlists (localStorage / cloud sync)
* Better UI/UX (Spotify-style interface)
* Mobile support

---

##  Purpose

This project is not meant to replace existing music players, but to explore a more flexible way of thinking about playback logic and user control.

It was built as a learning project and a playground for experimenting with React state management and audio handling.

---

##  License

MIT — feel free to use, modify, and experiment.
