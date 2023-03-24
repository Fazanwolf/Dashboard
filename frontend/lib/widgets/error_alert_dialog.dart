import 'package:flutter/material.dart';

class ErrorAlertDialog extends StatefulWidget {

  final String type;
  final String message;

  const ErrorAlertDialog({
    super.key,
    required this.type,
    required this.message,
  });

  @override
  _ErrorAlertDialogState createState() => _ErrorAlertDialogState();

}

class _ErrorAlertDialogState extends State<ErrorAlertDialog> {

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {

    return AlertDialog(
      title: Text("Error ${widget.type}"),
      content: Text(widget.message),
      backgroundColor: Color(Colors.red[100]!.value),
      shape:
      RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      actions: <Widget>[
        TextButton(
          onPressed: () {
            Navigator.of(context, rootNavigator: true).pop();
          },
          child: const Text("Ok"),
        ),
      ],
    );
  }
}