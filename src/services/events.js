import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getCurrentUserId, getIdFromRef } from "./tickets";

/**
 * Get all events where the current user is the organizer
 * @returns {Promise<Array>} Array of event objects or empty array if none found
 */
export const getUserEvents = async () => {
  try {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      console.error("No authenticated user");
      return [];
    }

    const eventsRef = collection(db, "events");
    const eventsQuery = query(eventsRef);
    const querySnapshot = await getDocs(eventsQuery);

    // Filter events where current user is the organizer
    const userEvents = [];
    querySnapshot.forEach((doc) => {
      const event = {
        id: doc.id,
        ...doc.data(),
      };

      // Extract organizer ID from reference
      const organizerId = getIdFromRef(event.organizer);
      if (organizerId === currentUserId) {
        userEvents.push(event);
      }
    });

    return userEvents;
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
};

/**
 * Get ticket count statistics for an event
 * @param {string} eventId - The ID of the event
 * @returns {Promise<{total: number, checkedIn: number}>} Ticket statistics
 */
export const getEventTicketStats = async (eventId) => {
  try {
    const ticketsRef = collection(db, "tickets");
    const ticketsQuery = query(ticketsRef, where("eventId", "==", eventId));
    const querySnapshot = await getDocs(ticketsQuery);

    let total = 0;
    let checkedIn = 0;

    querySnapshot.forEach((doc) => {
      const ticket = doc.data();
      total++;
      if (ticket.checkedIn) {
        checkedIn++;
      }
    });

    return { total, checkedIn };
  } catch (error) {
    console.error("Error fetching ticket stats:", error);
    return { total: 0, checkedIn: 0 };
  }
};

/**
 * Get enriched events data with ticket statistics
 * @returns {Promise<Array>} Array of events with ticket stats sorted by status then date
 */
export const getEnrichedUserEvents = async () => {
  try {
    const events = await getUserEvents();

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const stats = await getEventTicketStats(event.id);
        return {
          ...event,
          ticketStats: stats,
        };
      })
    );

    // Sort by status first (Live Now → Upcoming → Past), then by date
    enrichedEvents.sort((a, b) => {
      const statusA = getEventStatus(a);
      const statusB = getEventStatus(b);

      // Define status priority
      const statusPriority = {
        "Live Now": 0,
        Upcoming: 1,
        Past: 2,
      };

      const priorityA = statusPriority[statusA] ?? 3;
      const priorityB = statusPriority[statusB] ?? 3;

      // If different status, sort by priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Same status, sort by date
      const dateA = new Date(a.startDate || a.date || 0);
      const dateB = new Date(b.startDate || b.date || 0);
      return dateA - dateB;
    });

    return enrichedEvents;
  } catch (error) {
    console.error("Error fetching enriched events:", error);
    return [];
  }
};

/**
 * Get event status (Live Now, Upcoming, Past)
 * @param {Object|string} eventOrDate - Event object or event date string
 * @returns {string} Status label
 */
export const getEventStatus = (eventOrDate) => {
  let eventDate;

  // Handle both event object and date string
  if (typeof eventOrDate === "object" && eventOrDate !== null) {
    eventDate = eventOrDate.startDate || eventOrDate.date;
  } else {
    eventDate = eventOrDate;
  }

  if (!eventDate) return null;

  const now = new Date();
  const eventDateTime = new Date(eventDate);

  // Check if event is today (within same day)
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const eventStart = new Date(
    eventDateTime.getFullYear(),
    eventDateTime.getMonth(),
    eventDateTime.getDate()
  );

  if (eventStart.getTime() === todayStart.getTime()) {
    return "Live Now";
  }

  if (eventDateTime > now) {
    return "Upcoming";
  }

  return "Past";
};

/**
 * Format date for display
 * @param {string} dateString - Date string from Firestore
 * @returns {string} Formatted date (e.g., "Oct 26, 2024")
 */
export const formatEventDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
