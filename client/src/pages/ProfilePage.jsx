import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);

  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <h1 className="sr-only">My profile</h1>
      <AccountNav />
      <div className="max-w-md mx-auto mt-10 text-center bg-white rounded-3xl shadow-soft border border-black/5 p-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-ink text-white grid place-items-center text-2xl font-semibold mb-4">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="font-display text-xl">{user.name}</h2>
        <p className="text-ink/50 text-sm mt-1">{user.email}</p>
        <button
          onClick={logout}
          className="bg-ink text-white px-5 py-2.5 rounded-full mt-6 font-medium hover:bg-ink/85 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
