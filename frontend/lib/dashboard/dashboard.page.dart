import 'dart:async';
import 'package:flutter/material.dart';
import 'package:frontend/dashboard/dashboard.request.dart';
import 'package:frontend/dashboard/dashboard_container.dart';
import 'package:frontend/widgets/logged_app_bar.dart';
import 'package:localstorage/localstorage.dart';
import 'package:reorderables/reorderables.dart';

class Dashboard extends StatefulWidget {

  const Dashboard({super.key});

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {

  final LocalStorage storage = LocalStorage('user.json');

  late Future<List<WidgetDatas>> future;

  late List<WidgetDatas> cpy;

  // final StreamController<List<WidgetData>> _widgetsStreamCtrl = StreamController<List<WidgetData>>.broadcast();
  // Stream<List<WidgetData>> get onCurrentUserChanged => _widgetsStreamCtrl.stream;
  // void _updateWidgets(List<WidgetData> widgets) => _widgetsStreamCtrl.add();

  // final List<DashboardContainer> _widgets = <DashboardContainer> [
  //   DashboardContainer(
  //       widget: WidgetData(
  //         name: "List Server",
  //         icon: "discord",
  //         description: "List a certain amount of server",
  //         enabled: false,
  //         idx: 0,
  //         result: "no_data",
  //         params: [
  //           Param(key: "How many?", value: "Number", type: "number", required: true),
  //         ],
  //       ),
  //     ),
  // DashboardContainer(
  //     widget: WidgetData(
  //       name: "Last post",
  //       icon: "reddit",
  //       description: "Show your latest post",
  //       enabled: true,
  //       idx: 1,
  //       result: "no_data",
  //       params: [],
  //     ),
  //   ),
  // ];

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

  refresh() {
    setState(() {
      future = getMyWidgets();
    });
    // future = getMyWidgets();
  }

  late Timer timer;

  @override
  void initState() {
    super.initState();
    future = getMyWidgets();
    var reload = Duration(milliseconds: storage.getItem('rateLimit'));
    timer = Timer.periodic(reload, (Timer t) => setState(() {
      future = getMyWidgets();
    }));
    cpy = <WidgetDatas>[];
  }

  @override
  void dispose() {
    super.dispose();
    timer.cancel();
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: const LoggedAppBar(title: 'Dashboard'),
      // body: ReorderableWrap(
      //   spacing: 8.0,
      //   runSpacing: 4.0,
      //   padding: const EdgeInsets.all(8),
      //   needsLongPressDraggable: false,
      //
      //   onReorder: (int oldIndex, int newIndex) {
      //     setState(() {
      //       if (oldIndex < newIndex) {
      //         newIndex -= 1;
      //       }
      //       var item = _widgets.removeAt(oldIndex);
      //       _widgets.insert(newIndex, item);
      //     });
      //   },
      //   children: [
      //     ListTile(
      //       title: _widgets[0]
      //     ),
      //     ListTile(
      //         title: _widgets[1]
      //     ),
      //   ]
      // ),
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            const SizedBox(height: 20.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {
                    updateWidgetPositionRequest(body: cpy).then((value) => refresh());
                  },
                  child: const Text("Save order")
                ),
                const SizedBox(width: 20.0),
                ElevatedButton(
                  onPressed: () {
                    refresh();
                  },
                  child: const Text("Refresh")
                ),
              ],
            ),
            const SizedBox(height: 20.0),
            FutureBuilder(
              future: future,
              builder: (BuildContext context, AsyncSnapshot<List<WidgetDatas>> snapshot) {
                if (snapshot.hasData) {
                  return ReorderableWrap(
                    onReorder: (oldIdx, newIdx) {
                      setState(() {
                        var tmp = snapshot.data!.removeAt(oldIdx);
                        snapshot.data!.insert(newIdx, tmp);
                        for (var data in snapshot.data!) {
                          data.idx = snapshot.data!.indexOf(data);
                        }
                        cpy = snapshot.data!;
                      });
                    },
                    needsLongPressDraggable: false,
                    children: [
                      for (final item in snapshot.data!)
                        Center(
                          child: ListTile(
                            title: DashboardContainer(
                              widget: item,
                              future: refresh,
                            )
                          ),
                        )
                    ],
                  );
                } else if (snapshot.hasError) {
                  return Center(child: Text(snapshot.error.toString()));
                }
                return const Center(child: CircularProgressIndicator());
              }
            ),
          ],
        ),
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