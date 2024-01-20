import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/Context";
import LogoPage from "../assets/RentImgLogo.png";
export default function Header() {
  const { user } = useContext(UserContext);
  return (
    <header className="flex  justify-between items-center  p-2 shadow-md shadow-grey-300   ">
      <Link to={"/"} className="flex items-center gap-1">
        <img className=" w-48 " src={LogoPage} alt="Logo" />
      </Link>
      <div className="flex  py-2 px-4 gap-2  ">
        <p className="md:text-2xl text-sm font-headText">
          Już dziś wypożycz najlepszej jakości sprzęt do swoich prac!
        </p>
      </div>
      <Link
        to={user ? "/account" : "/login"}
        className="flex border items-center border-gray-300 rounded-full h-12 py-2 px-4 gap-2 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {!!user && <div>{user.name}</div>}
      </Link>
    </header>
  );
}
