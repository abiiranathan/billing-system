import React from "react";

export function Table({ headers, bordered, children, ...props }) {
  let initialClass = "styled-table py-2 align-middle inline-block min-w-full overflow-x-auto ";
  let tbodyClass = "bg-white divide-y divide-gray-200 ";

  if (props.className) {
    initialClass += props.className;
  }

  if (props.tbodyclass) {
    tbodyClass += props.tbodyclass;
  }

  return (
    <div className={initialClass} {...props}>
      <div className="border-gray-300">
        <table
          className={`min-w-full divide-y  divide-gray-200 bg-gray-100 ${
            bordered ? "bordered" : ""
          }`}
        >
          <thead style={{ backgroundColor: "#126aa6" }}>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-2 py-2 text-left text-xs text-white font-black uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={tbodyClass}>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function TD({ children, ...props }) {
  return (
    <td className="px-2 py-2 whitespace-nowrap" {...props}>
      {children}
    </td>
  );
}
