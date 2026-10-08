import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";

const Register = () => {
    const navigate = useNavigate();

    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username && email && password) {
            navigate("/home");
        }
    }
    return (
        <div>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username</label>
                    <input type={"text"} value={username} placeholder="Username" onChange={(e) => setUserName(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type={"password"} value={password} placeholder="*****" onChange={(e) => setPassword(e.target.value)} required></input>
                </div>
                <div>
                    <label>Email</label>
                    <input type={"email"} value={email} placeholder="your email address" onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div>
                    <button type={"submit"}>
                        Log In
                    </button>
                </div>
            </form>
            <div>
                <button onClick={() => navigate("/login")}>Already a user? Click here</button>
            </div>
        </div>

    )
}

export default Register