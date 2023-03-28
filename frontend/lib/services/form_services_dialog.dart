import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:frontend/services/services_request.dart';
import 'package:frontend/widgets/error_alert_dialog.dart';
import 'dart:html' as html;

class FormServiceDialog extends StatefulWidget {

  final WidgetData widgetData;
  final bool tokenRefreshed;
  // final Function() onSubmit;

  const FormServiceDialog({
    super.key,
    required this.widgetData,
    required this.tokenRefreshed,
    // required this.onSubmit,
  });

  @override
  _FormServiceDialogState createState() => _FormServiceDialogState();

}

class _FormServiceDialogState extends State<FormServiceDialog> {

  final GlobalKey<FormState> _dialog = GlobalKey<FormState>();

  late Map<String, TextEditingController> _controller;

  Map<String, TextEditingController> onControllers() {
    Map<String, TextEditingController> controllers = {};
    for (Param item in widget.widgetData.params) {
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
    if (widget.widgetData.params.isEmpty) {
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
            onPressed: () async {
              try {
                CreateWidgetResult res = await createWidgetRequest(
                    widget.widgetData.name, widget.widgetData.description, widget
                    .widgetData
                    .icon, widget.widgetData.enabled, widget.widgetData.params);
                var snackBar = SnackBar(content: Text(res.message));
                ScaffoldMessenger.of(context).showSnackBar(snackBar);
                Navigator.of(context, rootNavigator: true).pop();
                if (!widget.tokenRefreshed) {
                  String checkToken = await checkTokensRequest(widget.widgetData.icon);
                  if (checkToken == "Nothing to refresh") {
                    var snackyBar = const SnackBar(content: Text("Nothing to refresh"));
                    ScaffoldMessenger.of(context).showSnackBar(snackyBar);
                  } else {
                    var snackyBar = const SnackBar(content: Text("Redirecting to refresh token..."));
                    ScaffoldMessenger.of(context).showSnackBar(snackyBar);
                    html.window.open(checkToken,"_self");
                  }
                }
              } on ServicesError catch (e) {
                var errorDialog = ErrorAlertDialog(type: e.error, message: "Caused: ${e.message}");
                showDialog(context: context, builder: (BuildContext context) => errorDialog);
              }
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
          children: widget.widgetData.params.map((e) => Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextFormField(
              keyboardType: e.type == "number" ? TextInputType.number : TextInputType.text,
              inputFormatters: <TextInputFormatter>[
                e.type == "number" ? FilteringTextInputFormatter.digitsOnly : FilteringTextInputFormatter
                    .singleLineFormatter,
              ],
              controller: _controller[e.key],
              validator: (value) {
                if (e.required) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter ${e.type}';
                  }
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
              for (Param item in widget.widgetData.params) {
                if (!item.required && _controller[item.key]!.text.isNotEmpty) {
                  item.value = _controller[item.key]!.text;
                } else if (item.required && _controller[item.key]!.text.isNotEmpty) {
                  item.value = _controller[item.key]!.text;
                }
              }
              createWidgetRequest(
                  widget.widgetData.name, widget.widgetData.description, widget
                  .widgetData
                  .icon, widget.widgetData.enabled, widget.widgetData.params).then((res) {
                  var snackBar = SnackBar(content: Text(res.message));
                  ScaffoldMessenger.of(context).showSnackBar(snackBar);
                  Navigator.of(context, rootNavigator: true).pop();
              }).catchError((e) {
                var errorDialog = ErrorAlertDialog(type: e.error.toString(), message: "Caused: ${e.message.toString()}");
                showDialog(context: context, builder: (BuildContext context) => errorDialog);
              });
              if (!widget.tokenRefreshed) {
                if (widget.widgetData.icon != "papi") {
                  checkTokensRequest(widget.widgetData.icon).then((value) {
                    if (value == "Nothing to refresh") {
                      var snackyBar = const SnackBar(content: Text("Nothing to refresh"));
                      ScaffoldMessenger.of(context).showSnackBar(snackyBar);
                    } else {
                      var snackyBar = const SnackBar(content: Text("Redirecting to refresh token..."));
                      ScaffoldMessenger.of(context).showSnackBar(snackyBar);
                      html.window.open(value, "_self");
                    }
                  }).catchError((e) {
                    var errorDialog = ErrorAlertDialog(type: e.error.toString(), message: "Caused: ${e.message.toString()}");
                    showDialog(context: context, builder: (BuildContext context) => errorDialog);
                  });
                }
              }
            }
          },
          child: const Text("Add"),
        ),
      ],
    );
  }
}