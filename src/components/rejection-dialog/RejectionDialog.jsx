//imports…
import { Dialog } from "@mui/material";
//styles
import styles from "./rejectiondialog.module.scss"

export default function RejectionDialog({ isRejectionDialogOpen,
    handleClose,
    handleRejection,
    isRejectionSubmitionLoading,
    handleChange,
    reasonForRejection
}) {

    return (
        <Dialog open={isRejectionDialogOpen} onClose={handleClose}>
            <div className={styles.rejectionDialog}>
                <h2>Rejection Reason</h2>
                <textarea
                    placeholder="Enter reason for rejection"
                    className={styles.rejectionTextarea}
                    value={reasonForRejection}
                    onChange={handleChange}
                ></textarea>
                <button
                    className={styles.submitRejectionBtn}
                    onClick={handleRejection}
                    disabled={isRejectionSubmitionLoading}
                >
                    {isRejectionSubmitionLoading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </Dialog>
    );
}