import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TestRunDetailPage from "./pages/TestRunDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/test-run/:id" element={<TestRunDetailPage />} />
    </Routes>
  );
}

export default App;
