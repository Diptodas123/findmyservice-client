import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/GlobalHeader/Header';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
