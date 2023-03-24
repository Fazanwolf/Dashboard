import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:localstorage/localstorage.dart';

class Param {
  final String key;
  final String value;

  Param({
    required this.key,
    required this.value,
  });

  factory Param.fromJson(Map<String, dynamic> json) {
    return Param(
      key: json['key'] as String,
      value: json['value'] as String,
    );
  }
}

class WidgetData {
  final String name;
  final String description;
  final String icon;
  final bool enabled;
  final List<Param> params;

  WidgetData({
    required this.name,
    required this.description,
    required this.icon,
    required this.enabled,
    required this.params,
  });

  factory WidgetData.fromJson(Map<String, dynamic> json) {
    return WidgetData(
      name: json['name'] as String,
      description: json['description'] as String,
      icon: json['icon'] as String,
      enabled: json['enabled'] as bool,
      params: List<Param>.from(
          json['params'].map((x) => Param.fromJson(x))),
    );
  }

}

class ServicesResult {
  final String name;
  final String description;
  final String icon;
  final String url;
  final List<WidgetData> widgets;

  ServicesResult({
    required this.name,
    required this.description,
    required this.icon,
    required this.url,
    required this.widgets,
  });

  factory ServicesResult.fromJson(Map<String, dynamic> json) {
    return ServicesResult(
      name: json['name'] as String,
      description: json['description'] as String,
      icon: json['icon'] as String,
      url: json['url'] as String,
      widgets: List<WidgetData>.from(
          json['widgets'].map((x) => WidgetData.fromJson(x))),
    );
  }

}

class ServicesError implements Exception {
  final String message;
  final String error;

  ServicesError({
    required this.message,
    required this.error,
  });

  factory ServicesError.fromJson(Map<String, dynamic> json) {
    return ServicesError(
      message: json['message'] as String,
      error: json['error'] as String,
    );
  }
}

Future<List<ServicesResult>> getServicesRequest() async {
  LocalStorage storage = LocalStorage('user.json');
  
  final headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${storage.getItem("access_token")}",
  };

  final uri = Uri.http("172.20.0.7:8080", "/me/services");
  final response = await http.get(uri, headers: headers);

  if (response.statusCode == 200) {
    print(jsonDecode(response.body));
    return (jsonDecode(response.body) as List).map((i) => ServicesResult.fromJson(i)).toList();
  } else {
    throw ServicesError.fromJson(jsonDecode(response.body));
  }
}

