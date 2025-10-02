//imports…
import { useEffect } from "react";
import { useState } from "react";
import api from "../../api";
import Dialog from '@mui/material/Dialog';
import RejectionDialog from "../../components/rejection-dialog/RejectionDialog";
//styles
import styles from "./verifyfesttickets.module.scss"

export default function VerifyFestTickets() {

    const [festTickets, setFestTickets] = useState([]);
    const [isScreenshotDialogOpen, setIsScreenshotDialogOpen] = useState(false);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [selectedScreenshot, setSelectedScreenshot] = useState("");
    const [rejectedTicket, setRejectedTicket] = useState(null);
    const [isRejectionSubmitionLoading, setIsRejectionSubmitionLoading] = useState(false);
    const [reasonForRejection, setReasonForRejection] = useState("");
    const [isApproveBtnLoading, setIsApproveBtnLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("admin/verifyFestTickets", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
                    }
                });
                setFestTickets(response.data);

            } catch (error) {
                window.alert("error");
            }
        }

        fetchData();
    }, [])

    const handleViewPayment = (screenshotUrl) => {
        setSelectedScreenshot(screenshotUrl);
        console.log(screenshotUrl);
        setIsScreenshotDialogOpen(true);
    }

    const handleApproval = async (ticket, status) => {
        setIsApproveBtnLoading(true);
        try {
            await api.post(`admin/verifyFestTicket/${ticket._id}`, { status: status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
                }
            });
            setFestTickets(festTickets.filter(t => t._id !== ticket._id));
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
        const reason = document.querySelector(`.${styles.rejectionTextarea}`).value;
        try {
            await api.post(`admin/verifyFestTicket/${rejectedTicket._id}`, { status: "Rejected", reason: reasonForRejection }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
                }
            });
            setFestTickets(festTickets.filter(t => t._id !== rejectedTicket._id));
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



    return (
        <div className={styles.verifyFestTickets}>
            <h1>Verify Fest Tickets Page</h1>

            <div className={styles.ticketsContainer}>
                {festTickets.length === 0 ? (
                    <h2>No tickets pending verification</h2>
                ) : (
                    festTickets.map((ticket) => (
                        <div className={styles.ticketCard} key={ticket._id}>
                            <h3> {ticket.isEarlyBird ? "Early Bird" : "Regular"}</h3>
                            <p>User Name:  {ticket.userName}</p>
                            <p>Mobile: {ticket.mobile}</p>
                            <button
                                onClick={() => handleViewPayment(ticket.paymentScreenshot)}
                            >
                                View Payment
                            </button>
                            <div className={styles.buttons}>
                                <button
                                    className="approveBtn"
                                    disabled={isApproveBtnLoading}
                                    onClick={() => handleApproval(ticket, "Verified")}
                                >
                                    {isApproveBtnLoading ? "Approoving..." : "Approve"}
                                </button>
                                <button
                                    className="rejectBtn"
                                    onClick={() => {
                                        setIsRejectionDialogOpen(true)
                                        setRejectedTicket(ticket);
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isScreenshotDialogOpen} onClose={() => setIsScreenshotDialogOpen(false)}>
                <img src={selectedScreenshot} alt="Payment Screenshot" className={styles.screenshotImage} />
            </Dialog>

            <RejectionDialog
                isRejectionDialogOpen={isRejectionDialogOpen}
                handleClose={() => setIsRejectionDialogOpen(false)}
                handleRejection={handleRejection}
                isRejectionSubmitionLoading={isRejectionSubmitionLoading}
                handleChange={handleChange}
                reasonForRejection={reasonForRejection}
            />

        </div>
    );
}