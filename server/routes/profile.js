const userRoute = require('../routes/user');

const { Router } = require('express');

const router = Router();

router.use(userRoute);

const bcrypt = require('bcrypt'); // Add bcrypt for hashing passwords

// database
var userCollection = require("../src/userdb");

// requirements
function requireLogin(req, res, next) {
    if (req.session && req.session.email) {
        return next();
    } else {
        res.redirect("/login");
    }
}

// for profile
router.get("/profile", requireLogin, (req, res) => {
  const { email } = req.session;
  
  userCollection.findOne({ email }).then(user => {
    if (user) {
      // Send user data as JSON response
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  }).catch(err => {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "An error occurred." });
  });
});


// Edit Profile Form
router.get("/profile/edit", requireLogin, (req, res) => {
    const { email } = req.session;
    
    userCollection.findOne({ email }).then(user => {
        if (user) {
            res.render("editProfile", { user });
        } else {
            res.render("login", { alertMessage: "User not found.", alertType: "danger" });
        }
    }).catch(err => {
        console.error("Error fetching user:", err);
        res.render("login", { alertMessage: "An error occurred.", alertType: "danger" });
    });
});

// Handle Edit Profile Form Submission
router.post("/profile/edit", requireLogin, async (req, res) => {
    const { email } = req.session;
    const { name, currentPassword, newPassword } = req.body;
  
    try {
      const updateFields = { name };
  
      // Check if new password is provided and valid
      if (newPassword) {
        const user = await userCollection.findOne({ email });
        if (user && await bcrypt.compare(currentPassword, user.password)) {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          updateFields.password = hashedPassword;
        } else {
          return res.status(400).json({ message: "Current password is incorrect." });
        }
      }
  
      await userCollection.findOneAndUpdate({ email }, { $set: updateFields });
      res.redirect("/profile");
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: "Failed to update profile." });
    }
  });
module.exports = router;
