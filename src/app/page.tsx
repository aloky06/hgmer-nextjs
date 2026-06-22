import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-saffron/10 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Spiritual Journey <span className="text-saffron">Simplified</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Book trusted Pandit Ji for your poojas, buy premium Pooja Samagri kits, and learn about the profound significance of Hindu festivals.
          </p>
          
          <div className="flex justify-center gap-4">
            <button className="bg-saffron hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
              Book Pandit Ji
            </button>
            <button className="bg-gold hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
              Shop Pooja Samagri
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="font-bold text-lg text-saffron mb-2">Book Pandit Ji</h3>
            <p className="text-sm text-gray-500">Verified and experienced</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="font-bold text-lg text-saffron mb-2">Pooja Samagri</h3>
            <p className="text-sm text-gray-500">Premium quality items</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="font-bold text-lg text-saffron mb-2">Festival Calendar</h3>
            <p className="text-sm text-gray-500">Auspicious dates & timings</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="font-bold text-lg text-saffron mb-2">Pooja Vidhi</h3>
            <p className="text-sm text-gray-500">Step-by-step guides</p>
          </div>
        </div>
      </section>
    </div>
  );
}
