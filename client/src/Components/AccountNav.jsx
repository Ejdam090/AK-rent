import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/Context";
import { AccountNavAdmin } from "./AccountNavAdmin";
import { AccountNavUser } from "./AccountnavUser";

export default function AccountNav() {
  const { pathname } = useLocation();
  const {user} = useContext(UserContext);
  let subpage = pathname.split("/")?.[2];
  if (subpage === undefined) {
    subpage = "profile";
  }

  function linkClases(type = null) {
    let classes = "py-2 px-6 inline-flex gap-1 rounded-full";
    if (type === subpage) {
      classes += " bg-primary text-white ";
    } else {
      classes += " bg-gray-200";
    }
    return classes;
  }
  return (
    <>
      <nav className="w-full flex justify-center mt-8 gap-2">
        <Link className={linkClases("profile")} to={"/account"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          Mój profil
        </Link>
        {user.isAdmin  && (<AccountNavAdmin linkClases={linkClases} />)}
        {!user.isAdmin && (<AccountNavUser linkClases={linkClases} />)}
      </nav>
    </>
  );
}
