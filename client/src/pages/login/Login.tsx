import { useNavigate } from "react-router-dom"
import { useState, type FormEvent } from "react"


const Login = () => {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(identifier, password);
        if (identifier && password) {
            navigate("/home");
        }
    }

    return (
        <>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Username or email</label>
                    <input type={"text"} value={identifier} placeholder="Username or Email" onChange={(e) => setIdentifier(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type={"password"} value={password} placeholder="*****" onChange={(e) => setPassword(e.target.value)} required></input>
                </div>
                <div>
                    <button type={"submit"}>
                        Log In
                    </button>
                </div>
            </form>
            <div>
                <button onClick={() => navigate("/register")}>New here? click here</button>
            </div>
        </>
    )
}

export default Login