import 'package:flutter/material.dart';
import 'package:frontend/services/services_request.dart';

class FormDialog extends StatefulWidget {

  final List<Param> params;
  // final Function() onSubmit;

  const FormDialog({
    super.key,
    required this.params,
    // required this.onSubmit,
  });

  @override
  _FormDialogState createState() => _FormDialogState();

}

class _FormDialogState extends State<FormDialog> {

  final GlobalKey<FormState> _dialog = GlobalKey<FormState>();

  late Map<String, TextEditingController> _controller;

  Map<String, TextEditingController> onControllers() {
    Map<String, TextEditingController> controllers = {};
    for (Param item in widget.params) {
      controllers[item.key] = TextEditingController();
    }
    return controllers;
  }

  final int _color = Colors.white.value;

  @override
  void initState() {
    super.initState();
    _controller = onControllers();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.params.isEmpty) {
      return AlertDialog(
        title: const Text("Option for the widget"),
        content: const Text("No options available"),
        backgroundColor: Color(_color),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.of(context, rootNavigator: true).pop();
            },
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context, rootNavigator: true).pop();
            },
            child: const Text("Add"),
          ),
        ],
      );
    }
    return AlertDialog(
      title: const Text("Option for the widget"),
      content: Form(
        key: _dialog,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: widget.params.map((e) => Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextFormField(
              controller: _controller[e.key],
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter ${e.value}';
                }
                return null;
              },
              decoration: InputDecoration(
                labelText: e.key,
                hintText: e.value,
              ),
            ),
          )).toList(),
        ),
      ),
      backgroundColor: Color(_color),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      actions: <Widget>[
        TextButton(
          onPressed: () {
            Navigator.of(context, rootNavigator: true).pop();
          },
          child: const Text("Cancel"),
        ),
        TextButton(
          onPressed: () {
            if (_dialog.currentState!.validate()) {
              // widget.onSubmit();
              Navigator.of(context, rootNavigator: true).pop();
            }
          },
          child: const Text("Add"),
        ),
      ],
    );
  }
}