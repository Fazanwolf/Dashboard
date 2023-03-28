import 'dart:convert';
import 'package:http/http.dart' as http;

class ForgotPasswordResult {
  final String message;

  ForgotPasswordResult({
    required this.message,
  });

  factory ForgotPasswordResult.fromJson(Map<String, dynamic> json) {
    return ForgotPasswordResult(
      message: json['message'] as String,
    );
  }

}

class ForgotPasswordError implements Exception {
  final String message;
  final String error;

  ForgotPasswordError({
    required this.message,
    required this.error,
  });

  factory ForgotPasswordError.fromJson(Map<String, dynamic> json) {
    return ForgotPasswordError(
      message: json['message'] as String,
      error: json['error'] as String,
    );
  }
}

Future<ForgotPasswordResult> forgotPasswordRequest(String email) async {

  final headers = {
    "Content-Type": "application/json",
  };

  final uri = Uri.http("172.20.0.7:8080", "/auth/forgotPassword");

  final res = await http.post(uri, headers: headers, body: jsonEncode(<String, String>{
    'email': email,
  }),);

  if (res.statusCode == 201) {
    return ForgotPasswordResult.fromJson(jsonDecode(res.body));
  } else {
    throw ForgotPasswordError.fromJson(jsonDecode(res.body));
  }
}