import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/GlobalHeader/Header';
import HomePage from './pages/HomePage';
import GlobalFooter from './components/GlobalFooter/GlobalFooter';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <GlobalFooter />
    </BrowserRouter>
  )
}

export default App;
