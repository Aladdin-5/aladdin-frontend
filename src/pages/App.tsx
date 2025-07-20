import { useRoutes } from 'react-router-dom';
import routes from "@/router/index";

const App = () => { 
  const routeings = useRoutes(routes)
  return <>{routeings}</>;
}

export default App;