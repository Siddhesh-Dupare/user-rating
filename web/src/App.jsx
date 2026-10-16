import LoginMain from "./components/pages/auth/login/LoginMain";
import SignupMain from "./components/pages/auth/signup/SignupMain";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import { Toaster } from "./components/ui/toast";
import Admin from "@/components/pages/users/admin/Admin";
import User from "@/components/pages/users/user/User";
import ProtectedRoute from "@/components/pages/auth/ProtectedRoute";

function App() {
  return (
    <Toaster>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginMain />} />
          <Route path="/signup" element={<SignupMain />} />
          {/* <Route path="/admin/dashboard" element={<Dashboard role="ADMIN" />} />*/}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute roles={["USER"]}>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store-owner/dashboard"
            element={
              <ProtectedRoute roles={["STORE_OWNER"]}>
                <Dashboard role="STORE_OWNER" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Toaster>
  );
}

export default App;
