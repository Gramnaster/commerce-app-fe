import { useEffect, useState } from 'react';
import { customFetch } from '../../utils';
import type { Product } from './Products';
import ProductCard from './ProductCard';

interface ProductsRelatedProps {
  categoryId: number;
  currentProductId: number;
}

const ProductsRelated = ({ categoryId, currentProductId }: ProductsRelatedProps) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(
          `/product_categories/${categoryId}`
        );
        const products = response.data.data.products || [];

        // Filter out the current product and limit to 3 items
        const filtered = products
          .filter((p: Product) => p.id !== currentProductId)
          .slice(0, 3);

        setRelatedProducts(filtered);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
        setRelatedProducts([]);
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <section className="mb-20">
        <h3 className="font-primary text-[24px] font-semibold mb-6">Related Products</h3>
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mb-20">
      <h3 className="font-primary text-[24px] font-semibold mb-6">Related Products</h3>
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-[20px]">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductsRelated;