const { Router } = require('express');
const passport = require('passport');
const path = require('path');

// for security/authentication and session
const requireLogin = require('../middleware/requireLogin');

// for logs
const Logs = require('../src/logdb');

// for routers
const router = Router();

// for envs
require('dotenv').config();

// for hashing
const bcrypt = require('bcrypt');

// email handler (for sending mails)
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// OAUTH
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URI
);

// refresh token
oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

// access token
const getAccessToken = async () => {
    const { token } = await oauth2Client.getAccessToken();
    return token;
};

//nodemailer transporter
const createTransporter = async () => {
    const accessToken = await getAccessToken();

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.AUTH_EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
};

//unique string (installation = npm add nodemailer uuid)
const { v4: uuidv4 } = require("uuid");

// login page
router.get("/login", (req, res) => {
    res.render("login");
});

// signup page
router.get("/signup", (req, res) => {
    res.render("signup");
});

// main page
router.get("/mainPage", requireLogin, (req, res) => {
    res.render("mainPage", {
        title: 'Main Page',
    });
});

// chatbot
router.get("/chatbot", requireLogin, (req, res) => {
    res.render("chatbot");
});

// database
var userCollection = require("../src/userdb");
var admincollection = require("../src/admindb");
var userVerification = require("../src/userVerification");

// SignUp for User
router.post("/signup", async (req, res) => {
    let { firstName, lastName, email, password, studentNo } = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    studentNo = studentNo.trim();

    if (firstName === "" || lastName === "" || email === "" || password === "" || studentNo === "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        });
    } else if (!/^[a-zA-Z ]*$/.test(firstName) || !/^[a-zA-Z ]*$/.test(lastName)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });
    } else if (!/^[0-9]+$/.test(studentNo)) {
        res.json({
            status: "FAILED",
            message: "Invalid Student No entered. It should be numeric."
        });
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!"
        });
    } else {
        // Checking if user already exists
        userCollection.find({ email }).then(result => {
            if (result.length) {
                // a user already exists
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                });
            } else {
                // try to create new user

                // password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new userCollection({
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                        studentNo,
                        verified: false,
                    });

                    newUser
                        .save()
                        .then((result) => {
                            // handle account verification
                            sendVerificationEmail(result, res);
                        })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while saving user account"
                            });
                        });
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while hashing password!"
                    });
                });
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            });
        });
    }
});

const sendVerificationEmail = async ({ _id, email }, res) => {
    const currentUrl = "http://localhost:5000/";
    const uniqueString = uuidv4() + _id;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your Email",
        html: `<p>Verify your email address to continue the signup and login into your account.</p>
           <p><b>This link expires in 1 hour</b>.</p>
           <p>Press <a href=${currentUrl + "verify/" + _id + "/" + uniqueString}>HERE</a> to proceed and login your account.</p>`,
    };

    try {
        const transporter = await createTransporter(); // Create the transporter
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
        const newVerification = new userVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiredAt: Date.now() + 3600000,
        });

        await newVerification.save();
        await transporter.sendMail(mailOptions);
        res.render("login", { alertMessage: "Verification Email Sent", alertType: "success" });
    } catch (error) {
        console.log(error);
        res.json({
            status: "FAILED",
            message: "Verification email failed",
        });
    }
};

// verify email
router.get("/verify/:userId/:uniqueString", (req, res) => {
    let { userId, uniqueString } = req.params;

    userVerification
        .find({ userId })
        .then((result) => {
            if (result.length > 0) {
                const { expiresAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;

                if (expiresAt < Date.now()) {
                    // Handle expired verification link...
                } else {
                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then(result => {
                            if (result) {
                                userCollection
                                    .updateOne({ _id: userId }, { verified: true })
                                    .then(() => {
                                        userVerification
                                            .deleteOne({ userId })
                                            .then(() => {
                                                // Redirect to the main page after verification
                                                res.redirect("http://localhost:3000"); // Update to your main page URL
                                            })
                                            .catch(error => {
                                                console.log(error);
                                                let message = "An error occurred while finalizing successful verification";
                                                res.redirect(`/user/verified/error=true&message=${message}`);
                                            });
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        let message = "An error occurred while updating user record to show verified";
                                        res.redirect(`/user/verified/error=true&message=${message}`);
                                    });
                            } else {
                                // Handle invalid verification details...
                            }
                        })
                        .catch((error) => {
                            let message = "An error occurred while comparing unique string";
                            res.redirect(`/user/verified/error=true&message=${message}`);
                        });
                }
            } else {
                // Handle no verification record found...
            }
        })
        .catch((error) => {
            console.log(error);
            let message = "An error occurred while checking for existing user verification record";
            res.redirect(`/user/verified/error=true&message=${message}`);
        });
});



// verified page route
router.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname, "/templates/verified.html"));
});


    router.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;
    
            // Check if the user exists in the userCollection
            const user = await userCollection.findOne({ email });
            if (user) {
                // User exists, check if the password matches
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    if (user.verified) {
                        // Set session or generate token
                        req.session.authenticated = true;
                        req.session.email = email;
                        new Logs({ message: `${email} logged in` }).save()
                        // Return JSON response instead of rendering a page
                        res.json({ success: true, message: "Login successful", user: { email: user.email, name: user.name } });
                    } else {
                        // Return JSON response for unverified email
                        res.json({ success: false, message: "Email hasn't been verified yet. Check your inbox." });
                    }
                } else {
                    // Return JSON response for wrong password
                    res.json({ success: false, message: "Wrong password." });
                }
            } else {
                // Check if the user exists in the admincollection
                const admin = await admincollection.findOne({ email });
                if (admin) {
                    // Admin exists, check if the password matches
                    if (admin.password === password) {
                        req.session.authenticated = true;
                        req.session.email = email;
    
                        // Return JSON response for admin login
                        res.json({ success: true, message: "Admin login successful", user: { email: admin.email, role: 'admin' } });
                    } else {
                        // Return JSON response for wrong password
                        res.json({ success: false, message: "Wrong password." });
                    }
                } else {
                    // Return JSON response for user not found
                    res.json({ success: false, message: "User not found." });
                }
            }
        } catch (error) {
            console.error(error);
            // Return JSON response for a generic error
            res.status(500).json({ success: false, message: "An error occurred during login." });
        }
    });
    

    // route for log out
    router.get('/logout', requireLogin, async (req, res) => {
        const email = req.session.email || 'unknown';
        console.log(req.session.email);
    
        try {
            await new Logs({ message: `${email} logged out` }).save();
    
            // Destroy the session after saving the log entry
            req.session.destroy(err => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).send('Logout failed');
                }
                console.log('Session destroyed successfully');
                res.redirect('/login');
            });
        } catch (error) {
            console.error('Error logging out:', error);
            res.status(500).send('Error logging out');
        }
    });
    

module.exports = router;