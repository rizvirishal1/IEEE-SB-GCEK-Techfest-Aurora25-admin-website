//imports…
//styles
import styles from "./loadinganimation.module.scss"

export default function LoadingAnimation() {

    return (
        <div className={styles.loadingAnimation}>
            <div className={styles.spinner}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}