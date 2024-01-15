import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../Components/Image";

export default function IndexPage() {
  const [stuffs, setStuffs] = useState([]);
  useEffect(() => {
    axios.get("/stuffs").then((response) => {
      setStuffs(response.data);
    });
  }, []);
  return (
    <div className=" mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {stuffs.length > 0 &&
        stuffs.map((stuff) => (
          <Link to={"/stuffs/" + stuff._id} key={stuff._id}>
            <div className=" bg-gray-500 mb-2 rounded-2xl flex">
              {stuff.photos?.[0] && (
                <Image
                  className=" rounded-2xl object-cover aspect-square"
                  src={stuff.photos[0]}
                  alt="photo-image"
                />
              )}
            </div>
            <h2 className=" text-sm  leading-4 ">{stuff.title}</h2>
            <div className=" mt-1 ">
              <span className=" font-bold mr-1">$ {stuff.dayCost}</span>
              / doba
            </div>
          </Link>
        ))}
    </div>
  );
}
