import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Drugs from "./components/Drugs";
import Lab from "./components/Lab";
import Consumables from "./components/Consumables";
import Services from "./components/Services";
import logo from "./logo.jpg";
import { useEffect, useState } from "react";
import Home from "./components/Home";
import BillingQueue from "./components/BillingQueue";
import { BillingContext } from "./BillingContext";
import Login from "./components/Login";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      cacheTime: 5 * 60 * 1000,
      retry: false,
    },
  },
});

async function fetchUser() {
  return (
    await axios.get("/api/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
  ).data;
}

function App() {
  const [billingQueue, setBillingQueue] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetchUser()
      .then(user => {
        setUser(user);
        setLoadingUser(false);
      })
      .catch(() => {
        setLoadingUser(false);
        setUser(null);
      });
  }, []);

  const addToBill = item => {
    if (!billingQueue.find(queuedItem => item.id === queuedItem.id)) {
      setBillingQueue(prev => [...prev, item]);
    } else {
      alert(`${item.name} has already been added to the bill`);
    }
  };

  const removeFromBill = itemId => {
    setBillingQueue(prev => prev.filter(queuedItem => itemId != queuedItem.id));
  };

  const clearQueue = () => setBillingQueue([]);

  if (loadingUser) return <div className="p-3 text-center">Checking auth state...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContext.Provider value={{ user }}>
          <div className="App w-screen h-screen overflow-y-auto p-1 md:p-4">
            <main className="px-0 md:px-8 text-center">
              <Link to="/" className="inline-block">
                <img src={logo} className="lg:h-[100px] max-h-24 mx-auto" />
              </Link>
              {user ? (
                <BillingContext.Provider value={{ billingQueue, addToBill }}>
                  <div className="my-3 flex justify-between flex-col sm:flex-row">
                    <p className="text-gray-400">
                      Logged In As:
                      <span className="font-black inline-block ml-2">
                        {user.name} ({user.role})
                      </span>
                    </p>
                    <button
                      className="text-blue-600 border py-1 px-3 rounded-sm"
                      onClick={() => {
                        localStorage.setItem("token", null);
                        setUser(null);
                      }}
                    >
                      Logout
                    </button>

                    {user.role === "ADMIN" && (
                      <a
                        href="http://localhost:5555"
                        className="text-blue-600 border py-1 px-3 rounded-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Studio
                      </a>
                    )}
                  </div>
                  <Home />
                  <BillingQueue
                    items={billingQueue}
                    removeItem={removeFromBill}
                    clearQueue={clearQueue}
                  />
                  <Switch>
                    <Route path="/drugs" component={Drugs} exact />
                    <Route path="/lab" component={Lab} exact />
                    <Route path="/services" component={Services} exact />
                    <Route path="/consumables" component={Consumables} exact />
                  </Switch>
                </BillingContext.Provider>
              ) : (
                <Login setUser={setUser} />
              )}
            </main>
          </div>
        </AuthContext.Provider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
