import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function StuffWidget({ stuff }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState("");

  let numberOfDays = 0;
  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisStuff(e) {
    e.preventDefault();
    const response = await axios.post("/booking", {
      checkIn,
      checkOut,
      name,
      mobile,
      stuff: stuff._id,
      price: numberOfDays * stuff.dayCost,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className=" bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">Kwota : {stuff.dayCost} zł / doba</div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Dzień rozpoczęcia</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
              }}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Dzień zakończenia</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value);
              }}
            />
          </div>
        </div>
        {numberOfDays > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Twoje imię i nazwisko </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Numer telefonu: </label>
            <input
              type="tel"
              placeholder="123 456 789"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        )}
      </div>
      <button onClick={(e) => bookThisStuff(e)} className="primary mt-4">
        Złóż zamówienie 
        {numberOfDays > 0 && <span> {numberOfDays * stuff.dayCost} zł</span>}
      </button>
    </div>
  );
}
