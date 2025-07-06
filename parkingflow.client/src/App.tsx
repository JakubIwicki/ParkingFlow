
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import { DataContextProvider } from "./contexts/DataContext";
import Dashboard from "./pages/Dashboard";
import ParkingAreas from "./pages/parking_area/ParkingAreas";
import NewParkingArea from "./pages/parking_area/NewParkingArea";
import EditParkingArea from "./pages/parking_area/EditParkingArea";
import ParkingFees from "./pages/parking_fee/ParkingFees";
import PayForParking from "./pages/PayForParking";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            <Route path="/login" element={<Login />} />

            <Route path="/" element={
              <DataContextProvider>
                <Layout>
                  <Dashboard />
                </Layout>
              </DataContextProvider>
            } />

            <Route path="/pay" element={
              <DataContextProvider>
                <Layout>
                  <PayForParking />
                </Layout>
              </DataContextProvider>
            } />

            {/* Parking Areas Routes */}
            <Route path="/parkingareas" element={
              <DataContextProvider>
                <Layout>
                  <ParkingAreas />
                </Layout>
              </DataContextProvider>
            } />
            <Route path="parkingareas/new" element={
              <DataContextProvider>
                <Layout>
                  <NewParkingArea />
                </Layout>
              </DataContextProvider>
            } />
            <Route path="parkingareas/:id" element={
              <DataContextProvider>
                <Layout>
                  <EditParkingArea />
                </Layout>
              </DataContextProvider>
            } />

            {/* Parking fees routes */}
            <Route path="/parkingfees" element={
              <DataContextProvider>
                <Layout>
                  <ParkingFees />
                </Layout>
              </DataContextProvider>
            } />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
