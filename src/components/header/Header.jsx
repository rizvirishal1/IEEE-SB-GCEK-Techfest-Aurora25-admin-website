//imports…
import { useNavigate } from "react-router";
//styles
import styles from "./header.module.scss"

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminAuthToken");
        navigate("/login");
    }

    return (
        <div className={styles.header}>
            <span
                className={styles.logout}
                onClick={handleLogout}
            >
                Logout
            </span>

        </div>
    );
}