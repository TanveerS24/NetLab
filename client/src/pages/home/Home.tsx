import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

    const login = () => {
        navigate("/login")
    }
    return (
        <div>
            <h1>Home</h1>
            <button onClick={login}>login</button>
        </div>
    )
}

export default Home