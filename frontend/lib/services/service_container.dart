import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/services/services_request.dart';
import 'package:frontend/widgets/custom_title.dart';
import 'package:frontend/services/form_services_dialog.dart';
import 'package:localstorage/localstorage.dart';
import 'dart:html' as html;

class ServiceContainer extends StatefulWidget {
  late String icon;
  late String title;
  late String description;
  late List<WidgetData> widgets;

  ServiceContainer(
      {super.key, required this.title, required this.description, required this.icon, required this.widgets});

  @override
  _ServiceContainerState createState() => _ServiceContainerState();
}


class _ServiceContainerState extends State<ServiceContainer> {
  LocalStorage storage = LocalStorage('user.json');

  late bool tokenRefreshed = true;

  @override
  void initState() {
    super.initState();
    if (widget.title.isEmpty) {
      widget.title = 'No title';
    }
    if (widget.description.isEmpty) {
      widget.description = 'No description';
    }
    if (widget.icon.isEmpty) {
      widget.icon = 'papi';
    }
    tokenRefreshed = false;
    checkTokensRequest(widget.icon).then((value) {
      if (value == "Nothing to refresh") {
        setState(() {
          tokenRefreshed = true;
        });
      }
    });
  }

  @override
  void dispose() {
    super.dispose();
    tokenRefreshed = tokenRefreshed;
  }

  Map<String, Widget> iconMapping = {
    'discord': const Icon(Icons.discord, size: 45),
    'reddit': const Icon(Icons.reddit, size: 45),
    'wakatime': SvgPicture.asset("icons/wakatime.svg", height: 45, width: 45, color: Colors.white),
    'papi': SvgPicture.asset("icons/underage.svg", height: 45, width: 45, color: Colors.white),
  };

  @override
  Widget build(BuildContext context) {
    final len = widget.widgets.length;
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Center(
        child: Container(
          padding: const EdgeInsets.all(8.0),
          height: 175.0 + ((len - 1) * 55 + 3 * len),
          width: 800,
          decoration: const BoxDecoration(
            borderRadius: BorderRadius.all(Radius.circular(10.0)),
            color: Colors.white,
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
                      child: iconMapping[widget.icon],
                    ),
                  ),
                  const SizedBox(width: 10),
                  CustomTitle(title: widget.title, width: widget.title.length * 20.0, textAlign: TextAlign.start),
                  Expanded(child: Text(widget.description, textAlign: TextAlign.left, maxLines: 2, overflow:
                  TextOverflow.ellipsis, style: const TextStyle(fontSize: 18.0), softWrap: false)),
                  Padding(padding: const EdgeInsets.all(8.0),
                    child: Material(
                    color: Colors.cyan,
                    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(8.0))),
                    child: IconButton(
                      highlightColor: Colors.transparent,
                      focusColor: Colors.transparent,
                      splashColor: Colors.transparent,
                      onPressed: () async {
                        String res = await checkTokensRequest(widget.icon);
                        if (res == "Nothing to refresh") {
                          setState(() {
                            tokenRefreshed = true;
                          });
                          var snackyBar = const SnackBar(content: Text("Nothing to refresh"));
                          ScaffoldMessenger.of(context).showSnackBar(snackyBar);
                        } else {
                          setState(() {
                            tokenRefreshed = false;
                          });
                          var snackyBar = const SnackBar(content: Text("Redirecting to refresh token..."));
                          ScaffoldMessenger.of(context).showSnackBar(snackyBar);
                          html.window.open(res, "_self");
                        }
                      },
                      icon: Icon(tokenRefreshed ? Icons.verified : Icons.refresh),
                      tooltip: "Check if you need to refresh your token"),
                    )
                  )
                  //   ],
                  // ),
                  // const SizedBox(width: 20.0),
                  // Material(
                  //   child: IconButton(
                  //     onPressed: () {},
                  //     icon: const Icon(Icons.add),
                  //     splashRadius: 50.0,
                  //     color: Color(Colors.green.value),
                  //     style: ButtonStyle(
                  //       backgroundColor: MaterialStatePropertyAll(Color(Colors.green[400]!.value))
                  //     ),
                  //   ),
                  // )
                ],
              ),
              const Divider(
                color: Colors.grey,
                thickness: 1,
              ),
              for (var widget in widget.widgets)
                Container(
                  margin: const EdgeInsets.symmetric(vertical: 2.0),
                  padding: const EdgeInsets.all(8.0),
                  decoration: const BoxDecoration(
                    borderRadius: BorderRadius.all(Radius.circular(10.0)),
                    color: Colors.lightBlueAccent,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      const SizedBox(width: 20.0),
                      // Column(
                      //   children: [
                      SizedBox(
                        width: 100,
                        child: Text(
                          widget.name,
                          style: const TextStyle(
                            fontSize: 20.0,
                            fontWeight: FontWeight.w900,
                          ),
                          textAlign: TextAlign.center,
                          softWrap: false,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 30.0),
                      Expanded(child: Text(
                        widget.description,
                        style: const TextStyle(
                          fontSize: 18.0,
                        ),
                        textAlign: TextAlign.left,
                        softWrap: false,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      )),
                      const SizedBox(width: 20.0),
                      Material(
                        shape: const RoundedRectangleBorder(
                          borderRadius: BorderRadius.all(Radius.circular(8.0)),
                        ),
                        child: IconButton(
                          tooltip: "Add new widget",
                          onPressed: () {
                            var formDialog = FormServiceDialog(widgetData: widget, tokenRefreshed: tokenRefreshed);
                            showDialog(context: context, builder: (BuildContext context) => formDialog);
                          },
                          icon: const Icon(Icons.add),
                          splashRadius: 50.0,
                          color: Color(Colors.green.value),
                          style: ButtonStyle(
                            backgroundColor: MaterialStatePropertyAll(Color(Colors.green[400]!.value)),
                          )
                        ),
                      )
                    ],
                  ),
                )
            ],
          ),
        ),
      ),
    );
  }
}
