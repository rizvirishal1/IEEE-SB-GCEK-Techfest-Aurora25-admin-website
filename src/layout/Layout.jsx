//imports…
import Sidebar from "../components/sidebar/Sidebar";
//styles
import styles from "./layout.module.scss"

export default function Layout(props) {

    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.content}>
                {props.children}
            </div>
        </div>
    );
}
