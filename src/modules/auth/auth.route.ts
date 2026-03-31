import { Router } from "express";

const router = Router();
// Define your routes here
router.get("/login", (req, res) => {
    const body = req.body; // Access the request body

    const { username, password } = body; // Destructure username and password from the body

    

    res.send("Hello from the auth route!"); 
});


export default router;








