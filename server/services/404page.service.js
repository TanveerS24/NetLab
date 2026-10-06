const NotFoundPage = (req, res) => {
    return res.status(404).send({
        message: "This is not a valid Endpoint",
        success: false,

    })
}

export default NotFoundPage;