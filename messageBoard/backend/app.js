const express=require('express');
const app=express();
const port=5000;
app.use(express.json());
const db = require("./firebase");
const { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } = require("firebase/firestore");

const cors = require("cors");
app.use(cors());


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// get all messages
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

// add a message
app.post("/messages", async (req, res) => {
    try {
        const username = req.body.username;
        const message = req.body.message;
        const docRef = await addDoc(collection(db, "messages"), {
            username: username,
            message: message,
        });
        res.status(200).json({ message: `Successfully created message with id ${docRef.id}` })
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// edit a message
app.put("/messages/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { username, message } = req.body;
        await updateDoc(doc(db, "messages", id), {
            username: username,
            message: message,
        });
        res.status(200).json({ message: "Message updated successfully" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// delete a message
app.delete("/messages/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await deleteDoc(doc(db, "messages", id));
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});
