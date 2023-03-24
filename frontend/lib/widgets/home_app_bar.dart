import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:localstorage/localstorage.dart';

class HomeAppBar extends StatefulWidget with PreferredSizeWidget{
  final String title;

  const HomeAppBar({super.key, required this.title});

  @override
  _HomeAppBarState createState() => _HomeAppBarState();

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class _HomeAppBarState extends State<HomeAppBar> with TickerProviderStateMixin {

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
            icon: const Icon(Icons.home),
            onPressed: () {
              if (widget.title != "Home") {
                Navigator.pushNamedAndRemoveUntil(
                    context, '/home', (route) => false);
              }
            },
            label: const Text('Home'),
            style: ButtonStyle(
              backgroundColor: MaterialStatePropertyAll(Color(Colors.deepOrange[400]!.value)),
            ),
          ),
        ),
        Directionality(
          textDirection: TextDirection.rtl,
          child: ElevatedButton.icon(
            icon: const Icon(Icons.label_important),
            onPressed: () {
              if (widget.title != "CGU") {
                Navigator.pushNamedAndRemoveUntil(
                    context, '/CGU', (route) => false);
              }
            },
            label: const Text('CGU'),
            style: ButtonStyle(
              backgroundColor: MaterialStatePropertyAll(Color(Colors.deepOrange[400]!.value)),
            ),
          ),
        ),
        Directionality(
          textDirection: TextDirection.rtl,
          child: ElevatedButton.icon(
            icon: const Icon(Icons.login),
            onPressed: () {
              if (storage.getItem('access_token') != null && storage.getItem('stayConnected') == true) {
                Navigator.pushNamedAndRemoveUntil(context, '/dashboard', (route) => false);
              } else {
                storage.clear();
                Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
               }
            },
            label: const Text('Login'),
            style: ButtonStyle(
              backgroundColor: MaterialStatePropertyAll(Color(Colors.deepOrange[400]!.value)),
            ),
          ),
        )
      ],
    );
  }

}