import asyncHandler from "../utils/asyncHandler.js"
import {AuthService} from "../services/auth.services.js"
import sendResponse from "../utils/sendResponse.js";


    const signUp = asyncHandler(async (req, res) : Promise<void> => {

        const { email, password } = req.body;

        const {user, accessToken, refreshToken} = await AuthService.login({ email, password });
        
        const userId = user.id;

        sendResponse(res, 200,{
            message: "Login successful",
            data: {
                id: userId,
                name: user.name,
                email: user.email,

        }       

    })
    })

 export  const signIn = asyncHandler(async (req, res) : Promise<void> => {
        const { name,email, password } = req.body;

    const result = await AuthService.registerUser({ name,email, password });
    

    if (!result?.user) {
        res.status(400).json({ error: result?.error || "Registration failed" });
        return;
    }

        const {user}= result;


    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
                
        }
    });




   })
    



   
export const authController = {
    signUp
    ,signIn

}

    
