
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/profile/profile.request.dart';
import 'package:frontend/widgets/custom_title.dart';

class ProfileInfoCard extends StatefulWidget {

  final Function refresh;

  const ProfileInfoCard({super.key, required this.refresh});

  @override
  _ProfileInfoCardState createState() => _ProfileInfoCardState();

}

class _ProfileInfoCardState extends State<ProfileInfoCard> {

  late Future<GetProfileResult> result;

  @override
  void initState() {
    result = getProfileRequest();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      color: Colors.white,
      child: Container(
        width: 550.0,
        padding: const EdgeInsets.all(15.0),
        child: FutureBuilder<GetProfileResult>(
          future: result,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  const CustomTitle(title: 'Profile'),
                  const SizedBox(height: 20.0),
                  CircleAvatar(
                    radius: 50,
                    child: SvgPicture.asset(
                      'icons/logo.svg',
                      width: 100,
                      height: 100,
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
                ],
              );
            } else if (snapshot.hasError) {
              return Text('Error ${snapshot.error.toString()}');
            }
            return const Center(child: CircularProgressIndicator());
          },
        ),
      ),
    );
  }

}