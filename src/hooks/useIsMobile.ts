import { useEffect, useState } from "react";

function getQuery(maxWidth: number) {
  return `(max-width: ${maxWidth}px)`;
}

export function useIsMobile(maxWidth = 640) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(getQuery(maxWidth)).matches
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(getQuery(maxWidth));

    setIsMobile(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [maxWidth]);

  return isMobile;
}
