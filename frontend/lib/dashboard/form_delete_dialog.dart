import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:frontend/dashboard/dashboard.request.dart';
import 'package:frontend/services/services_request.dart';
import 'package:frontend/widgets/error_alert_dialog.dart';
import 'dart:html' as html;

class FormDeleteDialog extends StatefulWidget {

  final String id;
  final Function future;

  const FormDeleteDialog({
    super.key,
    required this.future,
    required this.id,
  });

  @override
  _FormDeleteDialogState createState() => _FormDeleteDialogState();

}

class _FormDeleteDialogState extends State<FormDeleteDialog> {
  @override
  void initState() {
    super.initState();
  }
  
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Are you sure you want to delete this widget?"),
      backgroundColor: Color(Colors.white.value),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      actions: <Widget>[
        TextButton(
          onPressed: () {
            Navigator.of(context, rootNavigator: true).pop();
          },
          child: const Text("Cancel"),
        ),
        TextButton(
          onPressed: () async {
              try {
                WidgetResult res = await deleteWidgetRequest(widget.id);
                var snackBar = SnackBar(content: Text(res.message));
                ScaffoldMessenger.of(context).showSnackBar(snackBar);
                Navigator.of(context, rootNavigator: true).pop();
                widget.future();
              } on ServicesError catch (e) {
                var errorDialog = ErrorAlertDialog(type: e.error, message: "Caused: ${e.message}");
                showDialog(context: context, builder: (BuildContext context) => errorDialog);
              }
          },
          child: const Text("Confirm"),
        ),
      ],
    );
  }
}