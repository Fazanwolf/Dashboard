
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:frontend/forgot_password/forgot_password_request.dart';

Future<ForgotPasswordResult> resetPasswordRequest(String password, String token) async {

  final headers = {
    "Content-Type": "application/json",
  };

  final uri = Uri.http("172.20.0.7:8080", "/auth/resetPassword");

  final res = await http.post(uri, headers: headers, body: jsonEncode(<String, String>{
    'password': password,
    'token': token,
  }),);

  if (res.statusCode == 200) {
    return ForgotPasswordResult.fromJson(jsonDecode(res.body));
  } else {
    throw ForgotPasswordError.fromJson(jsonDecode(res.body));
  }
}