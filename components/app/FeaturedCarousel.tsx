"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import type { FEATURED_PRODUCTS_QUERYResult } from "@/sanity.types";

type FeaturedProduct = FEATURED_PRODUCTS_QUERYResult[number];

interface FeaturedCarouselProps {
  products: FEATURED_PRODUCTS_QUERYResult;
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {products.map((product) => (
            <CarouselItem key={product._id} className="pl-0">
              <FeaturedSlide product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows - positioned inside */}
        <CarouselPrevious className="left-4 border-zinc-700 bg-zinc-800/80 text-white hover:bg-zinc-700 hover:text-white sm:left-8" />
        <CarouselNext className="right-4 border-zinc-700 bg-zinc-800/80 text-white hover:bg-zinc-700 hover:text-white sm:right-8" />
      </Carousel>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                current === index
                  ? "w-6 bg-white"
                  : "bg-white/40 hover:bg-white/60",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FeaturedSlideProps {
  product: FeaturedProduct;
}

function FeaturedSlide({ product }: FeaturedSlideProps) {
  const mainImage = product.images?.[0]?.asset?.url;

  return (
    <div className="flex h-[500px] flex-col overflow-hidden sm:h-[550px] md:h-[500px] md:flex-row lg:h-[600px]">
      {/* Image Section - Left side (60% on desktop) */}
      <div className="relative h-2/5 w-full shrink-0 md:h-full md:w-3/5">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name ?? "Featured product"}
            width={1200}
            height={1200}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
            quality={90}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800">
            <span className="text-zinc-500">No image</span>
          </div>
        )}

        {/* Gradient overlay for image edge blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-900/90 dark:to-zinc-950/90 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent md:hidden" />
      </div>

      {/* Content Section - Right side (40% on desktop) */}
      <div className="flex h-3/5 w-full flex-col justify-center px-6 py-8 md:h-full md:w-2/5 md:px-12 lg:px-20">
        {product.category && (
          <Badge
            variant="secondary"
            className="mb-6 w-fit border-0 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-500 backdrop-blur-md"
          >
            {product.category.title}
          </Badge>
        )}

        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          {product.name}
        </h2>

        {product.description && (
          <p className="mt-6 line-clamp-3 text-base text-zinc-400 sm:text-lg lg:leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-8 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white lg:text-5xl">
            {formatPrice(product.price)}
          </span>
          {product.price && (
            <span className="text-sm font-medium text-zinc-500 line-through decoration-zinc-600">
              {formatPrice(product.price * 1.2)}
            </span>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-white text-zinc-900 hover:bg-zinc-100"
          >
            <Link href={`/products/${product.slug}`}>
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
