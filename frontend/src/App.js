import Notepad from './Notepad';
import SyncProvider from './SyncProvider';

function App() {

  const fetchToken = async () => {
      const res =  await fetch("http://localhost:5000/token");
      const data = await res.json();
      return data.token;
  }

  return (
    <div className="App">
      <SyncProvider tokenFunc={fetchToken}>
        <Notepad />
      </SyncProvider>
    </div>
  );
}

export default App;
