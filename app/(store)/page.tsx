import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  FEATURED_PRODUCTS_QUERY,
  FILTER_PRODUCTS_BY_NAME_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
} from "@/sanity/queries/products";
import { ALL_CATEGORIES_QUERY } from "@/sanity/queries/categories";
import { FeaturedCarousel } from "@/components/app/FeaturedCarousel";
import { CategoryTiles } from "@/components/app/CategoryTiles";
import { ProductSection } from "@/components/app/ProductSection";
import { FeaturedCarouselSkeleton } from "@/components/app/FeaturedCarouselSkeleton";
import { CategoryTilesSkeleton } from "@/components/app/CategoryTilesSkeleton";
import { ProductGridSkeleton } from "@/components/app/ProductGridSkeleton";

export const revalidate = 10;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    color?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q ?? "";
  const categorySlug = params.category ?? "";
  const color = params.color ?? "";
  const material = params.material ?? "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 0;
  const sort = params.sort ?? "name";
  const inStock = params.inStock === "true";

  // Select query based on sort parameter
  const getQuery = () => {
    // If searching and sort is relevance, use relevance query
    if (searchQuery && sort === "relevance") {
      return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
    }

    switch (sort) {
      case "price_asc":
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case "price_desc":
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      case "relevance":
        return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  // Fetch data in parallel for better performance
  const [productsResponse, categoriesResponse, featuredResponse] =
    await Promise.all([
      sanityFetch({
        query: getQuery(),
        params: {
          searchQuery,
          categorySlug,
          color,
          material,
          minPrice,
          maxPrice,
          inStock,
        },
      }),
      sanityFetch({
        query: ALL_CATEGORIES_QUERY,
      }),
      sanityFetch({
        query: FEATURED_PRODUCTS_QUERY,
      }),
    ]);

  const products = productsResponse.data;
  const categories = categoriesResponse.data;
  const featuredProducts = featuredResponse.data;

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Featured Products Carousel */}
      <Suspense fallback={<FeaturedCarouselSkeleton />}>
        <FeaturedCarousel products={featuredProducts} />
      </Suspense>
    </div>
  );
}
