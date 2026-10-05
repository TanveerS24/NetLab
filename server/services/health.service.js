import mongoose from "mongoose";

const healthStatus = (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState ? "connected" : "disconnected",
        service: "NetLab API"
    })
}

export default healthStatus;