import React from "react";
import { Colors } from "../../utils/colors";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = (e.currentTarget[0] as HTMLInputElement).value;
    const password = (e.currentTarget[1] as HTMLInputElement).value;

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    // Add your login logic here
    const userData = { username, password };
    try {
      await login({ username, password });
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    }
  }

  return (
    <div style={{ backgroundColor: Colors.BACKGROUND }} className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-5">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            Login
          </button>
          <Link to="/register" className="p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition text-center">
            Don't have an account? Register
          </Link>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
