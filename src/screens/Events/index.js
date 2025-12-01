import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getEnrichedUserEvents,
  getEventStatus,
  formatEventDate,
} from "../../services/events";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const enrichedEvents = await getEnrichedUserEvents();
      setEvents(enrichedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const enrichedEvents = await getEnrichedUserEvents();
      setEvents(enrichedEvents);
    } catch (error) {
      console.error("Error refreshing events:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const upcomingCount = events.filter(
    (e) => getEventStatus(e) !== "Past"
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Events</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3662de" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#3662de"
            />
          }
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Text style={styles.topBarTitle}>Upcoming ({upcomingCount})</Text>

            <TouchableOpacity
              style={styles.sortContainer}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <ActivityIndicator size="small" color="#3662de" />
              ) : (
                <Ionicons name="refresh" size={20} color="#3662de" />
              )}
            </TouchableOpacity>
          </View>

          {/* Event Cards */}
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                status={getEventStatus(event)}
                title={event.title}
                date={formatEventDate(event.startDate || event.date)}
                image={event.images[0]}
                checked={`${event.ticketStats?.checkedIn || 0} / ${
                  event.ticketStats?.total || 0
                }`}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No events found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

/* ------------------ COMPONENT ------------------- */

function EventCard({ status, title, date, image, attendees, checked }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Live Now":
        return "#22c55e";
      case "Upcoming":
        return "#f59e0b";
      case "Completed":
        return "#6b7280";
      default:
        return "#8698f0";
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.cardTopRow}>
        <View style={styles.cardLeft}>
          <Image
            source={{ uri: image || "https://via.placeholder.com/56" }}
            style={styles.cardImage}
          />

          <View style={{ flex: 1 }}>
            {status && (
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(status) },
                  ]}
                />
                <Text style={styles.statusText}>{status}</Text>
              </View>
            )}

            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDate}>{date}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Row */}
      <View style={styles.cardBottomRow}>
        <Text style={styles.attendees}>{attendees}</Text>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.checked}>{checked}</Text>
          <Text style={styles.checkedLabel}>Checked-in</Text>
        </View>
      </View>
    </View>
  );
}

/* ------------------ STYLES ------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    padding: 16,
    paddingBottom: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0a1944",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scroll: {
    padding: 16,
    paddingBottom: 40,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },

  emptyText: {
    fontSize: 16,
    color: "#8698f0",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    alignItems: "center",
  },

  topBarTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e3a8a",
  },

  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
  },

  sortText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3662de",
  },

  /* ----------- CARD ------------- */

  card: {
    backgroundColor: "#f8f9ff",
    borderWidth: 1,
    borderColor: "#e0e4f7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: "#000",
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardLeft: {
    flexDirection: "row",
    flex: 1,
    gap: 12,
  },

  cardImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 50,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#15803d",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a1944",
  },

  cardDate: {
    fontSize: 14,
    marginTop: 4,
    color: "#1e3a8a",
  },

  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    alignItems: "flex-end",
  },

  attendees: {
    fontSize: 14,
    color: "#1e3a8a",
  },

  checked: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a1944",
  },

  checkedLabel: {
    fontSize: 12,
    color: "#8698f0",
  },
});
