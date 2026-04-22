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

const forgotPassword = asyncHandler(
  async (req, res): Promise<void> => {
    const { email } = req.body;
    
    const start = Date.now();
    const response = await AuthService.ForgotPassword(email);
    const end = Date.now();
    
    console.log(`Time taken for forgot password: ${end - start} ms`);
    sendResponse(res, 200, { message: response.message });
  }
);


const resetPassword = asyncHandler(
  async (req, res): Promise<void> => {
    const { token } = req.query;
    const { newPassword } = req.body;   
    if (typeof token !== "string") {
      res.status(400).json({ error: "Invalid token" });
      return ;
    }


    
    const start = Date.now();
    const response = await AuthService.resetUserPassword(token, newPassword);
    const end = Date.now();

    console.log(`Time taken for reset password: ${end - start} ms`);

    sendResponse(res, 200, { message: response.message });
  }
);

export const authController = {
    signUp
    , signIn
    , signOut,
    forgotPassword,
    resetPassword

}


