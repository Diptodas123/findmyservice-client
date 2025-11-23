import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/GlobalHeader/Header';
import Search from './pages/Search.jsx';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
