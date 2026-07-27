"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(!src);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(!src);
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={hasError || !imgSrc ? fallbackSrc : imgSrc}
      alt={alt || "Property listing"}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
