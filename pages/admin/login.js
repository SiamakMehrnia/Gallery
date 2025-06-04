import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "12345") {
      localStorage.setItem("adminLoggedIn", "true");
      router.push("/admin");
    } else {
      setError("Falsches Passwort");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80 bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-700">Admin Login</h2>
        <input
          type="password"
          placeholder="Passwort eingeben"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="p-2 text-base font-bold bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}