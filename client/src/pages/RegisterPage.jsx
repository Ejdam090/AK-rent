import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
 const  toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  async function registerUser(e) {
    e.preventDefault();
    if (handleValidation()) {
      try {
        const { data } = await axios.post("/register", {
          name,
          email,
          password,
        });
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
      
          setRedirect(true);
        
      } catch (e) {
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
      }
    }
  }

  const handleValidation = () => {
    
    if (name.length < 3) {
      toast.error(
        "Nazwa użytkownika nie może być krótsza niż 3 znaki!",
        toastOptions
      );
      return false;
    }
    if (email === "") {
      toast.error("Email jest wymagany!", toastOptions);
      return false;
    }
    if (password.length < 8) {
      toast.error("Hasło nie może być krótsze niż 8 znaków!", toastOptions);
      return false;
    }
    if (password !== confirmedPassword) {
      toast.error("Hasła nie pasują do siebie", toastOptions);
      return false;
    }
    
    return true;
  };
  if (redirect) return <Navigate to={"/login"} />;
  return (
    <div className="mt-4 grow flex items-center justify-around ">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Rejestracja</h1>
        <form className="max-w-md mx-auto " onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Adres email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Powtórz hasło"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
          <button className="primary">Zarejestruj</button>
          <div className="text-center py-2 text-gray-500 ">
            Masz już konto?{" "}
            <Link className="underline text-black" to={"/login"}>
              Zaloguj się!
            </Link>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}
