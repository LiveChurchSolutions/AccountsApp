import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./UserContext"
import { Routing } from "./Routing";
import { CookiesProvider } from "react-cookie"

console.log("this should work")










console.log("well well");







                          console.log('oh yeah')



const App: React.FC = () => (
  <UserProvider>
    <CookiesProvider>
      <Router>
        <Routing />
      </Router>
    </CookiesProvider>
  </UserProvider>
)
export default App;

