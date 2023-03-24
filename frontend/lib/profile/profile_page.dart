import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/profile/profile.request.dart';
import 'package:frontend/register/register.page.dart';
import 'package:frontend/widgets/LoggedDrawer.dart';
import 'package:frontend/widgets/error_alert_dialog.dart';
import 'package:frontend/widgets/input/basic_text_input.dart';
import 'package:frontend/widgets/input/confirm_button.dart';
import 'package:frontend/widgets/logged_app_bar.dart';
import 'package:frontend/widgets/custom_title.dart';
import 'package:frontend/widgets/input/password_input.dart';
import 'package:localstorage/localstorage.dart';

import '../widgets/input/number_input.dart';

class Profile extends StatefulWidget {
  const Profile({super.key});

  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  LocalStorage storage = LocalStorage('user.json');

  final GlobalKey<FormState> _formProfileKey = GlobalKey<FormState>();

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _rateLimitController = TextEditingController();

  late Future<GetProfileResult> result;
  late bool adultContent;

  void _onEnableAdultContent(bool? trigger) => setState(() {
        if (trigger != null) {
          adultContent = trigger;
        }
      });

  @override
  void initState() {
    super.initState();
    storage.ready.then((value) => value);
    result = getProfileRequest();
    adultContent = storage.getItem('adultContent') ?? false;
  }

  @override
  Widget build(BuildContext context) {
    result = getProfileRequest();
    return Scaffold(
      appBar: const LoggedAppBar(title: "Profile"),
      backgroundColor: Colors.grey[300],
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Card(
              elevation: 5,
              color: Colors.white,
              child: Container(
                width: 550.0,
                padding: const EdgeInsets.all(15.0),
                child: FutureBuilder<GetProfileResult>(
                  future: result,
                  builder: (context, snapshot) {
                    if (snapshot.hasData) {
                      return Column(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          const CustomTitle(title: 'Profile'),
                          const SizedBox(height: 20.0),
                          CircleAvatar(
                            radius: 50,
                            child: SvgPicture.asset(
                              'icons/logo.svg',
                              width: 100,
                              height: 100,
                            ),
                          ),
                          const SizedBox(height: 20.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              const Text(
                                '    Username:',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                              const SizedBox(width: 10.0),
                              Text(
                                '${snapshot.data!.username}    ',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              const Text(
                                '    Email:',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                              const SizedBox(width: 10.0),
                              Text(
                                '${snapshot.data!.email}    ',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              const Text(
                                '    Adult content:',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                              const SizedBox(width: 10.0),
                              Text(
                                snapshot.data!.adultContent ? 'Yes    ' : 'No    ',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                            ],
                          ),
                        ],
                      );
                    } else if (snapshot.hasError) {
                      return ErrorAlertDialog(type: 'Error', message: snapshot.error.toString());
                    }
                    return const Center(child: CircularProgressIndicator());
                  },
                ),
              ),
            ),
            Card(
              elevation: 5,
              color: Colors.white,
              child: Container(
                width: 550.0,
                padding: const EdgeInsets.all(15.0),
                child: Form(
                  key: _formProfileKey,
                  child: Column(
                    children: [
                      const CustomTitle(title: 'Update information'),
                      const SizedBox(height: 20.0),
                      BasicTextInput(
                        label: 'Username',
                        hintText: 'Enter a new username',
                        icon: Icons.mail,
                        controller: _usernameController,
                        validator: (value) {
                          if (value != null && value.isNotEmpty) {
                            if (value.length < 3) {
                              return "That must contain at least 3 characters.";
                            }
                            if (value.length > 30) {
                              return "That must contain at most 30 characters.";
                            }
                          }
                          return null;
                        }
                      ),
                      const SizedBox(height: 10.0),
                      PasswordInput(
                        label: 'Password',
                        hintText: 'Enter a new password',
                        controller: _passwordController,
                        validator: (value) {
                          if (value != null && value.isNotEmpty) {
                            // final RegExp passwordExp = RegExp(
                            //     r"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$");
                            if (_passwordController.text.length < 8) {
                              return "That must contain at least 8 characters.";
                            }
                          }
                          return null;
                      }),
                      const SizedBox(height: 10.0),

                      NumberInput(
                        label: 'Rate limit',
                        hintText: 'Enter the rate limit',
                        icon: Icons.production_quantity_limits,
                        controller: _rateLimitController,
                        validator: (value) {
                          if (value != null && value.isNotEmpty) {
                            if ((value as int) < 1001) {
                              return "That must be greater than 1 second.";
                            }
                          }
                          return null;
                        }
                      ),
                      const SizedBox(height: 10.0),
                      CheckboxListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 160.0),
                        title: const Center(
                          child: Text(
                            'Enable Adult content',
                            textAlign: TextAlign.center,
                          ),
                        ),
                        value: adultContent,
                        onChanged: _onEnableAdultContent,
                        controlAffinity: ListTileControlAffinity.platform,
                      ),
                      const SizedBox(
                        height: 8.0,
                      ),
                      ConfirmButton(
                        text: 'Update',
                        onPressed: () async {
                          print("${_passwordController.text} ${_passwordController.text.isNotEmpty}");
                          print(_formProfileKey.currentState!.validate());
                          if (_formProfileKey.currentState!.validate()) {
                            print("Updating profile...");
                            try {
                              UpdateProfileResult res = await updateProfileRequest(
                                  username: _usernameController.text,
                                  password: _passwordController.text,
                                  adultContent: adultContent);
                              _usernameController.clear();
                              _passwordController.clear();
                              _rateLimitController.clear();
                              setState(() {
                                result = getProfileRequest();
                              });
                              storage.setItem('username', _usernameController.text);
                              storage.setItem('adultContent', adultContent);
                            } on ProfileError catch (e) {
                              var errorDialog = ErrorAlertDialog(type: e.error, message: "Caused: ${e.message}");
                              showDialog(context: context, builder: (BuildContext context) => errorDialog);
                            }
                          }
                        }
                      ),
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
