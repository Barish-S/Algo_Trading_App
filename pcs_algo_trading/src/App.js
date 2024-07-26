import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/historical_home';
import LiveData from './components/live';
import 'bootstrap/dist/css/bootstrap.min.css';
import Forward from './components/features/forward';
import Reverse from './components/features/reverse';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<LiveData />} />
            <Route path="/historical" element={<Dashboard />} />
            <Route path='/forward' element={<Forward />} />
            <Route path='/reverse' element={<Reverse />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
