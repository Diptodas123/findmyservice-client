import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/GlobalHeader/Header';
import HomePage from './pages/HomePage';
import GlobalFooter from './components/GlobalFooter/GlobalFooter';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <GlobalFooter />
    </BrowserRouter>
  );
}

export default App;
