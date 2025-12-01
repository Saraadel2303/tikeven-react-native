import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

/**
 * Get the current authenticated user's ID
 * @returns {string|null} The current user's UID or null if not authenticated
 */
export const getCurrentUserId = () => {
  return auth.currentUser?.uid || null;
};

/**
 * Get a ticket by ID
 * @param {string} ticketId - The ID of the ticket to retrieve
 * @returns {Promise<Object|null>} The ticket data or null if not found
 */
export const getTicketById = async (ticketId) => {
  try {
    const ticketRef = doc(db, "tickets", ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (ticketSnap.exists()) {
      return {
        id: ticketSnap.id,
        ...ticketSnap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting ticket:", error);
    return null;
  }
};

/**
 * Get an event by ID
 * @param {string} eventId - The ID of the event to retrieve
 * @returns {Promise<Object|null>} The event data or null if not found
 */
export const getEventById = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      return {
        id: eventSnap.id,
        ...eventSnap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting event:", error);
    return null;
  }
};

/**
 * Extract ID from a Firestore reference
 * @param {Object} ref - The Firestore reference object or string path
 * @returns {string|null} The ID extracted from the reference or null
 */
export const getIdFromRef = (ref) => {
  if (!ref) return null;
  if (ref.path) {
    const parts = ref.path.split("/");
    return parts[parts.length - 1];
  }
  if (typeof ref === "string") {
    const parts = ref.split("/");
    return parts[parts.length - 1];
  }

  return null;
};

/**
 * Check if the current user is the owner of the event
 * @param {Object} event - The event object
 * @returns {boolean} True if current user owns the event, false otherwise
 */
export const isEventOwner = (event) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return false;
  const organizerId = getIdFromRef(event.organizer);

  return organizerId === currentUserId;
};

/**
 * Update ticket checkedIn status
 * @param {string} ticketId - The ID of the ticket to update
 * @param {boolean} checkedIn - The new checkedIn status
 * @returns {Promise<boolean>} True if update was successful, false otherwise
 */
export const updateTicketCheckedIn = async (ticketId, checkedIn) => {
  try {
    const ticketRef = doc(db, "tickets", ticketId);
    await updateDoc(ticketRef, {
      checkedIn: checkedIn,
      checkedInAt: checkedIn ? new Date().toString() : null,
    });
    return true;
  } catch (error) {
    console.error("Error updating ticket:", error);
    return false;
  }
};

/**
 * Get ticket by ID and update checkedIn status in one operation
 * @param {string} ticketId - The ID of the ticket
 * @param {boolean} checkedIn - The new checkedIn status
 * @returns {Promise<{success: boolean, ticket: Object|null, message: string}>} The result with ticket data or error message
 */
export const getAndUpdateTicket = async (ticketId, checkedIn = true) => {
  try {
    // First get the ticket
    const ticket = await getTicketById(ticketId);

    if (!ticket) {
      return {
        success: false,
        ticket: null,
        message: "Ticket not found",
      };
    }

    // Get the event associated with this ticket
    if (!ticket.eventId) {
      return {
        success: false,
        ticket: null,
        message: "Ticket is not associated with an event",
      };
    }

    const event = await getEventById(ticket.eventId);

    if (!event) {
      return {
        success: false,
        ticket: null,
        message: "Event not found",
      };
    }

    // Check if current user is the owner of the event
    if (!isEventOwner(event)) {
      console.log(
        "Current user is not the event owner",
        event.ownerId,
        getCurrentUserId()
      );
      return {
        success: false,
        ticket: null,
        message: "You are not the organizer of this event",
      };
    }

    // Check if already checked in
    if (ticket.checkedIn && checkedIn) {
      return {
        success: false,
        ticket,
        message: "This ticket has already been checked in",
      };
    }

    // Then update it
    const updateSuccess = await updateTicketCheckedIn(ticketId, checkedIn);

    if (updateSuccess) {
      return {
        success: true,
        ticket: {
          ...ticket,
          checkedIn: checkedIn,
          checkedInAt: checkedIn ? new Date() : null,
        },
        message: "Check-in successful",
      };
    }

    return {
      success: false,
      ticket: null,
      message: "Failed to update ticket",
    };
  } catch (error) {
    console.error("Error in getAndUpdateTicket:", error);
    return {
      success: false,
      ticket: null,
      message: error.message || "An error occurred",
    };
  }
};
