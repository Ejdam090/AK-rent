import { useContext, useState } from "react";
import { UserContext } from "../Context/Context";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import StuffsPage from "./StuffsPage";
import AccountNav from "../Components/AccountNav";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }
  if (!ready) {
    return <>Loading...</>;
  }
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto mt-6">
          Zalogowano jako {user.name} <br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            {" "}
            Wyloguj
          </button>
        </div>
      )}
      {subpage === "stuffs" && (
        <>
          <StuffsPage />
        </>
      )}
    </>
  );
}
