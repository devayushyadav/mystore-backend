import User from "../model/usersModel";

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Initialize an array to collect error messages
      let errors = [];
  
      // Check each field and add an error message if a field is missing
      if (!email) errors.push("email");
      if (!password) errors.push("password");
  
      // If there are any errors, return a response with the missing fields
      if (errors.length > 0) {
        return res.status(400).json({
          message: `Missing required fields: ${errors.join(", ")}`,
        });
      }
      
  
      const user = await User.findOne({ email , password})
  
      if(!user){
        return res.status(404).json({ message: "Invalid Credentials, Please try again" });
      }

    //   // Set a cookie with the username
    //   res.cookie('username', user._id, {
    //     httpOnly: true,     // Makes the cookie inaccessible to client-side scripts
    //     secure: true,       // Ensures the cookie is sent only over HTTPS
    //     sameSite: 'Strict', // Controls whether the cookie is sent with cross-site requests
    //     maxAge: 24 * 60 * 60 * 1000, // 1 day
    // });
  
      res.status(201).json({
        success: true,
        message : `Welcome ${user.firstName}`,
        user: user
      });
  
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }


export const signup = async (req, res) => {
  try {
    const { firstName , lastName , email, mobile , password} = req.body;

    // Initialize an array to collect error messages
    let errors = [];

    // Check each field and add an error message if a field is missing
    if (!firstName) errors.push("firstName");
    if (!lastName) errors.push("lastName");
    if (!email) errors.push("email");
    if (!mobile) errors.push("mobile");
    if (!password) errors.push("password")

    // If there are any errors, return a response with the missing fields
    if (errors.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${errors.join(", ")}`,
      });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      password
    })

    await user.save()

    res.status(201).json({
      success: true,
      message : `Congratulation ${firstName}, your account has been created successfully. Please login to continue`,
      user: user
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
}