//imports…
import { useEffect } from "react";
import { useState } from "react";
import api from "../../api";
import Dialog from '@mui/material/Dialog';
import dateString2humanReadable from "../../services/dateString2humanReadable"
import RejectionDialog from "../../components/rejection-dialog/RejectionDialog";
//styles
import styles from "./verifyfesttickets.module.scss"

export default function VerifyFestTickets() {

    const [festTickets, setFestTickets] = useState([]);
    const [sortedTickets, setSortedTickets] = useState([])
    const [isScreenshotDialogOpen, setIsScreenshotDialogOpen] = useState(false);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [selectedScreenshot, setSelectedScreenshot] = useState("");
    const [selectedTicketForScreenshot, setSelectedTicketForScreenshot] = useState("")
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
                // Sort tickets by purchasedAt in ascending order
                const sortedTickets = [...response.data].sort((a, b) => new Date(a.purchasedAt) - new Date(b.purchasedAt));
                setSortedTickets(sortedTickets)

            } catch (error) {
                window.alert("error");
            }
        }

        fetchData();
    }, [])

    const handleViewPayment = (ticket) => {
        setSelectedScreenshot(ticket.paymentScreenshot);
        setSelectedTicketForScreenshot(ticket)
        setIsScreenshotDialogOpen(true);
    }

    const handleApproval = async (ticket, status) => {
        if (ticket.IEEEMemberStatus === "Verification Pending") {
            window.alert("Please verify the IEEE Membership of this user first")
            return;
        }
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

                <span>No of Fest Tickets Bought(Regular): {sortedTickets.filter(ticket => !ticket.isEarlyBird).length}</span>

                {sortedTickets.length === 0 ? (
                    <h2>No tickets pending verification</h2>
                ) : (
                    sortedTickets.map((ticket) => (
                        <div className={styles.ticketCard} key={ticket._id}>
                            <h3> {ticket.isEarlyBird ? "Early Bird" : "Regular"}</h3>
                            <p>User Name:  {ticket.userName}</p>
                            <p>Mobile: {ticket.mobile}</p>
                            <p>IEEE Member Status: {ticket.IEEEMemberStatus}</p>
                            <p>Purchased At: {dateString2humanReadable(ticket.purchasedAt)}</p>
                            <button
                                onClick={() => handleViewPayment(ticket)}
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
                                        if (ticket.IEEEMemberStatus === "Verification Pending") {
                                            window.alert("Please Verify the IEEE Membership of this user first")
                                            return;
                                        }
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
                <p className={styles.screenshotDialogTitle}>Payment Screenshot for {selectedTicketForScreenshot.userName}</p>
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