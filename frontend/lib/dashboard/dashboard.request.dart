import 'dart:convert';
import 'package:frontend/services/services_request.dart';
import 'package:http/http.dart' as http;
import 'package:localstorage/localstorage.dart';

class WidgetResult {
  final String message;

  WidgetResult({
    required this.message,
  });

  factory WidgetResult.fromJson(Map<String, dynamic> json) {
    return WidgetResult(
      message: json['message'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'message': message,
  };
}

class WidgetDatas extends WidgetData {
  final String id;

  @override
  WidgetDatas({
    required this.id,
    required super.name,
    required super.description,
    required super.icon,
    required super.enabled,
    required super.idx,
    required super.result,
    required super.params,
  });

  @override
  factory WidgetDatas.fromJson(Map<String, dynamic> json) {
    return WidgetDatas(
      id: json['_id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      icon: json['icon'] as String,
      enabled: json['enabled'] as bool,
      idx: json['idx'] as int,
      result: json['result'] as String,
      params: (json['params'] as List).map((i) => Param.fromJson(i)).toList(),
    );
  }

  @override
  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'icon': icon,
    'enabled': enabled,
    'idx': idx,
    'result': result,
    'params': params,
  };

}

Future<List<WidgetDatas>> getMyWidgets() async {
  LocalStorage storage = LocalStorage('user.json');

  final headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${storage.getItem("access_token")}",
  };

  final uri = Uri.http("172.20.0.7:8080", "/me/widgets");
  final response = await http.get(uri, headers: headers);

  if (response.statusCode == 200) {
    return (jsonDecode(response.body) as List).map((i) => WidgetDatas.fromJson(i)).toList();
  } else {
    throw ServicesError.fromJson(jsonDecode(response.body));
  }
}


Future<WidgetResult> updateWidgetPositionRequest({required List<WidgetDatas> body})
async {
  LocalStorage storage = LocalStorage('user.json');

  final headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${storage.getItem("access_token")}",
  };

  final uri = Uri.http("172.20.0.7:8080", "/me/positions/widgets");
  final response = await http.patch(uri, headers: headers, body: jsonEncode(body));

  if (response.statusCode == 200) {
    return WidgetResult.fromJson(jsonDecode(response.body));
  } else {
    throw ServicesError.fromJson(jsonDecode(response.body));
  }
}

Future<WidgetResult> updateWidgetRequest({required String id, bool? enabled, int? idx, List<Param>? params}) async {
  LocalStorage storage = LocalStorage('user.json');

  final headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${storage.getItem("access_token")}",
  };

  var body = <String, dynamic>{};
  if (idx != null && idx >= 0) {
    body["idx"] = idx;
  }
  if (enabled != null) {
    body["enabled"] = enabled;
  }
  if (params != null && params.isNotEmpty) {
    body["params"] = params;
  }

  final uri = Uri.http("172.20.0.7:8080", "/me/widgets/$id");
  final response = await http.patch(uri, headers: headers, body: jsonEncode(body));

  if (response.statusCode == 200) {
    return WidgetResult.fromJson(jsonDecode(response.body));
  } else {
    throw ServicesError.fromJson(jsonDecode(response.body));
  }
}

Future<WidgetResult> deleteWidgetRequest(String id) async {
  LocalStorage storage = LocalStorage('user.json');

  final headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${storage.getItem("access_token")}",
  };

  final uri = Uri.http("172.20.0.7:8080", "/me/widgets/$id");
  final response = await http.delete(uri, headers: headers);

  if (response.statusCode == 200) {
    return WidgetResult.fromJson(jsonDecode(response.body));
  } else {
    throw ServicesError.fromJson(jsonDecode(response.body));
  }
}
