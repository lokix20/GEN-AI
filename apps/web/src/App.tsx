import { AppProviders } from "./app/providers";
import { AppRouter } from "./app/router";
import { useBootstrapSession } from "./hooks/useAuth";

function Bootstrapper() {
  useBootstrapSession();
  return <AppRouter />;
}

export default function App() {
  return (
    <AppProviders>
      <Bootstrapper />
    </AppProviders>
  );
}
