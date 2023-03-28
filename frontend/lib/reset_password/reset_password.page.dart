import 'package:flutter/material.dart';
import 'package:frontend/forgot_password/forgot_password_request.dart';
import 'package:frontend/reset_password/reset_password.request.dart';
import 'package:frontend/widgets/error_alert_dialog.dart';
import 'package:frontend/widgets/input/confirm_button.dart';
import 'package:frontend/widgets/input/password_input.dart';
import 'package:localstorage/localstorage.dart';

class ResetPassword extends StatefulWidget {
  const ResetPassword({super.key});

  @override
  _ResetPasswordState createState() => _ResetPasswordState();
}

class _ResetPasswordState extends State<ResetPassword> {

  late bool _isButtonDisabled;
  LocalStorage storage = new LocalStorage('user.json');

  final GlobalKey<FormState> _formResetPasswordKey = GlobalKey<FormState>();

  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _checkPasswordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _isButtonDisabled = false;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Card(
              elevation: 5,
              color: Colors.white,
              child: Container(
                width: 450.0,
                padding: const EdgeInsets.all(15.0),
                child: Form(
                  key: _formResetPasswordKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      const Text(
                        'Reset Password',
                        style: TextStyle(
                          fontSize: 32.0,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 20.0),
                      const Text(
                        'Please enter and verify your new password.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 18.0,
                        ),
                      ),
                      const SizedBox(height: 20.0),
                      PasswordInput(
                        label: "Password",
                        hintText: "Enter your password",
                        controller: _passwordController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your password';
                          }
                          if (value.length < 8) {
                            return "Password must be at least 8 characters long.";
                          }
                        return null;
                        }
                      ),
                      const SizedBox(height: 10.0),
                      PasswordInput(
                          label: "Check your Password",
                          hintText: "Enter your password again",
                          controller: _checkPasswordController,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please confirm your password';
                            }
                            if (value.length < 8) {
                              return "Password must be at least 8 characters long.";
                            }
                            if (value != _passwordController.text) {
                              return "Passwords do not match.";
                            }
                            return null;
                          }
                      ),
                      const SizedBox(height: 10.0),
                      ConfirmButton(text: "Reset password", isButtonDisabled: _isButtonDisabled, onPressed:
                      _isButtonDisabled ? null : () {
                        if (_formResetPasswordKey.currentState!.validate()) {
                          if (storage.getItem("tmp_token") == null) {
                            var errorDialog = const ErrorAlertDialog(type: "TokenError", message: "Token not found. "
                                "Unauthorized to reset password.");
                            showDialog(context: context, builder: (BuildContext context) => errorDialog);
                            Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                            return;
                          }
                          setState(() {
                            _isButtonDisabled = true;
                          });
                          resetPasswordRequest(_passwordController.text, storage.getItem("tmp_token")).then((value) {
                            _passwordController.clear();
                            _checkPasswordController.clear();
                          }).catchError((e) {
                            setState(() {
                              _isButtonDisabled = false;
                            });
                            var errorDialog = ErrorAlertDialog(type: (e as ForgotPasswordError).error, message: "Caused: ${e.message}");
                            showDialog(context: context, builder: (BuildContext context) => errorDialog);
                          }).whenComplete(() {
                            setState(() {
                              _isButtonDisabled = false;
                            });
                            var snackBar = const SnackBar(content: Text("Password changed"));
                            ScaffoldMessenger.of(context).showSnackBar(snackBar);
                            Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                          });
                        }
                      }),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}