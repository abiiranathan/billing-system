import React, { useState } from "react";
import { useBilling } from "../BillingContext";
import { formatCurrency } from "../functions";
import useConsumables from "../hooks/useConsumables";
import { Table, TD } from "./Table";

export default function Consumables() {
  const [name, setName] = useState("");
  const { data, isLoading, isError } = useConsumables({ name });
  const { addToBill, billingQueue } = useBilling();

  const headers = ["Item", "Cost Price", "Selling Price", "Qty to bill", "Action"];

  if (isError)
    return <div className="p-2 text-white bg-red-400 mt-4">Error Loading consumable prices</div>;

  if (isLoading || !data) return <div className="mt-4">Loading consumable prices...</div>;

  return (
    <div className="bg-pink-200 p-2 rounded-sm mt-4 text-justify">
      <h2 className="font-black text-2xl">CONSUMABLES</h2>
      <div className="bg-white shadow-lg drop-shadow p-2 min-h-screen rounded">
        <div className="my-1">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="search"
            placeholder="Search consumables by name..."
          />
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table headers={headers} bordered={true}>
            {data.length === 0 && (
              <tr>
                <TD colSpan={5}>No consumables found!</TD>
              </tr>
            )}

            {data
              .filter(consumable => {
                const exists = !!billingQueue.find(item => item.id === consumable.id);
                return !exists;
              })
              .map(consumable => (
                <TableRow consumable={consumable} key={consumable.id} addToBill={addToBill} />
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}

function TableRow({ consumable, addToBill }) {
  const [quantity, setQuantity] = useState(0);

  return (
    <tr key={consumable.id}>
      <TD>{consumable.name}</TD>
      <TD>{formatCurrency(consumable.costPrice)}</TD>
      <TD>
        <span className="font-black text-red-500">{formatCurrency(consumable.sellingPrice)}</span>
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
          onClick={() => addToBill({ ...consumable, quantity, type: "CONSUMABLE" })}
        >
          Add to bill
        </button>
      </TD>
    </tr>
  );
}
