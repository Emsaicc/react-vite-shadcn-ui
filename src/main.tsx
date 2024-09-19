import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/globals.css";
import LoginScreen from "./screens/login/LoginScreen";
import RootLayout from "./components/layouts/RootLayout";
import { UserProvider } from "@/context/UserContext";


import PrivateRoutes from "./utils/PrivateRoute";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import LandingScreen from "./screens/landing/LandingScreen";
import NovedadesScreen from "./screens/novedades/NovedadesScreen";
import NovedadesLayout from "./components/layouts/NovedadesLayout";


const queryClient = new QueryClient();

const router = createBrowserRouter(createRoutesFromElements(
  <Route element={
  <UserProvider>
    <RootLayout />
  </UserProvider>}>
  <Route path="/landing" element={<LandingScreen />} />
  <Route path="login" element={<LoginScreen />} />
  
  <Route element={<PrivateRoutes/>}>     
     <Route index element={<DashboardScreen />} />     
  </Route>
  
  <Route element={<PrivateRoutes requiredPermisos={[]}/>}>
     
    <Route element={<NovedadesLayout />} >
    <Route path="novedades" element={<NovedadesScreen />} />
    </Route>
   
  </Route>
  </Route>
));

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}