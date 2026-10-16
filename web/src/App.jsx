import LoginForm from "./components/LoginForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import { Toaster } from "./components/ui/toast";

function App() {
  return (
    <Toaster>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/admin/dashboard"
            element={<Dashboard role="ADMIN" />}
          />
          <Route path="/user/dashboard" element={<Dashboard role="USER" />} />
          <Route
            path="/owner/dashboard"
            element={<Dashboard role="OWNER" />}
          />
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
    </Toaster>
  );
}

export default App;
