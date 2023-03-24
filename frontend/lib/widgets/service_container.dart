import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/services/services_request.dart';
import 'package:frontend/widgets/custom_description.dart';
import 'package:frontend/widgets/custom_title.dart';
import 'package:frontend/widgets/form_dialog.dart';

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
  }

  Map<String, Widget> iconMapping = {
    'discord': const Icon(Icons.discord, size: 45),
    'reddit': const Icon(Icons.reddit, size: 45),
    'wakatime': SvgPicture.asset("icons/wakatime.svg", height: 45, width: 45, color: Colors.white),
    'papi': const Icon(Icons.do_not_disturb_off, size: 45)
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
                          onPressed: () {
                            var formDialog = FormDialog(params: widget.params);
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
