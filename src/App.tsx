import { AuthProvider } from "./context/auth/auth.context";
import { SocketProvider } from "./context/socket/socket.context";
import { AppRouter } from "./router/app.router";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppRouter />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
