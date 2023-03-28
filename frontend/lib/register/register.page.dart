import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/login/login.request.dart';
import 'package:frontend/register/register.request.dart';
import 'package:frontend/widgets/error_alert_dialog.dart';
import 'package:frontend/widgets/input/basic_text_input.dart';
import 'package:frontend/widgets/input/confirm_button.dart';
import 'package:frontend/widgets/custom_description.dart';
import 'package:frontend/widgets/custom_title.dart';
import 'package:frontend/widgets/input/password_input.dart';
import 'dart:html' as html;

class Register extends StatefulWidget {
  const Register({super.key});

  @override
  _RegisterState createState() => _RegisterState();
}

class _RegisterState extends State<Register> {

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _isButtonDisabled = false;
  }

  Future _launchURL(String platform, String type) async {
    var result = await getUri(platform, type);
    // var uri = Uri.parse(result);

    // html.window.open(result, 'nani?');
    html.window.location.href = result;

    // var res = await launchUrl(uri, mode: LaunchMode.inAppWebView);
    // if (!res) {
    //   throw Exception('Could not launch $uri');
    // }
    // return res;
  }

  late bool _isButtonDisabled = false;

  final GlobalKey<FormState> _formRegisterKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.pushNamedAndRemoveUntil(context, "/home", (route) => false);
              },
              child: const Text("Go back to home"),
            ),
            const SizedBox(height: 8.0),
            Card(
              elevation: 5,
              color: Colors.white,
              child: Container(
                width: 450.0,
                padding: const EdgeInsets.all(15.0),
                child: Form(
                  key: _formRegisterKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      const CustomTitle(title: 'Register'),
                      const SizedBox(height: 20.0),
                      CustomDescription(description: 'Please sign in to continue.'),
                      const SizedBox(height: 20.0),
                      BasicTextInput(label: "Username", hintText: "Enter your username", icon: Icons.person,
                        controller: _usernameController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a username';
                          }
                          final RegExp nameExp = RegExp(r'^[a-zA-Z ]+$');
                          if (!nameExp.hasMatch(value)) {
                            return "Please enter a valid username.";
                          }
                          if (value.length < 3) {
                            return 'Username must be at least 3 characters long';
                          }
                          if (value.length > 30) {
                            return 'Username must be at most 30 characters long';
                          }
                          return null;
                        }
                      ),
                      const SizedBox(height: 10.0),
                      BasicTextInput(label: "Email", hintText: "Enter your email address", icon: Icons.mail,
                        controller: _emailController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter an email';
                          }
                          final RegExp emailExp = RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
                          if (!emailExp.hasMatch(value)) {
                            return "Please enter a valid email.";
                          }
                          return null;
                        }
                      ),
                      const SizedBox(height: 10.0),
                      PasswordInput(label: 'Password', hintText: 'Enter your password',
                        controller: _passwordController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your password';
                          }
                          // final RegExp passwordExp = RegExp(r"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$");
                          // if (!passwordExp.hasMatch(value)) {
                          //   return "That must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";
                          // }
                          if (_passwordController.text.length < 8) {
                            return "Password must be at least 8 characters long";
                          }
                          return null;
                        }
                      ),
                      const SizedBox(height: 10.0),
                      PasswordInput(label: 'Confirm password', hintText: 'Enter your password again',
                        controller: _confirmPasswordController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please confirm your password';
                          }
                          // final RegExp passwordExp = RegExp(r"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$");
                          // if (!passwordExp.hasMatch(value)) {
                          //   return "That must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";
                          // }
                          if (_passwordController.text.length < 8) {
                            return "Password must be at least 8 characters long";
                          }
                          if (value != _passwordController.text) {
                            return "Passwords don't match";
                          }
                          return null;
                        }
                      ),
                      const SizedBox(height: 10.0),
                      ConfirmButton(text: 'Register', isButtonDisabled: _isButtonDisabled, onPressed:
                      _isButtonDisabled ? null : () {
                        if (_formRegisterKey.currentState!.validate()) {
                          setState(() {
                            _isButtonDisabled = true;
                          });
                          registerRequest(_emailController.text, _usernameController.text, _passwordController.text).then((value) {
                            var snackBar = SnackBar(
                              content: Text(value.message),
                            );
                            ScaffoldMessenger.of(context).showSnackBar(snackBar);
                          }).catchError((e) {
                            setState(() {
                              _isButtonDisabled = false;
                            });
                            var errorDialog = ErrorAlertDialog(type: " ", message: "Caused: ${e.toString()}");
                            showDialog(context: context, builder: (BuildContext context) => errorDialog);
                          }).whenComplete(() {
                            _emailController.clear();
                            _usernameController.clear();
                            _passwordController.clear();
                            _confirmPasswordController.clear();
                            Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                          });
                        }
                      }),
                      const SizedBox(height: 20.0),
                      const Text(
                          'Or register with:',
                        style: TextStyle(
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 10.0),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          // IconButton(
                          //   onPressed: () {},
                          //   icon: const Icon(Icons.reddit),
                          //   iconSize: 30.0,
                          //   tooltip: 'Reddit',
                          // ),
                          // const SizedBox(width: 35.0),
                          IconButton(
                            onPressed: () async {
                              await _launchURL("discord", "register");
                            },
                            icon: const Icon(Icons.discord),
                            iconSize: 30.0,
                            tooltip: 'Discord',
                          ),
                          const SizedBox(width: 35.0),
                          IconButton(
                            onPressed: () async {
                              var res = await _launchURL("wakatime", "register");
                            },
                            icon: SvgPicture.asset('icons/wakatime.svg'),
                            iconSize: 30.0,
                            tooltip: 'Wakatime',
                          ),
                        ],
                      ),
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
              child: const Text('Already have an account? Sign in'),
            ),
          ],
        ),
      ),
    );
  }
}