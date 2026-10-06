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
            <div className="grid grid-cols-2 min-h-screen">
                <div className="grid grid-rows-[auto_1fr]">
                    <div className="bg-transparent text-slate-900">
                        <div >NetLab</div>
                        <div>Visually Learn stuff</div>
                    </div>
                    <div className="bg-white text-slate-900">
                        <div>Welcome</div>
                    </div>
                </div>
                <div className="bg-blue-100 text-blue-900">
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>Identifier</label>
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
                </div>
            </div>
        </>
    )
}

export default Login