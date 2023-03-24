import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class LoggedDrawer extends StatefulWidget {
  const LoggedDrawer({super.key});

  @override
  _LoggedDrawerState createState() => _LoggedDrawerState();
}

class _LoggedDrawerState extends State<LoggedDrawer> with TickerProviderStateMixin {

  late final AnimationController _controller = AnimationController(
    duration: const Duration(seconds: 3),
    vsync: this,
  )..repeat(reverse: false);

  late final Animation<double> _animation = CurvedAnimation(
    parent: _controller,
    curve: Curves.bounceIn,
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return NavigationDrawer(
      children: [
        DrawerHeader(
          child: RotationTransition(
            turns: _animation,
            child: SvgPicture.asset('/icons/logo.svg'),
          ),
        ),
        ListTile(
          title: const Text('Profile'),
          onTap: () {
            setState(() {
              Navigator.pushNamedAndRemoveUntil(context, '/profile', (route) => false);
            });
          }
        ),
        ListTile(
          title: const Text('Dashboard'),
          onTap: () {
            setState(() {
              Navigator.pushNamedAndRemoveUntil(context, '/dashboard', (route) => false);
            });
          }
        ),
        ListTile(
          title: const Text('Services'),
          onTap: () {
            setState(() {
              Navigator.pushNamedAndRemoveUntil(context, '/service', (route) => false);
            });
          }
        ),
        ListTile(
          title: const Text('Logout'),
          tileColor: Colors.red,
          onTap: () {
            setState(() {
              Navigator.pushNamedAndRemoveUntil(context, '/logout', (route) => false);
            });
          }
        ),
      ],
    );
  }
}
