//imports…
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
//styles
import styles from "./login.module.scss"

export default function Login() {
    const navigate = useNavigate();

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            const response = await api.post("admin/login", {
                username: e.target[0].value,
                password: e.target[1].value,
            });
            window.alert("Login successful");
            localStorage.setItem("adminAuthToken", response.data.token);
            navigate("/membership");

        }
        catch (err) {
            console.error(err);
            window.alert("Login failed");
        }
        finally {
            setIsLoggingIn(false);
        }
    }


    return (
        <div className={styles.login}>
            <form className={styles.loginForm} onSubmit={handleSubmit} >
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button
                    type="submit"
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? "Logging in..." : "Login"}
                </button>
            </form>

        </div>
    );
}