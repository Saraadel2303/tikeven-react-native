import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

export default function Events() {
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Events</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Upcoming (3)</Text>

          <View style={styles.sortContainer}>
            <Text style={styles.sortText}>Sort by</Text>
          </View>
        </View>

        {/* Event Cards */}
        <EventCard
          status="Live Now"
          statusColor="#22c55e"
          title="Tech Conference 2024"
          date="Oct 26, 2024"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuBZWDZkGJuTI9RW3vwI5uX19ZCgB3HKxAluXhqux1KerZoUisVliq2kZNTAdwvySmbwjO6SIwbF4600g3rPlaEbTtuus2sFyChu2w1wEp54K6GPOmDp49V-YxhBjXKJ45J3A0EaXw6UGBrvwt8laVqiWCzClbTQil1juMz_j1WjR5YD4-eMGeRE-LLVcC5yeAIRXKg9K3Kb90Y9mNDt0lE_StHNuBuEMZDLnDsEWpCQSftgFJJEx2oqPLaCM1gwU1E_LM79SFh8taw"
          attendees="+497 more"
          checked="157 / 500"
        />

        <EventCard
          title="Design Summit 2024"
          date="Nov 15, 2024"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuB-OtPLHkN1q_kxe7zOdE2yXvDZhfno6wmGL-4XlPUkLwmqkrdRrZRh852DC37mJmPyIzvZL8pxMquHfqYKbkbiM5HFGnC6OWmbWhLaLGApU4smYEHsn3-tMSMQxdrrkzokhfYoouUrINtvieEPIyC-vpc9KThV8OCUyYASPEY-Fz2hso1EHhXMgqhmZdam--0N4N4vPZmF8gROGHfdKWiM2q11PiODwzCqegqzNC7P-wSAaYMG1mvihk7BR04aFjl2r24n-dAn8YKeM"
          attendees="+250 more"
          checked="0 / 250"
        />

        <EventCard
          title="Marketing Week"
          date="Dec 5, 2024"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuBFqLc4rZo3_zpnEodHB3vsKyufb0hiksGyWYI3kx4zbmb9DkfxoXXRwTkuTaX3iUf_m6G--Uv7RdqJkTyyNq5vwKnmTLWDoRwFHo3Ktui30Wg9UTFGBMzsqGRv8wrNqqS6xmsh0o7qMVuWzbmcdQRMTRciS6pOTFUAjv5bDhxYFyWJ_ht6Q87rfC_6wPLknZA3ODpkUcjemVxJ9nYwUijWiJ9dJgdFm2HhnZ70prJV_sDlsZlXdpElAcUkRGM7q2v-9d6sodftNuI"
          attendees="+800 more"
          checked="0 / 800"
        />

      </ScrollView>
    </View>
  );
}

/* ------------------ COMPONENT ------------------- */

function EventCard({ status, statusColor, title, date, image, attendees, checked }) {
  return (
    <View style={styles.card}>

      {/* Top Row */}
      <View style={styles.cardTopRow}>
        
        <View style={styles.cardLeft}>
          <Image
            source={{ uri: image }}
            style={styles.cardImage}
          />

          <View style={{ flex: 1 }}>
            {status && (
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
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

  scroll: {
    padding: 16,
    paddingBottom: 40,
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
