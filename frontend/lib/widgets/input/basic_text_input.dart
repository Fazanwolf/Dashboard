import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class BasicTextInput extends StatefulWidget {
  final String label;
  final String hintText;
  final IconData icon;
  final TextEditingController controller;

  late String? Function(String?)? validator = (value) {
    if (value == null || value.isEmpty) {
      return 'Please fill this champ';
    }
    return null;
  };

  BasicTextInput(
      {super.key,
      required this.label,
      required this.hintText,
      required this.icon,
      this.validator,
      required this.controller,
      });

  @override
  _BasicTextInputState createState() => _BasicTextInputState();
}

class _BasicTextInputState extends State<BasicTextInput> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      validator: widget.validator,
      keyboardType: TextInputType.text,
      decoration: InputDecoration(
        border: const OutlineInputBorder(),
        labelText: widget.label,
        hintText: widget.hintText,
        prefixIcon: Icon(widget.icon),
      ),
    );
  }
}
