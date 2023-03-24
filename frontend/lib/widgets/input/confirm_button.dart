import 'package:flutter/material.dart';

class ConfirmButton extends StatefulWidget {
  final String text;
  final Function()? onPressed;

  const ConfirmButton({super.key, required this.text, required this.onPressed});

  @override
  _ConfirmButtonState createState() => _ConfirmButtonState();
}

class _ConfirmButtonState extends State<ConfirmButton> {

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: widget.onPressed,
      style: ButtonStyle(
        padding: const MaterialStatePropertyAll(EdgeInsets.symmetric(vertical: 14.0, horizontal: 80.0)),
        backgroundColor: const MaterialStatePropertyAll(Colors.blueAccent),
        shape: MaterialStatePropertyAll(
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
        ),
      ),
      child: Text(
      widget.text,
        style: const TextStyle(
          fontSize: 18.0,
        ),
      ),

    );
  }
}
