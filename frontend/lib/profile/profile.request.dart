import 'dart:convert';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:localstorage/localstorage.dart';

class GetProfileResult {
  final String email;
  late final String username;
  late final bool adultContent;

  GetProfileResult({
    required this.email,
    required this.adultContent,
    required this.username,
  });

  factory GetProfileResult.fromJson(Map<String, dynamic> json) {
    return GetProfileResult(
      email: json['email'] as String,
      username: json['username'] as String,
      adultContent: json['adultContent'] as bool,
    );
  }

}

class ProfileError implements Exception {
  final String message;
  final String error;

  ProfileError({
    required this.message,
    required this.error,
  });

  factory ProfileError.fromJson(Map<String, dynamic> json) {
    return ProfileError(
      message: json['message'] as String,
      error: json['error'] as String,
    );
  }
}

Future<GetProfileResult> getProfileRequest() async {
  LocalStorage storage = LocalStorage('user.json');
  storage.ready.then((value) => value);

  final headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${storage.getItem("access_token")}",
  };

  final uri = Uri.http("172.20.0.7:8080", "/me");

  final res = await http.get(uri, headers: headers);

  if (res.statusCode == 200) {
    return GetProfileResult.fromJson(jsonDecode(res.body));
  } else {
    throw ProfileError.fromJson(jsonDecode(res.body));
  }
}

class UpdateProfileResult {
  final String message;

  UpdateProfileResult({
    required this.message,
  });

  factory UpdateProfileResult.fromJson(Map<String, dynamic> json) {
    return UpdateProfileResult(
      message: json['message'] as String,
    );
  }

}

Future<UpdateProfileResult> updateProfileRequest({String? username, String? password, String? rateLimit, bool?
adultContent})
async {
  LocalStorage storage = LocalStorage('user.json');
  storage.ready.then((value) => value);

  final headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${storage.getItem("access_token")}",
  };

  var body = <String, dynamic>{};
  if (username != null && username.isNotEmpty) {
    body["username"] = username;
  }
  if (password != null && password.isNotEmpty) {
    body["password"] = password;
  }
  if (rateLimit != null && rateLimit.isNotEmpty) {
    body["rateLimit"] = rateLimit;
  }
  if (adultContent != null && adultContent != storage.getItem("adultContent")) {
    body["adultContent"] = adultContent;
  }

  if (body.isNotEmpty) {
    final uri = Uri.http("172.20.0.7:8080", "/me");
    final res = await http.patch(uri, headers: headers, body: json.encode(body));
    if (res.statusCode == 200) {
      return UpdateProfileResult.fromJson(jsonDecode(res.body));
    } else {
      throw ProfileError.fromJson(jsonDecode(res.body));
    }
  }
  throw ProfileError.fromJson({
    "message": "No data to update",
    "error": "Useless request",
  });
}

