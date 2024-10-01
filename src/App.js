import { Routes, Route, useNavigate } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import SignIn from "./Pages/SignIn";
import Dashboard from "./Pages/Dashboard";
import Signup from "./Pages/Signup";
import Watchlist from "./Pages/Watchlist";
import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { auth } from "./firebaseConfig";
import { firestore } from "./firebaseConfig";

function App() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleSignin = () => {
    navigate("/signin");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setUser({ ...user, ...userDoc.data() });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Routes>
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/watchlist" element={<Watchlist user={user} />} />{" "}
          </>
        ) : (
          <>
            <Route
              path="/signin"
              element={<SignIn user={user} setUser={setUser} />}
            />
            <Route
              path="/signup"
              element={<Signup user={user} setUser={setUser} />}
            />
            <Route
              path="/"
              element={<Homepage handleSignin={handleSignin} />}
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
