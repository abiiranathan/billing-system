import React, { useState } from "react";
import { useBilling } from "../BillingContext";
import { formatCurrency } from "../functions";
import useTests from "../hooks/useTests";
import { Table, TD } from "./Table";

export default function Lab() {
  const [name, setName] = useState("");
  const { data, isLoading, isError } = useTests({ name });
  const { addToBill, billingQueue } = useBilling();

  const headers = ["Investigation", "Selling Price", "Qty to bill", "Action"];

  if (isError)
    return <div className="p-2 text-white bg-red-400 mt-4">Error Loading test prices</div>;

  if (isLoading || !data) return <div className="mt-4">Loading test prices...</div>;

  return (
    <div className="bg-pink-200 p-2 rounded-sm mt-4 text-justify">
      <h2 className="font-black text-2xl">INVESTIGATIONS</h2>
      <div className="bg-white shadow-lg drop-shadow p-2 min-h-screen rounded">
        <div className="my-1">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="search"
            placeholder="Search investigations by name..."
          />
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table headers={headers} bordered={true}>
            {data.length === 0 && (
              <tr>
                <TD colSpan={5}>No investigations found!</TD>
              </tr>
            )}

            {data
              .filter(test => {
                const exists = !!billingQueue.find(item => item.id === test.id);
                return !exists;
              })
              .map(test => (
                <TableRow test={test} key={test.id} addToBill={addToBill} />
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}

function TableRow({ test, addToBill }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <tr key={test.id}>
      <TD>{test.name}</TD>
      <TD>
        <span className="font-black text-red-500">{formatCurrency(test.sellingPrice)}</span>
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
          onClick={() => addToBill({ ...test, quantity, type: "TEST" })}
        >
          Add to bill
        </button>
      </TD>
    </tr>
  );
}
