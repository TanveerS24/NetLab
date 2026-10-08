import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { healthAPI } from "../../api/health.api.ts";

const Home = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const data = await healthAPI();
            console.log(data);
        }
        loadData();
    }, []);

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