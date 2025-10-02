//imports…
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
//styles
import styles from "./sidebar.module.scss"

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className={styles.sidebar}>
            <hr className={styles.line}></hr>
            <p className={styles.sidebarHead}>Verify:</p>
            <hr className={styles.line}></hr>
            <p className={`${styles.menuItem} ${useLocation().pathname === "/membership" ? styles.active : ""}`} onClick={() => navigate("/membership")}>Membership</p>
            <p className={`${styles.menuItem} ${useLocation().pathname === "/verifyFestTickets" ? styles.active : ""}`} onClick={() => navigate("/verifyFestTickets")}>Fest Tickets</p>
            <p className={`${styles.menuItem} ${useLocation().pathname === "/verifyEventTickets" ? styles.active : ""}`} onClick={() => navigate("/verifyEventTickets")}>Event Tickets</p>
        </div>
    );
}