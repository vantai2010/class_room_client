import { Navigate } from "react-router";
import { path } from "../utils/constant";

function Home() {
    return (
        <>
            <Navigate to={path.LOGIN} />
        </>
    )
}

export default Home;
