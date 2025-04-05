export default function Home() {
    return (
      <div className="bg-white p-8 md:p-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why choose Truvera?
          </h2>
          <p className="text-gray-600 mb-6">
            Dock Labs is a leader in decentralized identity solutions, empowering
            businesses to launch ID ecosystems where their partners can create,
            share, and monetize verifiable digital credentials. The Truvera
            platform is designed to be easily implemented and scalable, allowing
            organizations to quickly deploy a decentralized identity solution with
            minimal development overhead.
          </p>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <span className="text-gray-800 text-xl">🔗</span>
              <span className="text-gray-700">REST API for core functions</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-800 text-xl">📱</span>
              <span className="text-gray-700">Mobile SDK for wallet deployment</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-800 text-xl">⭐</span>
              <span className="text-gray-700">Developer-friendly integration</span>
            </div>
          </div>
          <div className="mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-lg font-semibold flex items-center">
              Learn more →
            </button>
          </div>
        </div>
      </div>
    );
  }
  