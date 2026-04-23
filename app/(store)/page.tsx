import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CATEGORIES_QUERY } from "@/sanity/queries/categories";

export default async function Home() {
  const { data } = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
  });

  console.log(data);

  return (
    <div>
      {/* Features Carousel */}
      {/* Page banner */}
      {/* Category */}
      {/* Product */}
    </div>
  );
}
