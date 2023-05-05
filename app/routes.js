module.exports = function(app, passport, db, ObjectId) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs', {dates: res});
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('dates').find({name: req.user.local.email, password: req.user.local.password }).sort({date: -1}).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            dates: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// entry routes ===============================================================

    app.post('/dates', (req, res) => {
      console.log(req.body, 'bodyody')
      db.collection('dates').save({name: req.user.local.email, password: req.user.local.password, context: req.body.context, date: req.body.dateform, symptoms: req.body.symp, }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
      
    })

    app.put('/date/:id', (req, res) => {
      console.log(req.body, 'bodyody')
      const id = ObjectId(req.params.id)
      const context = req.body.context
      const date = req.body.date
      const symptoms = req.body.symptoms
      db.collection('dates').findOneAndUpdate(
        {_id: id},
        {$set: {context: context, date: date, symptoms: symptoms}},
        (err, result) => {
          if (err) return res.send(500, err)
          res.send('Post updated!')
        }
      );
    })



    app.delete('/dates', (req, res) => {
      console.log(req.body)
      db.collection('dates').findOneAndDelete({name: req.user.local.email, password: req.user.local.password, date: req.body.date, symptoms: req.body.symptoms}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash dates
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash dates
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
