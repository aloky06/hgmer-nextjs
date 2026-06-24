import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  // Fetch products from our NestJS Backend
  let products = [];
  try {
    const res = await fetch('https://hgmer-git-master-hindsols-projects.vercel.app/api/products', { cache: 'no-store' });
    if (res.ok) {
      products = await res.json();
    }
  } catch (err) {
    console.error("Could not fetch products", err);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-saffron mb-8 text-center">Pooja Samagri Shop</h1>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>No products available yet.</p>
          <p className="text-sm">Use the backend API to add some products!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} width={200} height={200} className="object-cover h-full w-full" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gold font-bold text-xl">₹{product.price}</span>
                  <button className="bg-saffron hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition text-sm font-semibold">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
