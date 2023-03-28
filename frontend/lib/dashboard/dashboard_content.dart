import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class DashboardContent extends StatefulWidget {

  final String result;
  final String type;

  const DashboardContent({
    super.key,
    required this.result,
    required this.type
  });

  @override
  _DashboardContentState createState() => _DashboardContentState();
}

class DiscordData {
  final String name;
  final String icon;

  DiscordData({required this.name, required this.icon});

  factory DiscordData.fromJson(Map<String, dynamic> json) {
    return DiscordData(
      name: json['name'] as String,
      icon: json['icon'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'icon': icon,
  };
}

class PapiData {
  final String name;
  final int age;
  final String nationality;
  final String ethnicity;
  final String cup_size;
  final String tats;
  final int rank;
  final String link;

  PapiData({
    required this.name,
    required this.age,
    required this.nationality,
    required this.ethnicity,
    required this.link,
    required this.cup_size,
    required this.rank,
    required this.tats
  });

  factory PapiData.fromJson(Map<String, dynamic> json) {
    return PapiData(
      name: json['name'] as String,
      age: json['age'] as int,
      nationality: json['nationality'] as String,
      ethnicity: json['ethnicity'] as String,
      cup_size: json['cup_size'] as String,
      tats: json['tats'] as String,
      rank: json['rank'] as int,
      link: json['link'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'age': age,
    'nationality': nationality,
    'ethnicity': ethnicity,
    'cup_size': cup_size,
    'tats': tats,
    'rank': rank,
    'link': link,
  };
}

class WakatimeData {
  final String time;

  WakatimeData({required this.time});

  factory WakatimeData.fromJson(Map<String, dynamic> json) {
    return WakatimeData(
      time: json['time'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'time': time,
  };
}


class _DashboardContentState extends State<DashboardContent> {


  @override
  void initState() {
    super.initState();
  }

  late List<DiscordData> discordData;
  late WakatimeData wakatimeData;
  late List<PapiData> papiData;


  _launchURL(url) async {
    Uri _url = Uri.parse(url);
    await launchUrl(_url);
  }

  @override
  Widget build(BuildContext context) {
    discordData = <DiscordData> [];
    wakatimeData = WakatimeData(time: "");
    papiData = <PapiData> [];

    if (widget.result == 'no_data') {
      return const Padding(
        padding: EdgeInsets.all(50.0),
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (widget.result[0] == '[') {
      if (widget.type == 'discord') {
        discordData = (jsonDecode(widget.result) as List).map((i) => DiscordData.fromJson(i)).toList();
      }
      if (widget.type == 'papi') {
        papiData = (jsonDecode(widget.result) as List).map((i) => PapiData.fromJson(i)).toList();
      }
    }
    if (widget.type == 'wakatime') {
      wakatimeData = WakatimeData.fromJson(jsonDecode("${widget.result}"));
    }

    var discordContent = Expanded(
      child: SingleChildScrollView(
        child: Column(
          children: [
            for (DiscordData item in discordData)
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.network(item.icon,width: 50, height: 50),
                    const SizedBox(width: 10),
                    Text(item.name),
                  ],
                ),
              ),
          ]
        )
      )
    );

    var papiContent = Expanded(
      child: SingleChildScrollView(
        child: Column(
          children: [
            for (PapiData item in papiData)
              Card(
                shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(10))),
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('Name: '),
                          Text(item.name),
                          const SizedBox(width: 20),
                          const Text('Age: '),
                          Text(item.age.toString())
                        ],
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('Nationality: '),
                          Text(item.nationality),
                          const SizedBox(width: 20),
                          const Text('Ethnicity: '),
                          Text(item.ethnicity)
                        ],
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('Cup size: '),
                          Text(item.cup_size),
                        ],
                      ),
                      Text(item.tats, overflow: TextOverflow.ellipsis, maxLines: 2, softWrap: false),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('Rank: '),
                          Text(item.rank.toString()),
                          const SizedBox(width: 20),
                          const Text('Link: '),
                          InkWell(
                            onTap: () async {
                              await _launchURL(item.link);
                            },
                            child: Text(item.link,
                              style: const TextStyle(
                                color: Colors.blue,
                                decoration: TextDecoration.underline,
                              ),
                            )
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
          ]
        )
      )
    );

    var wakatimeContent = Padding(
      padding: const EdgeInsets.all(50),
      child: Text(wakatimeData.time, style: const TextStyle(fontSize: 30))
    );

    if (widget.type == 'discord') {
      return discordContent;
    } else if (widget.type == 'wakatime') {
      return wakatimeContent;
    } else if (widget.type == 'papi') {
      return papiContent;
    }
    else {
      return const Center(child: CircularProgressIndicator());
    }
  }
}