AWS.config.region = '<REGION>';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '<IDENTITY_POOL_ID>'
});

var lambda = new AWS.Lambda();

function signup() {

    var result = document.getElementById('result');
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var verifyPassword = document.getElementById('verify-password');

    result.innerHTML = 'Signing Up...';

    if (email.value == null || email.value == '') {
        result.innerHTML = 'Please specify your email address.';
    } else if (password.value == null || password.value == '') {
        result.innerHTML = 'Please specify a password.';
    } else if (password.value != verifyPassword.value) {
        result.innerHTML = 'Passwords are <b>different</b>, please check.';
    } else {

        var input = {
            email: email.value,
            password: password.value,
        };

        lambda.invoke({
            FunctionName: 'AuthCreateUser',
            Payload: JSON.stringify(input)
        }, function(err, data) {
            if (err) console.log(err, err.stack);
            else {
                var output = JSON.parse(data.Payload);
                console.log(output);
                if (output.created) {
                    result.innerHTML = 'User ' + input.email + ' created. Please check your email to validate the user and enable login.';
                } else {
                    result.innerHTML = 'Unable to create user: email address already in use. Please try another email address.';
                }
            }
        });

    }
}

var form = document.getElementById('signup-form');
form.addEventListener('submit', function(evt) {
    evt.preventDefault();
    signup();
});