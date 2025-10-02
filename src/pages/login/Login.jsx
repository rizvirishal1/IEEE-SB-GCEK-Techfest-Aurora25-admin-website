//imports…
import api from "../../api";
import { useNavigate } from "react-router-dom";
//styles
import styles from "./login.module.scss"

export default function Login() {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
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
    }


    return (
        <div className={styles.login}>
            <h1>Login Page</h1>
            <form className={styles.loginForm} onSubmit={handleSubmit} >
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>

        </div>
    );
}