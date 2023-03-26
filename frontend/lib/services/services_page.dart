import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:frontend/services/services_request.dart';
import 'package:frontend/widgets/logged_app_bar.dart';
import 'package:frontend/services/service_container.dart';
import 'package:localstorage/localstorage.dart';

class Services extends StatefulWidget {
  const Services({super.key});

  @override
  _ServicesState createState() => _ServicesState();
}

class _ServicesState extends State<Services> {
  LocalStorage storage = LocalStorage('user.json');
  late Future<List<ServicesResult>> services;
  // final List<ServicesResult> _list = <ServicesResult>[
  //   ServicesResult(
  //       name: "Discord",
  //       description: "Discord is a free and secure all-in-one voice and text chat for gamers.",
  //       icon: "discord",
  //       url: "https://discord.com/",
  //       widgets: [
  //         WidgetData(
  //             name: "List server",
  //             description: "List a certain amount of server",
  //             icon: "discord",
  //             enabled: false,
  //             params: [Param(key: "How many?", value: "Number"), Param(key: "Test", value: "SEEEESH")]),
  //         // WidgetData(name: "CV2", description: "No", icon: "discord", enabled: false, params: []),
  //         // WidgetData(name: "MORE", description: "MORE", icon: "discord", enabled: false, params: []),
  //         // WidgetData(name: "MORE", description: "MORE", icon: "discord", enabled: false, params: []),
  //         // WidgetData(name: "MORE", description: "MORE", icon: "discord", enabled: false, params: [])
  //       ]),
  //   ServicesResult(
  //       name: "Wakatime",
  //       description: "WakaTime is a collection of open source IDE plugins for insights about your programming.",
  //       icon: "wakatime",
  //       url: "https://wakatime.com/",
  //       widgets: [
  //         WidgetData(
  //             name: "Global code time",
  //             description: "Show the time you passed to code until today",
  //             icon: "wakatime",
  //             enabled: false,
  //             params: []),
  //       ]),
  //   ServicesResult(
  //       name: "Reddit",
  //       description: "Reddit is an American social news aggregation, content rating, and discussion website.",
  //       icon: "reddit",
  //       url: "https://www.reddit.com/",
  //       widgets: [
  //         WidgetData(
  //             name: "Last posted post",
  //             description: "Show your latest post",
  //             icon: "reddit",
  //             enabled: false,
  //             params: []),
  //       ]),
  // ];

  @override
  void initState() {
    super.initState();
    services = getServicesRequest();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: const LoggedAppBar(title: 'Services'),
      body:  Padding(
        padding: const EdgeInsets.all(8.0),
        child: FutureBuilder<List<ServicesResult>>(
          future: services,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return ListView.builder(
                  itemCount: snapshot.data!.length,
                  itemBuilder: (BuildContext context, int index) {
                    // if (storage.getItem("adultContent") == false && snapshot.data![index].icon == "papi") {
                    //   return Container();
                    // }
                    return ServiceContainer(
                        title: snapshot.data![index].name,
                        description: snapshot.data![index].description,
                        icon: snapshot.data![index].icon,
                        widgets: snapshot.data![index].widgets);
                  });
            } else if (snapshot.hasError) {
              return Center(child: Text(snapshot.error.toString()));
            }
            return const Center(child: CircularProgressIndicator());
          }

        )
        // child: Padding(
        //   padding: const EdgeInsets.all(8.0),
        //   child: ListView.builder(
        //       itemCount: _list.length,
        //       itemBuilder: (BuildContext context, int index) {
        //         return ServiceContainer(
        //             title: _list[index].name,
        //             description: _list[index].description,
        //             icon: _list[index].icon,
        //             widgets: _list[index].widgets);
        //       }),
        // ),
     ),
    );
  }
}
