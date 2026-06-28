import PlaylistPlayer from "@/components/Playlistplayer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900 flex flex-col md:p-4 justify-center items-center">

   
      <div className="flex flex-col w-full max-w-6xl md:min-h-[85vh] md:max-h-[90vh] bg-white md:shadow-xl md:border md:border-gray-200 md:rounded-xl overflow-hidden">

       
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <h1 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            🎧 Repeat Music Player
          </h1>

        <div className="flex items-center gap-2 text-sm text-gray-500">
  <svg
    className="w-5 h-5 flex-shrink-0"
    viewBox="0 0 444 512"
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit="2"
  >
    <path d="M221.7 0L-.003 127.998v255.997L221.7 512l221.696-128.005V127.998L221.7 0zm0 36.976l189.676 109.51v219.02L221.7 475.024 32.024 365.506v-219.02L221.7 36.976z" fill="#ff1e58"/>
    <path d="M170.368 330.738h-31.12l74.405-149.483h31.127l-74.412 149.483zM289.052 330.738h-31.127l74.412-149.483h31.12l-74.405 149.483zM111.075 330.738H79.947l37.203-74.742h31.128l-37.203 74.742zM266.945 256.019h-31.128l37.203-74.742h31.128l-37.203 74.742z" fill="#ff1e58"/>
  </svg>

  <span>Powered by Jamendo</span>
</div>
        </div>

       
        <div className="flex-1 flex flex-col overflow-hidden">
          <PlaylistPlayer />
        </div>

      </div>
    </div>
  );
}