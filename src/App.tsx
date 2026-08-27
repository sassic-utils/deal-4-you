import HomePage from "./pages/HomePage";
import DonatePage from "./pages/DonatePage";
import NotFoundPage from "./pages/NotFoundPage";
import { usePathname } from "./hooks/usePathname";

const LISTING_PATH_PATTERN = /^\/listing\/\d+$/;

function App() {
  const pathname = usePathname();

  if (pathname === "/donate") {
    return <DonatePage />;
  }

  if (pathname === "/" || LISTING_PATH_PATTERN.test(pathname)) {
    return <HomePage />;
  }

  return <NotFoundPage />;
}

export default App;
