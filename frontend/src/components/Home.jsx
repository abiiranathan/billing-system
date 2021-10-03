import React from "react";
import { Link } from "react-router-dom";
import { useBilling } from "../BillingContext";

export default function Home() {
  const { billingQueue } = useBilling();
  const drugsIncluded = billingQueue.filter(b => b.type === "DRUG").length > 0;
  const testsIncluded = billingQueue.filter(b => b.type === "TEST").length > 0;
  const consumablesIncluded = billingQueue.filter(b => b.type === "CONSUMABLE").length > 0;
  const servicesIncluded = billingQueue.filter(b => b.type === "SERVICE/PROCEDURE").length > 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 justify-center flex-col items-center border shadow p-3 drop-shadow border-b-0 bg-gray-100 text-sm lg:text-base">
      <Link
        id="drugs"
        to="/drugs"
        className={`py-2 px-3 border rounded-lg cursor-pointer hover:shadow hover:bg-red-400 hover:text-white transition-all duration-150 uppercase shadow-sm ${
          drugsIncluded ? "bg-green-600 text-white" : "bg-gray-50"
        }`}
      >
        DRUG PRICES
      </Link>

      <Link
        id="lab"
        to="/lab"
        className={`py-2 px-3 border rounded-lg cursor-pointer bg-gray-50 hover:shadow hover:bg-red-400 hover:text-white transition-all duration-150 uppercase shadow-sm ${
          testsIncluded ? "bg-green-600 text-white" : "bg-gray-50"
        }`}
      >
        LAB PRICES
      </Link>

      <Link
        id="services"
        to="/services"
        className={`py-2 px-3 border rounded-lg cursor-pointer bg-gray-50 hover:shadow hover:bg-red-400 hover:text-white transition-all duration-150 uppercase shadow-sm ${
          servicesIncluded ? "bg-green-600 text-white" : "bg-gray-50"
        }`}
      >
        Services and Procedures
      </Link>
      <Link
        id="consumables"
        to="/consumables"
        className={`py-2 px-3 border rounded-lg cursor-pointer bg-gray-50 hover:shadow hover:bg-red-400 hover:text-white transition-all duration-150 uppercase shadow-sm ${
          consumablesIncluded ? "bg-green-600 text-white" : "bg-gray-50"
        }`}
      >
        Consumables
      </Link>
    </div>
  );
}
