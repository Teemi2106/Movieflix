import React, { useState } from "react";
import {
  auth,
  firestore,
  createUserWithEmailAndPassword,
} from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../CSS/Signin.css";

const Signup = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userId = user.uid;

      await setDoc(doc(firestore, "users", userId), { name, email });

      const userDoc = await getDoc(doc(firestore, "users", userId));
      if (userDoc.exists()) {
        setUser({
          ...user,
          ...userDoc.data(),
        });
        navigate("/dashboard");
      } else {
        throw new Error("User data not found in Firestore");
      }
    } catch (error) {
      setError("Failed to create an account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div id="signin-container">
      <form id="signin-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="password-toggle"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <input type="submit" value={loading ? "Signing Up..." : "Sign Up"} />

        {error && <p className="error-message">{error}</p>}

        {/* Link to sign in */}
        <p>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
