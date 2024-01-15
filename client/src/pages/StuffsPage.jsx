import { Link } from "react-router-dom";
import AccountNav from "../Components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from './../Components/Image';

export default function StuffsPage() {
  const [stuff, setStuff] = useState([]);

  useEffect(() => {
    axios.get("/user-stuffs").then(({ data }) => {
      setStuff(data);
    });
  }, []);
  return (
    <div className="mt-8 mx-auto w-full">
      <AccountNav />
      <div className=" text-center">
        <Link
          className=" inline-flex gap-1 bg-primary text-white mt-4 py-2 px-4 rounded-full "
          to={"/account/stuffs/new"}
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Dodaj nowe urządzenie
        </Link>
      </div>
      <div className=" mt-4 ">
        {stuff.length > 0 &&
          stuff.map((stuf) => (
            <Link to={"/account/stuffs/" + stuf._id} key={stuf._id}>
              {" "}
              <div className=" flex bg-gray-100 cursor-pointer bg-grey-100 p-4 my-2 gap-4 rounded-2xl ">
                <div className=" flex w-32  h-32 bg-gray-300 grow shrink-0">
                  {stuf.photos.length && (
                    <Image
                      className="object-cover"
                      src={ stuf.photos[0]}
                      alt="photos"
                    />
                  )}
                </div>
                <div className="grow-0 shrink ">
                  <h2 className="text-xl ">{stuf.title}</h2>
                  <p className="text-sm mt-2">{stuf.description}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
