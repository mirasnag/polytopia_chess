// main library
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// components
import PageLayout from "./pages/PageLayout";
import HomePage from "./pages/home/HomePage";
import GamePage from "./pages/game/GamePage";
import GameCreationPage from "./pages/game/GameCreationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/game",
        children: [
          {
            index: true,
            element: <GamePage />,
          },
          {
            path: "/game/creation",
            element: <GameCreationPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
