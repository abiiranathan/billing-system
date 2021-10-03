import React, { useState } from "react";
import { useBilling } from "../BillingContext";
import { formatCurrency } from "../functions";
import useDrugs from "../hooks/useDrugs";
import Paginator from "./Paginator";
import { Table, TD } from "./Table";

export default function Drugs() {
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useDrugs({ name, page });
  const { addToBill, billingQueue } = useBilling();

  const headers = [
    "Drug Name",
    "Cost Price",
    "Selling Price",
    "Batch No",
    "Expiry Date",
    "Qty to bill",
    "Action",
  ];

  if (isError)
    return <div className="p-2 text-white bg-red-400 mt-4">Error Loading drug prices</div>;

  if (isLoading || !data) return <div className="mt-4">Loading drug prices...</div>;

  return (
    <div className="bg-pink-200 p-2 rounded-sm mt-4 text-justify">
      <h2 className="font-black text-2xl">DRUGS</h2>
      <div className="bg-white shadow-lg drop-shadow p-2 min-h-screen rounded">
        <div className="my-1">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="search"
            placeholder="Search drugs by name..."
          />
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table headers={headers} bordered={true}>
            {data.results.length === 0 && (
              <tr>
                <TD colSpan={5}>No drugs found!</TD>
              </tr>
            )}

            {data.results
              .filter(drug => {
                const exists = !!billingQueue.find(item => item.id === drug.id);
                return !exists;
              })
              .map(drug => (
                <TableRow drug={drug} key={drug.id} addToBill={addToBill} />
              ))}
          </Table>

          <div className="hidden md:block">
            {data && (
              <Paginator
                count={data.count}
                next={data.next}
                prev={data.prev}
                pages={data.pages}
                page={page}
                setPage={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ drug, addToBill }) {
  const [quantity, setQuantity] = useState(0);

  return (
    <tr key={drug.id}>
      <TD>{drug.name}</TD>
      <TD>{formatCurrency(drug.costPrice)}</TD>
      <TD>
        <span className="font-black text-red-500">{formatCurrency(drug.sellingPrice)}</span>
      </TD>
      <TD>{drug.batchNumber}</TD>
      <TD>{drug.expiryDate}</TD>
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
          onClick={() => addToBill({ ...drug, quantity, type: "DRUG" })}
        >
          Add to bill
        </button>
      </TD>
    </tr>
  );
}
