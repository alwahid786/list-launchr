import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import Router from './components/Router';

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Router />
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;