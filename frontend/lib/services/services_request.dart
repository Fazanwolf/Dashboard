import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:localstorage/localstorage.dart';

class Param {
  final String key;
  late String value;
  final bool required;
  final String type;

  Param({
    required this.key,
    required this.value,
    required this.required,
    required this.type,
  });

  factory Param.fromJson(Map<String, dynamic> json) {
    return Param(
      key: json['key'] as String,
      value: json['value'] as String,
      required: json['required'] as bool,
      type: json['type'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'key': key,
    'value': value,
    'required': required,
    'type': type,
  };
}

class WidgetData {
  final String name;
  final String description;
  final String icon;
  final bool enabled;
  final String result;
  final int idx;
  final List<Param> params;

  WidgetData({
    required this.name,
    required this.description,
    required this.icon,
    required this.enabled,
    required this.result,
    required this.idx,
    required this.params,
  });

  factory WidgetData.fromJson(Map<String, dynamic> json) {
    return WidgetData(
      name: json['name'] as String,
      description: json['description'] as String,
      icon: json['icon'] as String,
      enabled: json['enabled'] as bool,
      result: json['result'] as String,
      idx: json['idx'] as int,
      params: List<Param>.from(
          json['params'].map((x) => Param.fromJson(x))).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'description': description,
    'icon': icon,
    'enabled': enabled,
    'result': result,
    'idx': idx,
    'params': params.map((e) => e.toJson()).toList(),
  };

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
          json['widgets'].map((x) => WidgetData.fromJson(x))).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'description': description,
    'icon': icon,
    'url': url,
    'widgets': widgets.map((e) => e.toJson()).toList(),
  };

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
    return (jsonDecode(response.body) as List).map((i) => ServicesResult.fromJson(i)).toList();
  } else {
    throw ServicesError.fromJson(jsonDecode(response.body));
  }
}

class CreateWidgetResult {
  final String message;

  CreateWidgetResult({
    required this.message,
  });

  factory CreateWidgetResult.fromJson(Map<String, dynamic> json) {
    return CreateWidgetResult(
      message: json['message'] as String,
    );
  }
}

Future<String> getNumberOfWidgets() async {
  LocalStorage storage = LocalStorage('user.json');

  final headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${storage.getItem("access_token")}",
  };

  final uri = Uri.http("172.20.0.7:8080", "/me/widgets/number");
  final response = await http.get(uri, headers: headers);

  if (response.statusCode == 200) {
    return response.body;
  } else {
    throw ServicesError.fromJson(jsonDecode(response.body));
  }
}

Future<CreateWidgetResult> createWidgetRequest(String name, String description, String icon, bool enabled,
    List<Param>? params) async {
  LocalStorage storage = LocalStorage('user.json');

  final headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${storage.getItem("access_token")}",
  };

  final uri = Uri.http("172.20.0.7:8080", "/me/widgets");
  final response = await http.post(uri, headers: headers, body: jsonEncode({
    "user": "${storage.getItem('id')}",
    "name": name,
    "description": description,
    "icon": icon,
    "result": "no_data",
    "idx": int.parse(await getNumberOfWidgets()),
    "enabled": enabled,
    "params": params ?? []
  }));

  if (response.statusCode == 201) {
    return CreateWidgetResult.fromJson(jsonDecode(response.body));
  } else {
    throw ServicesError.fromJson(jsonDecode(response.body));
  }
}

Future<String> checkTokensRequest(String platform) async {
  LocalStorage storage = LocalStorage('user.json');

  final queryParameters = {
    "platform": platform,
    "id": "${storage.getItem('id')}"
  };

  final headers = {
    "Content-Type": "application/json",
    // "Authorization": "Bearer ${storage.getItem("access_token")}",
  };

  final uri = Uri.http("172.20.0.7:8080", "/me/checkRefresh", queryParameters);
  final response = await http.get(uri, headers: headers);

  if (response.statusCode == 200) {
    return response.body;
  } else {
    throw ServicesError.fromJson(jsonDecode(response.body));
  }
}

