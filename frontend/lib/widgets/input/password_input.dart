import 'package:flutter/material.dart';

class PasswordInput extends StatefulWidget {

  bool _passwordVisible = false;
  final String label;
  final String hintText;
  final TextEditingController controller;
  late String? Function(String?)? validator = (value) {
    if (value == null || value.isEmpty) {
      return 'Please enter a password';
    }
    final RegExp passwordExp = RegExp(r"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$");
    if (!passwordExp.hasMatch(value)) {
      return "That must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";
    }
    return null;
  };

  PasswordInput({super.key, required this.label, required this.hintText, required this.controller, this.validator});

  @override
  _PasswordInputState createState() => _PasswordInputState();
}

class _PasswordInputState extends State<PasswordInput> {

  @override
  void initState() {
    widget._passwordVisible = false;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      validator: widget.validator,
      keyboardType: TextInputType.text,
      obscureText: !widget._passwordVisible,
      controller: widget.controller,
      decoration: InputDecoration(
        border: const OutlineInputBorder(),
        labelText: widget.label,
        hintText: widget.hintText,
        prefixIcon: const Icon(Icons.lock),
        suffixIcon: IconButton(
          tooltip: !widget._passwordVisible ? "Show" : "Hide",
          icon: Icon(
            !widget._passwordVisible ? Icons.visibility : Icons.visibility_off,
          ),
          onPressed: () {
            setState(() {
              widget._passwordVisible = !widget._passwordVisible;
            });
          },
        ),
      ),
    );
  }
}