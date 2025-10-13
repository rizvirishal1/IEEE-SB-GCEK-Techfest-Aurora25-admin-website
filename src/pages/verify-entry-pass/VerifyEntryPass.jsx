//imports…
import api from "../../api";
import { useEffect } from "react";
import { useState } from "react";
import { Dialog } from "@mui/material";
import dateString2humanReadable from "../../services/dateString2humanReadable";
import RejectionDialog from "../../components/rejection-dialog/RejectionDialog";
import LoadingAnimation from "../../components/loading-animation/LoadingAnimation";
//styles
import styles from "./verifyentrypass.module.scss"


export default function VerifyEntryPass() {

    const [entryPassesForVerification, setEntryPassesForVerification] = useState([]);
    const [paymentScreenshot, setPaymentScreenshot] = useState("")
    const [isPaymentScreenshotOpen, setIsPaymentScreenshotOpen] = useState(false)
    const [noOfEntryPassesBought, setNoOfEntryPassesBought] = useState(0)
    const [isApproveBtnLoading, setIsApproveBtnLoading] = useState(false)
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)
    const [rejectedTicket, setRejectedTicket] = useState(null)
    const [reasonForRejection, setReasonForRejection] = useState("")
    const [isRejectionSubmitionLoading, setIsRejectionSubmitionLoading] = useState(false)
    const [isDataLoading, setIsDataLoading] = useState(true)

    const handleApproval = async (ticket, status) => {
        setIsApproveBtnLoading(true);
        try {
            await api.post(`admin/verifyEntryPass/${ticket._id}`, { status: status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
                }
            });
            setEntryPassesForVerification(entryPassesForVerification.filter(t => t._id !== ticket._id));
            window.alert("Ticket approved successfully");

        } catch (err) {
            console.error(err);
            window.alert("Error approving ticket");
        } finally {
            setIsApproveBtnLoading(false)
        }
    }

    const handleChange = (e) => {
        setReasonForRejection(e.target.value);
    }

    const handleRejection = async () => {
        setIsRejectionSubmitionLoading(true);
        if (!rejectedTicket) return;
        try {
            await api.post(`admin/verifyEntryPass/${rejectedTicket._id}`, { status: "Rejected", reason: reasonForRejection }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
                }
            });
            setEntryPassesForVerification(entryPassesForVerification.filter(t => t._id !== rejectedTicket._id));
            window.alert("Ticket rejected successfully");
            setIsRejectionDialogOpen(false);
            setRejectedTicket(null);
        } catch (err) {
            console.error(err);
            window.alert("Error rejecting ticket");
        } finally {
            setIsRejectionSubmitionLoading(false);
        }
    }


    useEffect(() => {
        const fetchEntryPasses = async () => {
            try {
                setIsDataLoading(true)
                const adminAuthToken = localStorage.getItem("adminAuthToken");
                const response = await api.get("/admin/entryPassesForVerification", {
                    headers: {
                        Authorization: `Bearer ${adminAuthToken}`,
                    },
                });
                setEntryPassesForVerification(response.data.entryPassesForVerification || []);
                setNoOfEntryPassesBought(response.data.noOfEntryPassesBought || 0)
            } catch (error) {
                console.error("Error fetching entry passes:", error);
            } finally {
                setIsDataLoading(false)
            }
        };

        fetchEntryPasses();
    }, []);

    return (
        <div className={styles.verifyEntryPass}>
            <span>Total no of entry passes bought: {noOfEntryPassesBought}</span>

            <div className={styles.scrollableContainer}>

                {!isDataLoading && entryPassesForVerification.length === 0 && (
                    <h2>No entry passes pending verification</h2>
                )}

                {isDataLoading && <LoadingAnimation />}

                {entryPassesForVerification.map((entryPass) => (
                    <div className={styles.entryPassCard} key={entryPass._id}>
                        <span>User: {entryPass.userName}</span>
                        <span>Mobile: {entryPass.mobile}</span>
                        <span>Purchased At: {dateString2humanReadable(entryPass.purchasedAt)}</span>
                        <button onClick={() => {
                            setPaymentScreenshot(entryPass.paymentScreenshot);
                            setIsPaymentScreenshotOpen(true);
                        }}
                            className={styles.viewPaymentBtn}
                        >
                            View Payment / ID
                        </button>

                        <div className={styles.buttons}>
                            <button
                                className="approveBtn"
                                disabled={isApproveBtnLoading}
                                onClick={() => handleApproval(entryPass, "Verified")}
                            >
                                {isApproveBtnLoading ? "Approoving..." : "Approve"}
                            </button>
                            <button
                                className="rejectBtn"
                                onClick={() => {
                                    setIsRejectionDialogOpen(true)
                                    setRejectedTicket(entryPass);
                                }}
                            >
                                Reject
                            </button>
                        </div>

                    </div>
                ))}

            </div>

            <Dialog open={isPaymentScreenshotOpen} onClose={() => setIsPaymentScreenshotOpen(false)}>
                <img className={styles.paymentScreenshot} src={paymentScreenshot} alt="Payment Screenshot" />
            </Dialog>

            <RejectionDialog
                isRejectionDialogOpen={isRejectionDialogOpen}
                handleClose={() => setIsRejectionDialogOpen(false)}
                handleRejection={handleRejection}
                isRejectionSubmitionLoading={isRejectionSubmitionLoading}
                handleChange={handleChange}
                reasonForRejection={reasonForRejection}
            />

        </div >
    );
}