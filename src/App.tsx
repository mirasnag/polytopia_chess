// main library
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// components
import HomePage from "./pages/home/HomePage";
import GamePage from "./pages/game/GamePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/game",
    element: <GamePage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
