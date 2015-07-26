var express = require('express');
var forms = require('forms');
var extend = require('xtend');
var validators = forms.validators;
var firebase = require("firebase");
var ref = new firebase("https://torrid-heat-237.firebaseio.com/");
// Declare the schema of our form:

var profileForm = forms.create({
  /*givenName: forms.fields.string({
    required: true
  }),
  surname: forms.fields.string({ required: true }),*/
  email: forms.fields.email(),
  password: forms.fields.password({ required: validators.required('You definitely want a password'),
  validators: [validators.alphanumeric('true')] }),
});

// A render function that will render our form and
// provide the values of the fields, as well
// as any situation-specific locals

function renderForm(req,res,locals){
  res.render('login', extend({
    title: 'Login!',
    email: req.body.email,
    password: req.body.password
  },locals||{}));
}

// Export a function which will create the
// router and return it

module.exports = function profile(){

  var router = express.Router();

  // Capture all requests, the form library will negotiate
  // between GET and POST requests

  router.post('/', function(req, res) {
    profileForm.handle(req,{
      success: function(form){
        // The form library calls this success method if the
        // form is being POSTED and does not have errors

		ref.authWithPassword({
		  email: form.data.email,
		  password: form.data.password
		}, function(error, authData) {
		  if (error) {
			console.log("Login Failed!", error);
			renderForm(req,res,{
              errors: [{
                error: error.userMessage ||
                error.message || String(error)
              }]
            });
		  } else {
			console.log("Authenticated successfully with payload:", authData);
			res.redirect('/?auth='+JSON.stringify(authData));
		  }
		},{remember: "sessionOnly"});
      },
      error: function(form){
        // The form library calls this method if the form
        // has validation errors.  We will collect the errors
        // and render the form again, showing the errors
        // to the user
        renderForm(req,res,{
          //errors: collectFormErrors(form)
        });
      },
      empty: function(){
        // The form library calls this method if the
        // method is GET - thus we just need to render
        // the form
        renderForm(req,res);
      }
    });
  });

  // This is an error handler for this router

  router.use(function (err, req, res, next) {
    // This handler catches errors for this router
    if (err.code === 'EBADCSRFTOKEN'){
      // The csurf library is telling us that it can't
      // find a valid token on the form
      if(req.user){
        // session token is invalid or expired.
        // render the form anyways, but tell them what happened
        renderForm(req,res,{
          errors:[{error:'Your form has expired.  Please try again.'}]
        });
      }else{
        // the user's cookies have been deleted, we dont know
        // their intention is - send them back to the home page
        res.redirect('/');
      }
    }else{
      // Let the parent app handle the error
      return next(err);
    }
  });

  return router;
};