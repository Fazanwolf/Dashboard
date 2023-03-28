import 'dart:convert';
import 'package:http/http.dart' as http;

class LoginResult {
  final String id;
  final String username;
  final bool adultContent;
  final String access_token;
  final int rateLimit;
  final int expiresIn;

  LoginResult({
    required this.id,
    required this.access_token,
    required this.adultContent,
    required this.rateLimit,
    required this.username,
    required this.expiresIn,
  });

  factory LoginResult.fromJson(Map<String, dynamic> json) {
    return LoginResult(
      id: json['id'] as String,
      username: json['username'] as String,
      adultContent: json['adultContent'] as bool,
      rateLimit: json['rateLimit'] as int,
      access_token: json['access_token'] as String,
      expiresIn: json['expiresIn'] as int,
    );
  }

}

class LoginError implements Exception {
  final String message;
  final String error;

  LoginError({
    required this.message,
    required this.error,
  });

  factory LoginError.fromJson(Map<String, dynamic> json) {
    return LoginError(
      message: json['message'] as String,
      error: json['error'] as String,
    );
  }
}

Future<LoginResult> loginRequest(String email, String password) async {
  // final queryParameters = {
  //   "email": email,
  //   "password": password,
  // };

  final headers = {
    "Content-Type": "application/json",
    // "Accept-Encoding": "gzip"
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  };

  final uri = Uri.http("172.20.0.7:8080", "/auth/login");

  final res = await http.post(uri, headers: headers, body: jsonEncode(<String, String>{
    'email': email,
    'password': password,
  }),);

  if (res.statusCode == 200) {
    // return LoginResult.fromJson(jsonDecode(res.body));
    return LoginResult.fromJson(jsonDecode(res.body));
  } else {
    // throw Exception(LoginError.fromJson(jsonDecode(res.body)));
    throw LoginError.fromJson(jsonDecode(res.body));
  }
}

class OAuth2Result {
  String uri;

  OAuth2Result({
    required this.uri,
  });
}

class LoginArguments {
  final String? id;
  final String? username;
  final String? adultContent;
  final String? access_token;

  LoginArguments({
    this.id,
    this.username,
    this.adultContent,
    this.access_token,
  });
}

Future<String> getUri(String platform, String type) async {
  final headers = {
    "Content-Type": "application/json",
  };

  if (platform != "discord" && platform != "reddit" && platform != "wakatime") {
    return "Invalid platform";
  }
  if (type != "login" && type != "register" && type != "refresh") {
    return "Invalid type";
  }
  final queryParameters = {
    "redirect_uri": "http://172.20.0.7:8080/thirdparty/$platform/$type/callback",
  };

  final uri = Uri.http("172.20.0.7:8080", "/thirdparty/$platform/authorize", queryParameters);

  final res = await http.get(uri, headers: headers);

  if (res.statusCode == 200) {
    return res.body;
  } else {
    return "Something goes wrong";
  }

}
