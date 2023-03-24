import 'package:flutter/material.dart';

class ResetPassword extends StatefulWidget {
  const ResetPassword({super.key});

  @override
  _ResetPasswordState createState() => _ResetPasswordState();
}

class _ResetPasswordState extends State<ResetPassword> {

  bool _passwordVisible = false;
  bool _checkPasswordVisible = false;
  String password = "";
  String checkPassword = "";

  @override
  void initState() {
    super.initState();
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
                    TextFormField(
                      keyboardType: TextInputType.text,
                      obscureText: !_passwordVisible,
                      decoration: InputDecoration(
                        border: const OutlineInputBorder(),
                        labelText: 'Password',
                        hintText: 'Enter your password',
                        prefixIcon: const Icon(Icons.lock),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _passwordVisible ? Icons.visibility : Icons.visibility_off,
                          ),
                          onPressed: () {
                            setState(() {
                              _passwordVisible = !_passwordVisible;
                            });
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 10.0),
                    TextFormField(
                      keyboardType: TextInputType.text,
                      obscureText: !_checkPasswordVisible,
                      decoration: InputDecoration(
                        border: const OutlineInputBorder(),
                        labelText: 'Confirm password',
                        hintText: 'Enter your password again',
                        prefixIcon: const Icon(Icons.lock),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _checkPasswordVisible ? Icons.visibility : Icons.visibility_off,
                          ),
                          onPressed: () {
                            setState(() {
                              _checkPasswordVisible = !_checkPasswordVisible;
                            });
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 10.0),
                    ElevatedButton(
                      onPressed: () {},
                      style: ButtonStyle(
                        padding: const MaterialStatePropertyAll(EdgeInsets.symmetric(vertical: 14.0, horizontal: 80.0)),
                        backgroundColor: const MaterialStatePropertyAll(Colors.blueAccent),
                        shape: MaterialStatePropertyAll(
                          RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                        ),
                      ),
                      child: const Text(
                        'Reset Password',
                        style: TextStyle(
                          fontSize: 18.0,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}