const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/evaluate', async (req, res) => {
    try {
        const promptText = req.body.prompt;
        if (!promptText) return res.status(400).json({ error: "No prompt provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(promptText);
        const response = await result.response;
        
        res.status(200).json({ aiResponse: response.text() });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to evaluate candidate" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});