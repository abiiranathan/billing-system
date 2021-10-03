import React from "react";

export default function Paginator({ prev, next, page, setPage, pages, count }) {
  if (count === 0) return null;

  return (
    <nav className="flex items-center mt-1 border border-gray-100 bg-blue-200 py-1 px-3">
      <button
        type="button"
        className="px-3 py-1 border bg-[rgb(18, 106, 166)] border-r-0 last-of-type:border-r hover:bg-[rgb(18, 106, 166)]"
        onClick={() => {
          setPage(1);
        }}
      >
        1
      </button>

      <button
        type="button"
        disabled={!prev}
        className="px-3 py-1 border bg-[rgb(18, 106, 166)] last-of-type:border-r hover:bg-[rgb(18, 106, 166)]"
        onClick={() => {
          setPage(page - 1);
        }}
      >
        Prev
      </button>

      <button type="button" className="bg-blue-400 px-3 py-1 text-white pointer-events-none">
        Page {page} of {pages}
      </button>

      <button
        type="button"
        disabled={!next || page === pages}
        className="px-3 py-1 border bg-[rgb(18, 106, 166)] last-of-type:border-r hover:bg-[rgb(18, 106, 166)]"
        onClick={() => {
          setPage(page + 1);
        }}
      >
        Next
      </button>

      <button
        type="button"
        className="px-3 py-1 border bg-gray-50 last-of-type:border-r hover:bg-gray-50"
        onClick={() => {
          setPage(pages);
        }}
      >
        {pages}
      </button>

      <button type="button" className="pointer-events-none ml-auto">
        Total Records: {count}
      </button>
    </nav>
  );
}
