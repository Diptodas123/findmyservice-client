import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/GlobalHeader/Header';
import HomePage from './pages/Home/HomePage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import GlobalFooter from './components/GlobalFooter/GlobalFooter';
import BackToTop from './components/BackToTop/BackToTop';
import Login from './pages/Login/Login.jsx';
import Signup from './pages/Signup/Signup.jsx';
import ServiceProviderDetails from './pages/ServiceProviderDetails/ServiceProviderDetails.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/service-providers/:id' element={<ServiceProviderDetails />} />
      </Routes>
      <GlobalFooter />
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;
