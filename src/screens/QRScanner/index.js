import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Vibration,
  Modal,
  Pressable,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { getAndUpdateTicket } from "../../services/tickets";
import { Ionicons } from "@expo/vector-icons";

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [flash, setFlash] = useState("off");
  const [alertData, setAlertData] = useState({
    visible: false,
    title: "",
    message: "",
  });
  const [lastScanTime, setLastScanTime] = useState(0); // debounce timer
  const recentScans = useRef(new Set()); // track recently scanned tickets

  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const showAlert = (title, message) => {
    setAlertData({ visible: true, title, message });
  };

  const handleScan = async ({ data }) => {
    const now = Date.now();

    // Debounce: ignore if last scan < 2s ago or ticket already scanned recently

    console.log("Scanned data:", isProcessing);
    if (now - lastScanTime < 2000 || isProcessing) return;

    setIsProcessing(true);
    let ticketId;
    try {
      const parsedData = JSON.parse(data);
      ticketId = parsedData.ticket?.id;
      if (!ticketId) throw new Error("Invalid QR code");
      if (recentScans.current.has(ticketId)) {
        showAlert("Info", "This ticket has already been checked in.");
        return;
      }
    } catch {
      showAlert("Error", "Invalid QR code format.");
      return;
    } finally {
      setIsProcessing(false);
    }

    try {
      const result = await getAndUpdateTicket(ticketId, true);

      if (result?.success) {
        Vibration.vibrate(500);
        showAlert(
          "Check-in Successful",
          `Ticket #${
            result.ticket.ticketNumber || ticketId
          } has been checked in!`
        );
        recentScans.current.add(ticketId);
      } else {
        showAlert(
          "Check-in Failed",
          result.message || "Could not update ticket."
        );
      }
    } catch (err) {
      console.error("QR Processing Error:", err);
      showAlert("Error", "An error occurred while processing the QR code.");
    } finally {
      setIsProcessing(false);
      setLastScanTime(now);
    }
  };

  if (!permission) return <Text>Checking camera permissions...</Text>;
  if (!permission.granted)
    return <Button title="Allow camera" onPress={requestPermission} />;

  const laserY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        flash={flash}
        barcodeScannerEnabled={true}
        onBarcodeScanned={handleScan} // always active
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanFrame}>
          <Animated.View
            style={[styles.laser, { transform: [{ translateY: laserY }] }]}
          />
        </View>
        <Text style={styles.scanText}>Place QR code inside the box</Text>
      </View>

      {/* Flashlight toggle */}
      <TouchableOpacity
        style={styles.flashBtn}
        onPress={() => setFlash(flash === "off" ? "on" : "off")}
      >
        <Ionicons
          name={flash === "off" ? "flashlight-outline" : "flashlight"}
          size={28}
          color="#1e40af"
        />
      </TouchableOpacity>

      {/* Custom Styled Alert */}
      <Modal
        visible={alertData.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAlertData({ ...alertData, visible: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{alertData.title}</Text>
            <Text style={styles.modalMessage}>{alertData.message}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setAlertData({ ...alertData, visible: false })}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#1e40af",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  laser: {
    width: "100%",
    height: 3,
    backgroundColor: "#FF0000",
    opacity: 0.9,
  },
  scanText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  flashBtn: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 50,
  },
  scanAgainContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1e40af",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#1e40af",
  },
  modalButton: {
    backgroundColor: "#1e40af",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
