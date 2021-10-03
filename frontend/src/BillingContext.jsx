import { createContext, useContext } from "react";

export const BillingContext = createContext({
  billingQueue: [],
  addToBill: item => {},
});

export const useBilling = () => {
  return useContext(BillingContext);
};
