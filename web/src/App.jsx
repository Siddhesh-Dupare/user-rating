import LoginMain from "./components/pages/auth/login/LoginMain";
import SignupMain from "./components/pages/auth/signup/SignupMain";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import { Toaster } from "./components/ui/toast";
import Admin from "@/components/pages/users/admin/Admin";

function App() {
  return (
    <Toaster>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginMain />} />
          <Route path="/signup" element={<SignupMain />} />
          {/* <Route path="/admin/dashboard" element={<Dashboard role="ADMIN" />} />*/}
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/user/dashboard" element={<Dashboard role="USER" />} />
          <Route
            path="/store-owner/dashboard"
            element={<Dashboard role="STORE_OWNER" />}
          />
        </Routes>
      </BrowserRouter>
    </Toaster>
  );
}

export default App;
