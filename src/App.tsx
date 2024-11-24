import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Wishlists from "./pages/Wishlists";
import WishlistDetails from "./pages/WishlistDetails";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlists" element={<Wishlists />} />
          <Route path="/wishlists/:id" element={<WishlistDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
