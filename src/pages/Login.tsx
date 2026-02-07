import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.token) {
        localStorage.setItem("api_token", res.token);
        // navigate to dashboard
        window.location.href = "/app";
      } else {
        alert(res?.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Sign in</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input
              className="w-full mt-1 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@local"
            />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/register" className="text-primary underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
