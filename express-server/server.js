const express = require("express")
const cors = require("cors")

const app = express()
const PORT = 5000
const DJANGO_API = "http://127.0.0.1:8000/api/applications/"

app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "Express API"
    })
})

app.get("/api/applications", async (req, res) => {
    try {
        const response = await fetch(DJANGO_API)
        const data = await response.json()
        res.status(response.status).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Django server is not running"
        })
    }
})

app.post("/api/applications", async (req, res) => {
    try {
        const response = await fetch(DJANGO_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        })

        const data = await response.json()
        res.status(response.status).json(data)

    } catch (error) {
        res.status(500).json({
            error: "Could not connect to Django"
        })
    }
})

app.put("/api/applications/:id", async (req, res) => {
    try {
        const response = await fetch(
            `${DJANGO_API}${req.params.id}/`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req.body)
            }
        )

        const data = await response.json()
        res.status(response.status).json(data)

    } catch (error) {
        res.status(500).json({
            error: "Could not connect to Django"
        })
    }
})

app.delete("/api/applications/:id", async (req, res) => {
    try {
        const response = await fetch(
            `${DJANGO_API}${req.params.id}/`,
            {
                method: "DELETE"
            }
        )

        res.status(response.status).send()

    } catch (error) {
        res.status(500).json({
            error: "Could not connect to Django"
        })
    }
})

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`)
})
