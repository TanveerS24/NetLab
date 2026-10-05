import mongoose from "mongoose";

const healthStatus = async (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: await mongoose.connection.readyState ? "connected" : "disconnected",
        service: "NetLab API"
    })
}

export default healthStatus;