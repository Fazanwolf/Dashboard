import 'dart:html';

import 'package:flutter/material.dart';
import 'package:frontend/widgets/logged_app_bar.dart';
import 'package:localstorage/localstorage.dart';
import 'package:reorderables/reorderables.dart';
import 'package:frontend/widgets/widget_container.dart';

class Dashboard extends StatefulWidget {

  const Dashboard({super.key});

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {

  final LocalStorage storage = LocalStorage('user.json');

  final List<Widget> _list = <Widget> [
    ListTile(title: WidgetContainer(
      state: false,
      icon: 'discord',
      data: 'UwU Im the definition of perfection UwU\n Dont cry you mothasnickers',
      title: 'Discord - Your number of server',
      params: {
        "Test0": "Test0",
        "Test1": "Test1",
        "Test2": "Test2",
      },
    ),),
    ListTile(title: WidgetContainer(
      state: false,
      icon: 'discord',
      data: 'UwU Im the definition of perfection UwU\n Dont cry you mothasnickers',
      title: 'Discord - Your number of server',
      params: {
        "Test0": "Test0",
        "Test1": "Test1",
        "Test2": "Test2",
      },
    ),),
    ListTile(title: WidgetContainer(
      state: false,
      icon: 'discord',
      data: 'UwU Im the definition of perfection UwU\n Dont cry you mothasnickers',
      title: 'Discord - Your number of server',
      params: {
        "Test0": "Test0",
        "Test1": "Test1",
        "Test2": "Test2",
      },
    ),),
  ];

  // late final AnimationController _controller = AnimationController(
  //   duration: const Duration(seconds: 3),
  //   vsync: this,
  // )..repeat(reverse: false);
  //
  // late final Animation<double> _animation = CurvedAnimation(
  //   parent: _controller,
  //   curve: Curves.bounceIn,
  // );
  //
  // @override
  // void dispose() {
  //   _controller.dispose();
  //   super.dispose();
  // }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: const LoggedAppBar(title: 'Dashboard'),
      body: ReorderableWrap(
        onReorder: (oldIdx, newIdx) {
          setState(() {
            var tmp = _list.removeAt(oldIdx);
            _list.insert(newIdx, tmp);
          });
        },
        children: _list,
        needsLongPressDraggable: false,
      ),
      // body: ReorderableListView(
      //   padding: const EdgeInsets.symmetric(horizontal: 200.0),
      //   onReorder: (int oldIndex, int newIndex) {
      //     setState(() {
      //       if (oldIndex < newIndex) {
      //         newIndex -= 1;
      //       }
      //       final int item = _items.removeAt(oldIndex);
      //       _items.insert(newIndex, item);
      //     });
      //   },
      //   children: [
      //     for (final item in _items)
      //       ListTile(
      //         key: ValueKey(item),
      //         leading: const CircleAvatar(
      //           child: Icon(Icons.discord_outlined),
      //         ),
      //         title: Text('Item #$item')
      //       )
      //   ],
      // ),
    );
  }

}