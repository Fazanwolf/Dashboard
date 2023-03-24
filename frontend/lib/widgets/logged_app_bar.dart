import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:localstorage/localstorage.dart';

class LoggedAppBar extends StatefulWidget with PreferredSizeWidget{
  final String title;

  const LoggedAppBar({super.key, required this.title});

  @override
  _LoggedAppBarState createState() => _LoggedAppBarState();

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class _LoggedAppBarState extends State<LoggedAppBar> with TickerProviderStateMixin {

  final LocalStorage storage = LocalStorage('user.json');

  late final AnimationController _controller = AnimationController(
    duration: const Duration(seconds: 3),
    vsync: this,
  )
    ..repeat(reverse: false);

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
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(widget.title),
      leading: Padding(
        padding: const EdgeInsets.all(8.0),
        child: CircleAvatar(
          backgroundColor: Color(Colors.white38.value),
          child: RotationTransition(
            turns: _animation,
            child: SvgPicture.asset('/icons/logo.svg'),
          ),
        ),
      ),
      backgroundColor: Color(Colors.deepOrange[300]!.value),
      actions: [
        Directionality(
          textDirection: TextDirection.rtl,
          child: ElevatedButton.icon(
            icon: const Icon(Icons.room_service),
            onPressed: () {
              if (widget.title != "Services") {
                Navigator.pushNamedAndRemoveUntil(
                    context, '/services', (route) => false);
              }
            },
            label: const Text('Services'),
            style: ButtonStyle(
              backgroundColor: MaterialStatePropertyAll(Color(Colors.deepOrange[400]!.value)),
            ),
          ),
        ),
        Directionality(
          textDirection: TextDirection.rtl,
          child: ElevatedButton.icon(
            icon: const Icon(Icons.broadcast_on_personal),
            onPressed: () {
              if (widget.title != "Dashboard") {
                Navigator.pushNamedAndRemoveUntil(
                    context, '/dashboard', (route) => false);
              }
            },
            label: const Text('Dashboard'),
            style: ButtonStyle(
              backgroundColor: MaterialStatePropertyAll(Color(Colors.deepOrange[400]!.value)),
            ),
          ),
        ),
        Directionality(
          textDirection: TextDirection.rtl,
          child: ElevatedButton.icon(
            icon: const Icon(Icons.person),
            onPressed: () {
              if (widget.title != "Profile") {
                Navigator.pushNamedAndRemoveUntil(
                    context, '/profile', (route) => false);
              }
            },
            label: const Text('Profile'),
            style: ButtonStyle(
              backgroundColor: MaterialStatePropertyAll(Color(Colors.deepOrange[400]!.value)),
            ),
          ),
        ),
        Directionality(
          textDirection: TextDirection.rtl,
          child: ElevatedButton.icon(
            icon: const Icon(Icons.logout),
            onPressed: () {
              if (storage.getItem('access_token') != null) {
                storage.deleteItem('access_token');
                storage.deleteItem('username');
                storage.deleteItem('id');
              }
              Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
            },
            label: const Text('Logout'),
            style: ButtonStyle(
              backgroundColor: MaterialStatePropertyAll(Color(Colors.deepOrange[400]!.value)),
            ),
          ),
        )
      ],
    );
  }

}