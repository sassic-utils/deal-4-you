import { useEffect, useState } from "react";
import { getPathname } from "../router";

export function usePathname() {
  const [pathname, setPathname] = useState(getPathname());

  useEffect(() => {
    function handlePopState() {
      setPathname(getPathname());
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return pathname;
}
