const CLIENT_ID = process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID;

export async function fetchTracks() {
  const res = await fetch(
    `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&audioformat=mp32`
  );

  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.results.map((track: any) => ({
    id: track.id,
    name: track.name,
    artist: track.artist_name,
    url: track.audio,
    image: track.album_image,
  }));
}