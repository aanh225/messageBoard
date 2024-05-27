const express = require("express");
const app = express();
const port = 5001;
const { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } = require("firebase/firestore");
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const serviceAccount = require("./permissions.json");

const firebaseApp = initializeApp(serviceAccount);
const db = getFirestore(firebaseApp);

app.use(express.json());
const cors = require("cors");
app.use(cors());

app.get("/messages", async (req, res) => {
    try {
        let ret = [];
        const querySnapshot = await getDocs(collection(db, "messages"));
        querySnapshot.forEach((doc) => {
            ret.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        res.status(200).json(ret);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.post("/messages", async (req, res) => {
    try {
        const { username, message } = req.body;
        const docRef = await addDoc(collection(db, "messages"), { username, message, likes: 0 }); // Initialize likes to 0
        res.status(200).json({ message: `Successfully created message with id ${docRef.id}` });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.put("/messages/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { username, message, likes } = req.body;
        await updateDoc(doc(db, "messages", id), {
            ...(username && { username }),
            ...(message && { message }),
            ...(likes !== undefined && { likes }), // Update likes only if provided
        });
        res.status(200).json({ message: "Message updated successfully" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.delete("/messages/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await deleteDoc(doc(db, "messages", id));
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
