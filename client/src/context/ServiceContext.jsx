import { createContext, useContext, useMemo } from "react";
import api from "../services/api";
import { createAuthService } from "../services/auth.service";
// import { createProductService } from "../services/product.service";

const ServiceContext = createContext(null);

export const ServiceProvider = ({ children }) => {
  const services = useMemo(() => {
    return {
      auth: createAuthService(api),
      // product: createProductService(api),
    };
  }, []);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => useContext(ServiceContext);
