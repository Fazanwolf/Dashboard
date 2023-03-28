import 'package:flutter/material.dart';

class ConfirmButton extends StatefulWidget {
  final String text;
  final Function()? onPressed;
  final bool isButtonDisabled;

  const ConfirmButton({super.key, required this.text, required this.onPressed, required this.isButtonDisabled});

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
        backgroundColor: MaterialStateProperty.resolveWith<Color>(
                (Set<MaterialState> states) {
              if (states.contains(MaterialState.pressed)) {
                return Colors.blueAccent.withOpacity(0.5);
              } else if (states.contains(MaterialState.disabled)) {
                return Colors.grey;
              }
              return Colors.blueAccent;
            },
        ),
        shape: MaterialStatePropertyAll(
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
        ),
      ),
      child: widget.isButtonDisabled ? const CircularProgressIndicator() : Text(
      widget.text,
        style: const TextStyle(
          fontSize: 18.0,
        ),
      ),
    );
  }
}
