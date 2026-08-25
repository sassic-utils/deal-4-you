import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import DonatePage from "./pages/DonatePage";

function getRoute() {
  return window.location.hash || "#/";
}

function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    function handleHashChange() {
      setRoute(getRoute());
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (route === "#/donate") {
    return <DonatePage />;
  }

  return <HomePage />;
}

export default App;