import asyncHandler from "../utils/asyncHandler.js"
import { AuthService } from "../services/auth.services.js"
import sendResponse from "../utils/sendResponse.js";


const signUp = asyncHandler(async (req, res): Promise<void> => {

    const { name, email, password } = req.body;
    //console.log(password)

    const { user } = await AuthService.registerUser({ name, email, password });

    const userId = user?.id;

    sendResponse(res, 200, {
        message: "Registration successful",
        data: {
            id: userId,
        }



    })
})

export const signIn = asyncHandler(async (req, res): Promise<void> => {
    const { email, password } = req.body;

    const result = await AuthService.login({ email, password });


    if (!result?.user) {
        res.status(400).json({ error: "Login failed" });
        return;
    }


    sendResponse(res, 200, {
        message: "Login successful",

        data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        }
    })

})

const signOut = asyncHandler(async (req, res): Promise<void> => {
    // Implement sign-out logic if needed (e.g., invalidate tokens)
    const userId = req.user?.id;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(400).json({ error: "Token is required for logout" });
        
    }

    await AuthService.signOut(token);

    
    sendResponse(res, 200, {
        message: "Logout successful",
    });
})



export const authController = {
    signUp
    , signIn
    , signOut

}


