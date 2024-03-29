import { Routes, Route } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./Context/Context";
import ProfilePage from "./pages/ProfilePage";
import StuffsPage from "./pages/StuffsPage";
import StuffsForm from "./Components/StuffsForm";
import StuffPage from "./pages/StuffPage";
import BookingsPage from "./pages/BookingsPage";
import BookingsPageAdmin from "./pages/BookingsPageAdmin";


axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/stuffs" element={<StuffsPage />} />
          <Route path="/account/stuffs/new" element={<StuffsForm />} />
          <Route path="/account/stuffs/:id" element={<StuffsForm />} />
          <Route path="/stuffs/:id" element={<StuffPage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings-admin-all" element={<BookingsPageAdmin />} />
          <Route path="/stuffs/:id" element={<StuffPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
