import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/widgets/input/basic_text_input.dart';
import 'package:frontend/widgets/custom_description.dart';
import 'package:frontend/widgets/custom_title.dart';

class WidgetContainer extends StatefulWidget {

  late String icon;
  late String title;
  late String data;
  late bool state;
  late Map<String, String> params;

  WidgetContainer({
    super.key,
    required this.title,
    required this.data,
    required this.icon,
    required this.state,
    required this.params
  });

  @override
  _WidgetContainerState createState() => _WidgetContainerState();
}

class _WidgetContainerState extends State<WidgetContainer> {

  late double height;
  late double width;

  Map<String, TextEditingController> onControllers() {
    Map<String, TextEditingController> controllers = {};
    for (MapEntry<String,String> item in widget.params.entries) {
      controllers[item.key] = TextEditingController();
    }
    return controllers;
  }

  late Map<String, TextEditingController> _controller;

  @override
  void initState() {
    super.initState();
    _controller = onControllers();

    if (widget.params.isEmpty) {
      width = 580;
      height = 200;
    } else {
      width = 880;
      height = 260;
    }

    if (widget.title.isEmpty) {
      widget.title = 'No title';
    }
    if (widget.data.isEmpty) {
      widget.data = 'No data';
    }
    if (widget.icon.isEmpty) {
      widget.icon = 'papi';
    }
  }

  Map<String, Widget> iconMapping = {
    'discord': const Icon(Icons.discord, size: 95),
    'reddit': const Icon(Icons.reddit, size: 95),
    'wakatime': SvgPicture.asset("icons/wakatime.svg", height: 95, width: 95),
    'papi' : const Icon(Icons.do_not_disturb_off, size: 95)
  };


  @override
  Widget build(BuildContext context) {
    var divider = widget.params.isEmpty
      ? const SizedBox(width: 8)
      : VerticalDivider(
      color: Colors.grey[400],
      thickness: 1.0,
    );

    var basic_update = widget.params.isEmpty
      ? const SizedBox(width: 2.0)
      : Column(
        children: <Widget> [
          const Text(
            'Update:',
            textAlign: TextAlign.center,
            style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold
            ),
          ),
          const SizedBox(height: 8.0),
          for (MapEntry<String, String> item in widget.params.entries)
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: SizedBox(
              width: 185,
              height: 50,
              child: BasicTextInput(label: item.key, hintText: 'Enter the ${item.key}', icon: Icons.add,
                  controller: _controller[item.key]!,
                  validator: (value) {
                    if (value != null && value.isNotEmpty) {
                      if (value.length < 3) {
                        return "That must contain at least 3 characters.";
                      }
                      if (value.length > 30) {
                        return "That must contain at most 30 characters.";
                      }
                    }
                    return null;
                  }
              ),
            ),
          )
        ],
      );

    return Center(
      child: SizedBox(
        height: height,
        width: width,
        child: Card(
          color: Colors.white,
          child: Padding(
            padding: const EdgeInsets.all(10.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget> [
                CircleAvatar(
                  radius: 60.0,
                  child: iconMapping[widget.icon],
                ),
                VerticalDivider(
                  color: Colors.grey[400],
                  thickness: 1.0,
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: <Widget> [
                      Text(
                        widget.title,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        widget.data,
                        textAlign: TextAlign.left,
                        style: const TextStyle(
                            fontSize: 16
                        ),
                      ),
                    ],
                  ),
                ),
                divider,
                basic_update,
                VerticalDivider(
                  color: Colors.grey[400],
                  thickness: 1.0,
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const Text("Enable?",style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8.0),
                      Checkbox(
                        value: widget.state, onChanged: (trigger){
                        setState(() {
                          if (trigger != null) {
                            widget.state = !widget.state;
                          }
                        }
                      );
                    }),
                  ]),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

}
