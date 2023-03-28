import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:frontend/dashboard/dashboard.request.dart';
import 'package:frontend/services/services_request.dart';
import 'package:frontend/widgets/error_alert_dialog.dart';

class FormDashboardDialog extends StatefulWidget {

  final WidgetDatas widgetData;
  late Function future;
  // final Function() onSubmit;

  FormDashboardDialog({
    super.key,
    required this.widgetData,
    required this.future,
    // required this.onSubmit,
  });

  @override
  _FormDashboardDialogState createState() => _FormDashboardDialogState();

}

class _FormDashboardDialogState extends State<FormDashboardDialog> {

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

  late bool _enabled;

  @override
  void initState() {
    super.initState();
    _enabled = widget.widgetData.enabled;
    _controller = onControllers();
  }

  @override
  void dispose() {
    for (Param item in widget.widgetData.params) {
      _controller[item.key]!.dispose();
    }
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    if (widget.widgetData.params.isEmpty) {
      return AlertDialog(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text("Update parameters for the widget"),
            const SizedBox(width: 20),
            Checkbox(
              value: _enabled,
              onChanged: (trigger) {
                setState(() {
                  _enabled = !_enabled;
                });
              }
            )
          ],
        ),
        content: const Text("No parameter available"),
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
              for (Param item in widget.widgetData.params) {
                if (!item.required && _controller[item.key]!.text.isNotEmpty) {
                  item.value = _controller[item.key]!.text;
                } else if (item.required && _controller[item.key]!.text.isNotEmpty) {
                  item.value = _controller[item.key]!.text;
                }
              }
              try {
                WidgetResult res = await updateWidgetRequest(id: widget.widgetData.id, enabled: _enabled, params: widget.widgetData.params);
                var snackBar = SnackBar(content: Text(res.message));
                ScaffoldMessenger.of(context).showSnackBar(snackBar);
                widget.future();
                Navigator.of(context, rootNavigator: true).pop();
              } on ServicesError catch (e) {
                var errorDialog = ErrorAlertDialog(type: e.error, message: "Caused: ${e.message}");
                showDialog(context: context, builder: (BuildContext context) => errorDialog);
              }
            },
            child: const Text("Update"),
          ),
        ],
      );
    }
    return AlertDialog(
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Text("Update parameters for the widget"),
          const SizedBox(width: 20),
          Checkbox(
            value: _enabled,
            onChanged: (trigger) {
              setState(() {
                _enabled = !_enabled;
              });
            }
          )
        ],
      ),
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
              // validator: (value) {
              //   if (value != null && value.isNotEmpty) {
              //     return 'Please enter ${e.type}';
              //   }
              //   return null;
              // },
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
          onPressed: () async {
            for (Param item in widget.widgetData.params) {
              if (!item.required && _controller[item.key]!.text.isNotEmpty) {
                item.value = _controller[item.key]!.text;
              } else if (item.required && _controller[item.key]!.text.isNotEmpty) {
                item.value = _controller[item.key]!.text;
              }
            }
            try {
              WidgetResult res = await updateWidgetRequest(id: widget.widgetData.id, enabled: _enabled, params: widget.widgetData.params);
              var snackBar = SnackBar(content: Text(res.message));
              ScaffoldMessenger.of(context).showSnackBar(snackBar);
              widget.future();
              Navigator.of(context, rootNavigator: true).pop();
            } on ServicesError catch (e) {
              var errorDialog = ErrorAlertDialog(type: e.error, message: "Caused: ${e.message}");
              showDialog(context: context, builder: (BuildContext context) => errorDialog);
            }
          },
          child: const Text("Update"),
        ),
      ],
    );
  }
}