import { Outlet } from "react-router-dom";
import Header from "./Components/Header";

export default function Layout () {

    return (<><Header />
        <div className="py-4 px-8 flex flex-col min-h-screen bg-gray-50">
            <Outlet />
        </div>
        </>
    )
}