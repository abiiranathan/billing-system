import React, { useRef, useState } from "react";
import { formatCurrency } from "../functions";
import { Table, TD } from "./Table";
import { useReactToPrint } from "react-to-print";
import logo from "../logo.jpg";
import { useAuth } from "../AuthContext";

export default function BillingQueue({ items, removeItem, clearQueue }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("Female");
  const [discount, setDiscount] = useState(0);
  const { user } = useAuth();
  const ref = useRef();

  const grandTotal =
    items.reduce((acc, current) => acc + current.quantity * current.sellingPrice, 0) - discount;

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  // Do not show billingQueue if no items in queue
  if (grandTotal <= 0) return null;

  return (
    <div className="border p-3 bg-gray-50 text-justify">
      <div className="flex sm:items-center justify-between align-baseline gap-x-8 flex-col lg:flex-row">
        <div className="flex justify-between flex-1 gap-x-8 my-2">
          <button
            className="bg-blue-300 text-gray-900 py-1 px-5 shadow drop-shadow hover:drop-shadow-lg hover:bg-red-400 hover:text-white rounded"
            onClick={handlePrint}
            disabled={!name || !age}
          >
            Print
          </button>
        </div>

        <form className="grid grid-cols-1  sm:flex gap-x-4 gap-y-1 flex-wrap">
          <div className="flex flex-col">
            <label htmlFor="name">Client Name</label>
            <input
              value={name}
              name="name"
              id="name"
              placeholder="Patient Name"
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="age">Age</label>
            <input
              name="age"
              value={age}
              id="age"
              placeholder="Patient Age"
              onChange={e => setAge(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="sex">Gender</label>
            <select
              value={sex}
              name="sex"
              id="sex"
              className="bg-white"
              onChange={e => setSex(e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </form>
      </div>

      <div ref={ref} className="printable px-4 py-1 my-1 bg-white">
        <img src={logo} className="lg:h-[100px] max-h-24 mx-auto hidden" id="printable_logo" />
        <div className="flex justify-between">
          <h2 className="text-3xl text-red-600">PATIENT BILL</h2>
          <button
            className="px-2 noprint py-1 rounded border shadow-lg bg-indigo-400 text-yellow-200"
            onClick={() => {
              clearQueue();
              setDiscount(0);
              setName("");
              setAge("");
              setCashier("");
            }}
          >
            Clear All
          </button>
        </div>

        {name && age && (
          <div className="bg-gray-50 text-gray-900 grid grid-cols-1 sm:flex sm:justify-between gap-x-4 gap-y-1 p-1 mt-2">
            <h2 className="text-lg">Name: {name}</h2>
            <h2 className="text-lg">Age: {age}</h2>
            <h2 className="text-lg">Sex: {sex}</h2>
            <h2 className="text-lg">
              Date:{" "}
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>
        )}
        <div className="max-w-full overflow-x-auto">
          <Table
            headers={["Item", "Type", "Qty", "Selling Price", "Subtotal", "Remove"]}
            bordered={true}
            id="printable_table"
          >
            {items.map(item => {
              return (
                <tr key={item.id}>
                  <TD>{item.name}</TD>
                  <TD>{item.type}</TD>
                  <TD>{item.quantity}</TD>
                  <TD>{formatCurrency(item.sellingPrice)}</TD>
                  <TD>{formatCurrency(item.quantity * item.sellingPrice)}</TD>
                  <TD>
                    <button
                      className="py-1 px-2 border shadow-sm bg-red-500 text-gray-100 hover:opacity-50"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </TD>
                </tr>
              );
            })}

            <tr>
              <TD colSpan={3}>Cashier: {user.name}</TD>
              <TD>Discount (in UGX):</TD>
              <TD>
                <input
                  className="border-0"
                  type="number"
                  value={discount || ""}
                  onChange={e => setDiscount(e.target.valueAsNumber || 0)}
                  placeholder="Add discount"
                />
              </TD>
              <TD>*</TD>
            </tr>
          </Table>
          <div className="bg-blue-200">
            <span colSpan={4} className="uppercase text-2xl !border-r-0 text-right px-2">
              Grand total:{" "}
            </span>
            <span colSpan={2} className="uppercase text-2xl text-gray-800 !border-l-0 px-2">
              {formatCurrency(grandTotal)} /=
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
