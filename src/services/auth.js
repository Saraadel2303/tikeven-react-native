import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const registerUser = async (name, email, password, role, image) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      image,
      createdAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      return { success: false, message: "User data not found in Firestore" };
    }
    const data = userDoc.data();
    const appUser = {
      uid: user.uid,
      name: data.name || "",
      email: data.email || "",
      role: data.role || "user",
      image: data.image || "",
      blocked: data.blocked || false,
    };
    if (appUser.blocked) {
      return { success: false, message: "This user is blocked" };
    }
    return { success: true, user: appUser };
  } catch (error) {
    const code = error && error.code ? String(error.code) : "";
    let message = "Login failed";
    if (code === "auth/user-not-found") message = "User not found";
    else if (
      code === "auth/wrong-password" ||
      code === "auth/invalid-credential"
    )
      message = "Invalid email or password";
    else if (code === "auth/invalid-email") message = "Invalid email";
    else if (code === "auth/missing-password") message = "Password is required";
    else if (code === "auth/too-many-requests")
      message = "Too many attempts. Try again later";
    else if (error && error.message) message = error.message;
    return { success: false, message };
  }
};

export const sendResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    return false;
  }
};

export const verifyResetCode = async (oobCode) => {
  return await verifyPasswordResetCode(auth, oobCode);
};

export const confirmNewPassword = async (oobCode, newPassword) => {
  await confirmPasswordReset(auth, oobCode, newPassword);
  return true;
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};
