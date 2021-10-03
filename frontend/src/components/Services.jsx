import React, { useState } from "react";
import { useBilling } from "../BillingContext";
import { formatCurrency } from "../functions";
import useServices from "../hooks/useServices";
import { Table, TD } from "./Table";

export default function Services() {
  const [name, setName] = useState("");
  const { data, isLoading, isError } = useServices({ name });
  const { addToBill, billingQueue } = useBilling();

  const headers = ["Medical Service/Surgical Procedure", "Charge", "Qty to bill", "Action"];

  if (isError)
    return <div className="p-2 text-white bg-red-400 mt-4">Error Loading test prices</div>;

  if (isLoading || !data) return <div className="mt-4">Loading test prices...</div>;

  return (
    <div className="bg-pink-200 p-2 rounded-sm mt-4 text-justify">
      <h2 className="font-black text-2xl">Services / Procedures</h2>

      <div className="bg-white shadow-lg drop-shadow p-2 min-h-screen rounded">
        <div className="my-1">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="search"
            placeholder="Search service by name..."
          />
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table headers={headers} bordered={true}>
            {data.length === 0 && (
              <tr>
                <TD colSpan={5}>No service or procedure found!</TD>
              </tr>
            )}

            {data
              .filter(service => {
                const exists = !!billingQueue.find(item => item.id === service.id);
                return !exists;
              })
              .map(service => (
                <TableRow item={service} key={service.id} addToBill={addToBill} />
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}

function TableRow({ item, addToBill }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <tr key={item.id}>
      <TD>{item.name}</TD>
      <TD>
        <span className="font-black text-red-500">{formatCurrency(item.sellingPrice)}</span>
      </TD>
      <TD>
        <input
          type="number"
          value={quantity || ""}
          className="w-[150px]"
          onChange={e => setQuantity(e.target.valueAsNumber)}
        />
      </TD>
      <TD>
        <button
          className="px-3 py-1 border bg-red-400 text-white"
          disabled={!quantity || (quantity && quantity < 1)}
          onClick={() => addToBill({ ...item, quantity, type: "SERVICE/PROCEDURE" })}
        >
          Add to bill
        </button>
      </TD>
    </tr>
  );
}
