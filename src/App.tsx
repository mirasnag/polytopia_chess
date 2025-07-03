import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hi</div>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
