import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/dashboard/dashboard.request.dart';
import 'package:frontend/dashboard/form_dashboard_dialog.dart';
import 'package:frontend/dashboard/form_delete_dialog.dart';
import 'package:frontend/services/services_request.dart';
import 'package:frontend/widgets/custom_description.dart';
import 'package:frontend/widgets/custom_title.dart';
import 'package:frontend/services/form_services_dialog.dart';
import 'package:localstorage/localstorage.dart';

class DashboardContainer extends StatefulWidget {
  late WidgetDatas widget;
  late Function future;

  DashboardContainer(
      {super.key, required this.widget, required this.future});

  @override
  _DashboardContainerState createState() => _DashboardContainerState();
}

class _DashboardContainerState extends State<DashboardContainer> {
  LocalStorage storage = LocalStorage('user.json');

  @override
  void initState() {
    super.initState();
  }

  Map<String, Widget> iconMapping = {
    'discord': const Icon(Icons.discord, size: 45),
    'reddit': const Icon(Icons.reddit, size: 45),
    'wakatime': SvgPicture.asset("icons/wakatime.svg", height: 45, width: 45, color: Colors.white),
    'papi': SvgPicture.asset("icons/underage.svg", height: 45, width: 45, color: Colors.white),
  };

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Center(
        child: Container(
          padding: const EdgeInsets.all(8.0),
          height: 175.0,
          width: 800,
          decoration: BoxDecoration(
            borderRadius: const BorderRadius.all(Radius.circular(10.0)),
            color: widget.widget.enabled ? Colors.white : Colors.grey,
          ),
          child: Column(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: CircleAvatar(
                      radius: 30.0,
                      child: iconMapping[widget.widget.icon],
                    ),
                  ),
                  const SizedBox(width: 10),
                  CustomTitle(title: widget.widget.name, width: widget.widget.name.length * 20.0, textAlign: TextAlign
                      .start),
                  Expanded(child: Text(widget.widget.description, textAlign: TextAlign.left, maxLines: 2, overflow:
                  TextOverflow.ellipsis, style: const TextStyle(fontSize: 18.0), softWrap: false)),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: ElevatedButton(onPressed: () {
                      var formDialog = FormDashboardDialog(widgetData: widget.widget, future: widget.future);
                      showDialog(context: context, builder: (BuildContext context) => formDialog);
                    }, child: const Text("Edit")),
                  ),
                  Padding(padding: const EdgeInsets.all(8.0),
                    child: Material(
                      color: Colors.red,
                      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(8.0))),
                      child: IconButton(
                        highlightColor: Colors.transparent,
                        focusColor: Colors.transparent,
                        splashColor: Colors.transparent,
                        onPressed: () {
                          var deleteForm = FormDeleteDialog(id: widget.widget.id, future: widget.future);
                          showDialog(context: context, builder: (BuildContext context) => deleteForm);
                        },
                        icon: const Icon(Icons.delete, color: Colors.white),
                        tooltip: "Delete widget"),
                    )
                  )
                ],
              ),
              Divider(
                color: widget.widget.enabled ? Colors.grey : Colors.white,
                thickness: 1,
              ),
              Expanded(child: Text(widget.widget.result, textAlign: TextAlign.left))
            ],
          ),
        ),
      ),
    );
  }
}
