import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";

const Register = () => {
    const navigate = useNavigate();

    const [Username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = (e: FormEvent<HTMLFormElement>) => {

    }
    return (
        <div>
            <h1>Register</h1>
        </div>
    )
}

export default Register