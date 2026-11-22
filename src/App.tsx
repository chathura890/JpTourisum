import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layout/PublicLayout';
import Home from './pages/public/Home';
import Booking from './pages/public/Booking';
import Vehicles from './pages/public/Vehicles';
import Drivers from './pages/public/Drivers';
import Packages from './pages/public/Packages';
import About from './pages/public/About';
import Feedback from './pages/public/Feedback';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="packages" element={<Packages />} />
          <Route path="about" element={<About />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="contact" element={<Contact />} />
          <Route path="book" element={<Booking />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
