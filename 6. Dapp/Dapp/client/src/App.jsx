import { EthProvider } from "./contexts/EthContext";
import Voting from "./components/Voting";
import "./App.css";

function App() {
  return (
    <EthProvider>
      <Voting />
    </EthProvider>
  );
}

export default App;
