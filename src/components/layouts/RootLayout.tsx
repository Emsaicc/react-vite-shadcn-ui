import { UserProvider, useUser } from "@/context/UserContext";
import { useState } from "react";
import {  Outlet, useLocation } from "react-router-dom";
import Navigation from "../bars/NavigationBar/Navigation";

export default function RootLayout() {
    const location = useLocation();
    const [isOpenNavigation, setIsOpenNavigation] = useState(false); 
    const {theme, user} = useUser();
    console.log(user);
    console.log(theme);

   
  return (
    
    <UserProvider>
         <main className="w-full h-screen flex  flex-row relative">
      { location.pathname !== "/login" && location.pathname !== "/landing" && <Navigation isOpen={isOpenNavigation} setIsOpen={setIsOpenNavigation} /> }
      <section 
        className={`flex ${location.pathname === "/login" || location.pathname === "/landing" ? "pl-0 pt-0" : "px-10 pt-10 gap-5"} flex-col w-full`}
        style={{ marginLeft: location.pathname === "/login" || location.pathname === "/landing" ? "0" : (isOpenNavigation ? "24rem" : "5rem") }}
      >
      
              <Outlet />
        
      </section>
      </main>         
    
    </UserProvider>
  );
}