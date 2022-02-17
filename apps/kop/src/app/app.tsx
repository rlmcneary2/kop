import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ContextProvider } from "./context/provider";
import { AppRoutes } from "./app-routes";

export function App() {
  return (
    <ChakraProvider resetCSS>
      <BrowserRouter>
        <ContextProvider>
          <AppRoutes />
        </ContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
