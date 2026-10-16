import LoginForm from "./components/LoginForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        {/* <Route
          path="/user/dashboard"
          element={<UserDashboard />}
        />
        <Route
          path="/owner/dashboard"
          element={<OwnerDashboard />}
        />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
