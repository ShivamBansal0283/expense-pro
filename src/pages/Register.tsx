import { useState } from "react";
import { register } from "@/lib/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(email, password, name || undefined);
      if (res?.token) {
        localStorage.setItem("api_token", res.token);
        window.location.href = "/app";
      } else {
        alert(res?.error || "Register failed");
      }
    } catch (err) {
      console.error(err);
      alert("Register error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Create account</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Name</label>
            <input
              className="w-full mt-1 p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input
              className="w-full mt-1 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="choose a password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
