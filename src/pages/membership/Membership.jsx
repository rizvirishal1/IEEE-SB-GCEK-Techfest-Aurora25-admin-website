//imports…
import api from "../../api"
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useState } from "react";
import RejectionDialog from "../../components/rejection-dialog/RejectionDialog";
//styles
import styles from "./membership.module.scss"

export default function Membership() {
    const navigate = useNavigate();

    const [usersForVerification, setUsersForVerification] = useState([]);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [reasonForRejection, setReasonForRejection] = useState("");
    const [rejectedUser, setRejectedUser] = useState(null);
    const [isRejectionSubmitionLoading, setIsRejectionSubmitionLoading] = useState(false);
    const [isApproveBtnLoading, setIsApproveBtnLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adminAuthToken = localStorage.getItem("adminAuthToken");
                const result = await api.get("admin/verifyMembership", {
                    headers: {
                        Authorization: `Bearer ${adminAuthToken}`
                    }
                });
                setUsersForVerification(result.data);
            }
            catch (err) {
                console.log(err);
                window.alert("Error fetching membership data");
                navigate("/login");

            }

        }
        fetchData();
    }, []);

    const handleChange = (e) => {
        setReasonForRejection(e.target.value);
    }

    const handleRejection = async () => {
        setIsRejectionSubmitionLoading(true);
        if (!rejectedUser) return;
        try {
            await api.post(`admin/verifyMembership/${rejectedUser._id}`, { status: "Rejected", reason: reasonForRejection }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
                }
            });
            setUsersForVerification(usersForVerification.filter(u => u._id !== rejectedUser._id));
            window.alert("Membership rejected successfully");
            setIsRejectionDialogOpen(false);
            setRejectedUser(null);
        } catch (err) {
            console.error(err);
            window.alert("Error rejecting membership");
        } finally {
            setIsRejectionSubmitionLoading(false);
        }
    }




    return (
        <div className={styles.membership}>
            <h1>Membership Page</h1>
            <div className={styles.membershipContainer}>
                {usersForVerification.length === 0 ? <h2>No users pending verification</h2> : usersForVerification.map((user) => (
                    <div className={styles.userCard} key={user._id}>
                        <h3>Name: {user.name}</h3>
                        <p>Mobile: {user.mobile}</p>
                        <p>Membership ID: {user.IEEEMemberId}</p>
                        <div className={styles.buttons}>
                            <button className="approveBtn" onClick={async () => {
                                try {
                                    setIsApproveBtnLoading(true);
                                    const adminAuthToken = localStorage.getItem("adminAuthToken");
                                    await api.post(`admin/verifyMembership/${user._id}`, { status: "Verified" }, {
                                        headers: {
                                            Authorization: `Bearer ${adminAuthToken}`
                                        }
                                    });
                                    setUsersForVerification(usersForVerification.filter(u => u._id !== user._id));
                                    window.alert("User approved successfully");
                                }
                                catch (err) {
                                    window.alert("Error approving user");
                                } finally {
                                    setIsApproveBtnLoading(false);
                                }
                            }}>
                                {isApproveBtnLoading ? "Approoving..." : "Approve"}
                            </button>
                            <button
                                className="rejectBtn"
                                onClick={() => {
                                    setIsRejectionDialogOpen(true);
                                    setRejectedUser(user);
                                }
                                }
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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