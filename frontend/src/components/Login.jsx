import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";

const handleLogin = async data => {
  const res = await axios.post("/api/login", JSON.stringify(data));
  return res.data;
};

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const saveMutation = useMutation(handleLogin, {
    onSuccess: data => {
      setUser(data.user);
      localStorage.setItem("token", data.token);
    },
    onError: () => {
      setUser(null);
      localStorage.setItem("token", null);
    },
  });

  return (
    <div className="mt-2 max-w-md mx-auto bg-gray-200 drop-shadow shadow-lg rounded-lg px-4 py-4 md:p-8">
      <h2 className="text-3xl py-2 text-indigo-900">Login</h2>
      <form
        method="post"
        className="text-justify"
        onSubmit={e => {
          e.preventDefault();
          saveMutation.mutate({ username, password });
        }}
      >
        <section className="mt-3">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            value={username}
            id="username"
            onChange={e => setUsername(e.target.value)}
            required
            placeholder="Enter username"
          />
        </section>

        <section className="mt-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            id="password"
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Enter password"
          />
        </section>

        <section className="mt-3 text-right">
          <button
            disabled={saveMutation.isLoading}
            className="px-3 py-1 border bg-blue-700 text-white rounded"
          >
            {saveMutation.isLoading ? "Logging in..." : "LOGIN"}
          </button>
        </section>
        <section className="py-2 text-red-700">
          {saveMutation.isError && <p>Invalid login credentials!</p>}
        </section>
      </form>
    </div>
  );
}
