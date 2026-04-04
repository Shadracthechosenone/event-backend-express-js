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



    export const authController = {
        signUp
        , signIn

    }


