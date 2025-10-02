//imports…
import api from "../../api";
import { useEffect } from "react";
import { useState } from "react";
//styles
import styles from "./verifyeventtickets.module.scss"

export default function VerifyEventTickets() {

    const [eventTickets, setEventTickets] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("1");

    const handleEventChange = (e) => {
        setSelectedEvent(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("admin/verifyEventTickets", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
                    }
                });
                setEventTickets(response.data);
            } catch (error) {
                console.error("Error fetching event tickets:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.verifyEventTickets}>
            <h1>Verify Event Tickets Page</h1>
            <h2>Event:</h2>
            <select className={styles.eventSelect} value={selectedEvent} onChange={handleEventChange}>
                <option value="1">Event 1</option>
                <option value="2">Event 2</option>
                <option value="3">Event 3</option>
            </select>

            <div className={styles.ticketsContainer}>
                {eventTickets.length === 0 ? (
                    <h2>No tickets pending verification</h2>
                ) : (
                    eventTickets.map((ticket) => (
                        <div className={styles.ticketCard} key={ticket._id}>
                            <h3>Name: {ticket.name}</h3>
                            <p>Event: {ticket.eventName}</p>

                            <div className={styles.buttons}>
                                <button className={styles.approve} onClick={async () => {
                                    try {
                                        await api.post(`admin/verifyEventTickets/${ticket._id}`, { status: "Verified" }, {
                                            headers: {
                                                Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
                                            }
                                        });
                                        setEventTickets(eventTickets.filter(t => t._id !== ticket._id));
                                        window.alert("Ticket approved successfully");
                                    }
                                    catch (err) {
                                        console.error(err);
                                        window.alert("Error approving ticket");
                                    }
                                }}>Approve</button>
                                <button className={styles.reject} onClick={async () => {
                                    try {
                                        await api.post(`admin/verifyEventTickets/${ticket._id}`, { status: "Rejected" }, {
                                            headers: {
                                                Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
                                            }
                                        });
                                        setEventTickets(eventTickets.filter(t => t._id !== ticket._id));
                                        window.alert("Ticket rejected successfully");
                                    }
                                    catch (err) {
                                        console.error(err);
                                        window.alert("Error rejecting ticket");
                                    }
                                }}>Reject</button>
                            </div>
                        </div>
                    ))
                )}
            </div>



        </div>
    );
}