import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/profile/profile.request.dart';
import 'package:frontend/profile/profile_update_card.dart';
import 'package:frontend/widgets/logged_app_bar.dart';
import 'package:frontend/widgets/custom_title.dart';
import 'package:localstorage/localstorage.dart';

import '../widgets/input/number_input.dart';

class Profile extends StatefulWidget {
  const Profile({super.key});

  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  LocalStorage storage = LocalStorage('user.json');

  late Future<GetProfileResult> result;

  late Function refresh;

  @override
  void initState() {
    super.initState();
    result = getProfileRequest();
    refresh = () {};
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const LoggedAppBar(title: "Profile"),
      backgroundColor: Colors.grey[300],
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Card(
              elevation: 5,
              color: Colors.white,
              child: Container(
                width: 550.0,
                padding: const EdgeInsets.all(15.0),
                child: FutureBuilder<GetProfileResult>(
                  future: result,
                  builder: (BuildContext context, AsyncSnapshot<GetProfileResult> snapshot) {
                    refresh = () {
                      setState(() {
                        result = getProfileRequest();
                      });
                    };
                    if (snapshot.hasData) {
                      return Column(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          const CustomTitle(title: 'Profile'),
                          const SizedBox(height: 20.0),
                          IconButton(
                            splashRadius: 45.0,
                            iconSize: 100.0,
                            padding: const EdgeInsets.all(8.0),
                            onPressed: () {
                              refresh();
                            },
                            icon: SvgPicture.asset(
                              // height: 50.0,
                              // width: 50.0,
                              fit: BoxFit.scaleDown,
                              'icons/logo.svg',
                            ),
                          ),
                          const SizedBox(height: 20.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              const Text(
                                '    Username:',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                              const SizedBox(width: 10.0),
                              Text(
                                '${snapshot.data!.username}    ',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              const Text(
                                '    Email:',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                              const SizedBox(width: 10.0),
                              Text(
                                '${snapshot.data!.email}    ',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              const Text(
                                '    Adult content:',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                              const SizedBox(width: 10.0),
                              Text(
                                snapshot.data!.adultContent ? 'Yes    ' : 'No    ',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              const Text(
                                '    Rate limit (ms):',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                              const SizedBox(width: 10.0),
                              Text(
                                "${snapshot.data!.rateLimit.toString()}    ",
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                            ],
                          ),
                        ],
                      );
                    } else if (snapshot.hasError) {
                      return Text('Error ${snapshot.error.toString()}');
                    }
                    return const Center(child: CircularProgressIndicator());
                  },
                ),
              ),
            ),
            ProfileUpdateCard(refresh: refresh),
          ],
        ),
      ),
    );
  }
}
