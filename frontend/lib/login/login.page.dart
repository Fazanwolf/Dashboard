import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/login/login.request.dart';
import 'package:frontend/widgets/error_alert_dialog.dart';
import 'package:frontend/widgets/input/basic_text_input.dart';
import 'package:frontend/widgets/input/confirm_button.dart';
import 'package:frontend/widgets/custom_title.dart';
import 'package:frontend/widgets/input/password_input.dart';
import 'package:localstorage/localstorage.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:html' as html;

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {

  final LocalStorage storage = LocalStorage('user.json');

  bool _stayConnected = false;

  void _onStayConnectedChanged(bool? trigger) => setState(() {
    if (trigger != null) {
      _stayConnected = trigger;
    }
  });

  final GlobalKey<FormState> _formLoginKey = GlobalKey<FormState>();

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  Future _launchURL(String platform, String type) async {
    var result = await getUri(platform, type);
    // print(result);
    // var uri = Uri.parse(result);

    // Navigator.of(context).pop();
    html.window.open(result,"_self");
    // html.window.location.href = result;

    // var res = await launchUrl(uri);
    // if (!res) {
    //   throw Exception('Could not launch $uri');
    // }
    // return res;
  }

  @override
  Widget build(BuildContext context) {
    // final args = ModalRoute.of(context)!.settings.arguments as LoginArguments?;
    // if (args != null && args.access_token != null) {
    //   storage.setItem('access_token', args.access_token);
    //   storage.setItem('id', args.id);
    //   storage.setItem('username', args.username);
    //   storage.setItem('adultContent', args.adultContent);
    //   Navigator.of(context).pushNamedAndRemoveUntil('/dashboard', (route) => false);
    // }

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
                  key: _formLoginKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      const CustomTitle(title: 'Login'),
                      const SizedBox(height: 20.0),
                      const Text(
                        'Please sign in to continue.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 18.0,
                        ),
                      ),
                      const SizedBox(height: 20.0),
                      BasicTextInput(label: 'Email', hintText: 'Enter your email address', icon: Icons.mail,
                        controller: _emailController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a username';
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
                            // if (_passwordController.text.length < 8) {
                            //   return "That must contain at least 8 characters.";
                            // }
                            return null;
                          }
                      ),
                      const SizedBox(height: 10.0),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          TextButton(
                              onPressed: () {
                                Navigator.pushNamedAndRemoveUntil(context, "/forgot-password", (route) => false);
                              },
                              child: const Text(
                                'Forgot password?',
                                textAlign: TextAlign.center,
                              )
                          ),
                          const SizedBox(width: 30.0),
                          TextButton(
                              onPressed: () => {
                                _onStayConnectedChanged(!_stayConnected)
                              },
                              child: const Text(
                                'Stay connected?',
                                textAlign: TextAlign.center,
                              )
                          ),
                          Checkbox(
                            value: _stayConnected,
                            onChanged: _onStayConnectedChanged,
                          ),
                        ],
                      ),
                      const SizedBox(height: 10.0),
                      ConfirmButton(text: 'Login', onPressed: () async {
                        if (_formLoginKey.currentState!.validate()) {
                          try {
                            LoginResult futureLogin = await loginRequest(_emailController.text, _passwordController.text);
                            storage.setItem('access_token', futureLogin.access_token);
                            storage.setItem('id', futureLogin.id);
                            storage.setItem('username', futureLogin.username);
                            storage.setItem('adultContent', futureLogin.adultContent);
                            storage.setItem('stayConnected', _stayConnected);
                            Navigator.pushNamedAndRemoveUntil(context, '/dashboard', (route) => false);
                          } on LoginError catch (e) {
                            var errorDialog = ErrorAlertDialog(type: e.error, message: "Caused: ${e.message}");
                            showDialog(context: context, builder: (BuildContext context) => errorDialog);
                          }
                        }
                      }),
                      const SizedBox(height: 20.0),
                      const Text(
                        'Or login with:',
                        style: TextStyle(
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 10.0),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          IconButton(
                            onPressed: () async {
                              await _launchURL("reddit", "login");
                            },
                            icon: const Icon(Icons.reddit),
                            iconSize: 30.0,
                            tooltip: 'Reddit',
                          ),
                          const SizedBox(width: 35.0),
                          IconButton(
                            onPressed: () async {
                              await _launchURL("discord", "login");
                            },
                            icon: const Icon(Icons.discord),
                            iconSize: 30.0,
                            tooltip: 'Discord',
                          ),
                          const SizedBox(width: 35.0),
                          IconButton(
                            onPressed: () async {
                              await _launchURL("wakatime", "login");
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
                Navigator.pushNamedAndRemoveUntil(context, "/register", (route) => false);
              },
              child: const Text("Don't have an account? Sign up"),
            ),
          ],
        ),
      ),
    );
  }
}