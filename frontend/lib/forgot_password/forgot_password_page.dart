import 'package:flutter/material.dart';
import 'package:frontend/forgot_password/forgot_password_request.dart';
import 'package:frontend/widgets/error_alert_dialog.dart';
import 'package:frontend/widgets/input/basic_text_input.dart';
import 'package:frontend/widgets/input/confirm_button.dart';
import 'package:frontend/widgets/custom_description.dart';
import 'package:frontend/widgets/custom_title.dart';

class ForgotPassword extends StatefulWidget {
  const ForgotPassword({super.key});

  @override
  _ForgotPasswordState createState() => _ForgotPasswordState();
}

class _ForgotPasswordState extends State<ForgotPassword> {

  late bool _isButtonDisabled;
  final TextEditingController _emailController = TextEditingController();
  final GlobalKey<FormState> _formForgotPasswordKey = GlobalKey<FormState>();

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
                  key: _formForgotPasswordKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      const CustomTitle(title: "Forgot Password"),
                      const SizedBox(height: 20.0),
                      CustomDescription(description: "Please enter your email address to reset your password."),
                      const SizedBox(height: 20.0),
                      BasicTextInput(label: 'Email', hintText: 'Enter your email address', icon: Icons.mail,
                        controller: _emailController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your email address';
                          }
                          final RegExp emailExp = RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
                          if (!emailExp.hasMatch(value)) {
                            return "Please enter a valid email.";
                          }
                          return null;
                        }
                      ),
                      const SizedBox(height: 20.0),
                      ConfirmButton(text: 'Send email', isButtonDisabled: _isButtonDisabled, onPressed:
                      _isButtonDisabled ? null : () {
                        if (_formForgotPasswordKey.currentState!.validate()) {
                          setState(() {
                            _isButtonDisabled = true;
                          });
                          forgotPasswordRequest(_emailController.text).then((value) {
                            _emailController.clear();
                            var snackBar = SnackBar(content: Text(value.message));
                            ScaffoldMessenger.of(context).showSnackBar(snackBar);
                          }).catchError((e) {
                            setState(() {
                              _isButtonDisabled = false;
                            });
                            var errorDialog = ErrorAlertDialog(type: " ", message: "Caus"
                                "ed: ${e.toString()}");
                            showDialog(context: context, builder: (BuildContext context) => errorDialog);
                          }).whenComplete(() {
                            setState(() {
                              _isButtonDisabled = false;
                            });
                            Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                          });
                        }
                      }),
                      const SizedBox(height: 20.0),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8.0),
            TextButton(
              onPressed: () {
                Navigator.pushNamedAndRemoveUntil(context, "/login", (route) => false);
              },
              child: const Text("Remember your password? Login"),
            ),
          ],
        ),
      ),
    );
  }
}