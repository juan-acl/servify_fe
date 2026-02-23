import { AuthProvider } from "./context/auth/auth.context";
import { AppRouter } from "./router/app.router";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
