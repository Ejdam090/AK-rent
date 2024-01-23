import { useEffect, useState } from "react";
import axios from "axios";
import PhotoUploader from "./PhotosUploader";
import Perks from "./Perks";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function StuffsForm() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [dayCost, setDayCost] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/stuffs/` + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setDayCost(data.dayCost);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
    });
  }, [id]);
  async function saveStuff(e) {
    e.preventDefault();
    const stuffData = {
      title,
      dayCost,
      addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
    };
    if (id) {
      await axios.put("/add-new-stuff", {
        id,
        ...stuffData,
      });
      setRedirect(true);
    } else {
      await axios.post("/add-new-stuff", stuffData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/stuffs"} />;
  }

  return (
    <div className="">
      <AccountNav />
      <form className="max-w-4xl mx-auto" onSubmit={saveStuff}>
        <h2 className="text-2xl mt-4 py-4">Nazwa sprzętu</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tytuł wyświetlany"
        />
        <h2 className="text-2xl mt-4 py-4">Dzienny koszt wypożyczenia</h2>
        <input
          type="number"
          placeholder="Kwota"
          value={dayCost}
          onChange={(e) => setDayCost(e.target.value)}
        />
        <h2 className="text-2xl mt-4 py-4">Zdjęcia</h2>
        <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        <h2 className="text-2xl mt-4 py-4">Opis</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h2 className="text-2xl mt-4 py-4">Dodatkowe informacje</h2>
        <Perks selected={perks} onChange={setPerks} />

        <button className="primary mt-4">Save</button>
      </form>
    </div>
  );
}
