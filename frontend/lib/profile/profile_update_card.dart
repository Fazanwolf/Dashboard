import 'package:flutter/material.dart';
import 'package:frontend/profile/profile.request.dart';
import 'package:frontend/widgets/custom_title.dart';
import 'package:frontend/widgets/input/basic_text_input.dart';
import 'package:frontend/widgets/input/number_input.dart';
import 'package:frontend/widgets/input/password_input.dart';
import 'package:localstorage/localstorage.dart';

class ProfileUpdateCard extends StatefulWidget {

  late Function refresh;

  ProfileUpdateCard({super.key, required this.refresh});

  @override
  _ProfileUpdateCardState createState() => _ProfileUpdateCardState();

}

class _ProfileUpdateCardState extends State<ProfileUpdateCard> {
  LocalStorage storage = LocalStorage('user.json');

  late bool adultContent = false;

  final GlobalKey<FormState> _formProfileKey = GlobalKey<FormState>();

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _rateLimitController = TextEditingController();

  @override
  void initState() {
    storage.ready.then((value) => value);
    adultContent = storage.getItem('adultContent') ?? false;
    super.initState();
  }

  void _onEnableAdultContent(bool? trigger) => setState(() {
    if (trigger != null) {
      adultContent = !adultContent;
    }
  });

  @override
  Widget build(BuildContext context) {
    return Card(
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
                      if ((value as int) < 7999) {
                        return "That must be greater than 8 second.";
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
              ElevatedButton(
                child: const Text('Update'),
                onPressed: () {
                  if (_formProfileKey.currentState!.validate()) {
                    updateProfileRequest(username: _usernameController.text, password: _passwordController
                        .text, adultContent: adultContent).then((value) {
                          print(value.message);

                          if (_usernameController.text.isNotEmpty) storage.setItem('username', _usernameController.text);
                          storage.setItem('adultContent', adultContent);
                          if (_rateLimitController.text.isNotEmpty) {
                            storage.setItem('rateLimit', int.parse(_rateLimitController.text));
                          }
                      var snackBar = SnackBar(content: Text(value.message));
                      ScaffoldMessenger.of(context).showSnackBar(snackBar);
                      widget.refresh();
                    }).catchError((e) {
                      var snackBar = SnackBar(content: Text("${e.error.toString()}: ${e.message
                          .toString()}"));
                      ScaffoldMessenger.of(context).showSnackBar(snackBar);
                    }).whenComplete(() {
                      _rateLimitController.clear();
                      _passwordController.clear();
                      _usernameController.clear();
                    });

                  }
                }
              ),
            ],
          ),
        ),
      ),
    );
  }

}