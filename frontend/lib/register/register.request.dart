import 'dart:convert';
import 'package:http/http.dart' as http;

class RegisterResult {
  final String message;

  RegisterResult({
    required this.message,
  });

  factory RegisterResult.fromJson(Map<String, dynamic> json) {
    return RegisterResult(
      message: json['message'] as String,
    );
  }

}

class RegisterError implements Exception {
  final String message;
  final String error;

  RegisterError({
    required this.message,
    required this.error,
  });

  factory RegisterError.fromJson(Map<String, dynamic> json) {
    return RegisterError(
      message: json['message'] as String,
      error: json['error'] as String,
    );
  }
}

Future<RegisterResult> registerRequest(String email, String username, String password) async {

  final headers = {
    "Content-Type": "application/json",
  };

  final uri = Uri.http("172.20.0.7:8080", "/auth/register");

  final res = await http.post(uri, headers: headers, body: jsonEncode(<String, String>{
    'email': email,
    'username': username,
    'password': password,
  }),);

  if (res.statusCode == 201) {
    return RegisterResult.fromJson(jsonDecode(res.body));
  } else {
    // throw Exception(LoginError.fromJson(jsonDecode(res.body)));
    throw RegisterError.fromJson(jsonDecode(res.body));
  }
}