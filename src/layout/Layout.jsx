//imports…
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
//styles
import styles from "./layout.module.scss"

export default function Layout(props) {

    return (
        <div className={styles.layout}>
            <Header />
            <div className={styles.body}>
                <Sidebar />
                <div className={styles.content}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}
