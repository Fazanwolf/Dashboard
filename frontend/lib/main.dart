import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:frontend/dashboard/dashboard.page.dart';
import 'package:frontend/forgot_password/forgot_password_page.dart';
import 'package:frontend/home/home.page.dart';
import 'package:frontend/login/login.page.dart';
import 'package:frontend/profile/profile_page.dart';
import 'package:frontend/register/register.page.dart';
import 'package:frontend/reset_password/reset_password.page.dart';
import 'package:frontend/services/services_page.dart';
import 'package:localstorage/localstorage.dart';
import 'package:url_strategy/url_strategy.dart';

void main() {
  LocalStorage storage = LocalStorage('user.json');
  storage.ready.then((value) => value);
  setPathUrlStrategy();

  runApp(
    MaterialApp(
    debugShowCheckedModeBanner: false,
    title: 'Wolfboard',
    initialRoute: (storage.getItem('stayConnected') == true && storage.getItem('access_token') ? '/dashboard'
        : '/home'),
    onGenerateRoute: (RouteSettings settings) {
      Widget? pageView;
      if (settings.name != null) {
        var uriData = Uri.parse(settings.name!);
        //uriData.path will be your path and uriData.queryParameters will hold query-params values

        switch (uriData.path) {
          case '/login':
            if (uriData.queryParameters["access_token"] != null) {
              storage.setItem('access_token', uriData.queryParameters["access_token"]);
              storage.setItem('id', uriData.queryParameters["id"]);
              storage.setItem('username', uriData.queryParameters["username"]);
              storage.setItem('adultContent', uriData.queryParameters["adultContent"] == "true" ? true : false);
              pageView = const Dashboard();
            }
            break;
        }
      }
      if (pageView != null) {
        return MaterialPageRoute(
            builder: (BuildContext context) => pageView!);
      }
    },
    routes: {
      '/home': (context) => const Home(),
      '/login': (context) => const Login(),
      '/register': (context) => const Register(),
      '/forgot-password': (context) => const ForgotPassword(),
      '/reset-password': (context) => const ResetPassword(),
      '/validate-account': (context) => const Home(),
      '/dashboard': (context) => const Dashboard(),
      '/profile': (context) => const Profile(),
      '/CGU': (context) => const Home(),
      '/services': (context) => const Services(),
    }
  ));
}

