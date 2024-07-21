import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Dashboard from "./components/historical_home";
import LiveData from "./components/live";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<LiveData />
    },
    {
      path:"/historical",
      element:<Dashboard />
    },
  ])

  return (
    <div className="App">
      <header className="App-header">
      <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
