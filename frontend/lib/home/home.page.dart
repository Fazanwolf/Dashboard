import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/widgets/home_app_bar.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> with TickerProviderStateMixin{

  late final AnimationController _controller = AnimationController(
    duration: const Duration(seconds: 3),
    vsync: this,
  )..repeat(reverse: false);

  late final Animation<double> _animation = CurvedAnimation(
    parent: _controller,
    curve: Curves.bounceIn,
  );


  @override
  void initState() {
    super.initState();
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: const HomeAppBar(title: 'Home'),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const <Widget>[
            Text('Welcome home...'),
            SizedBox(height: 50.0),
            Text('Hello darkness my old friend'),
            Text("I've come to talk with you again"),
            Text("Because a vision softly creeping"),
            Text("Left its seeds while I was sleeping"),
            Text("And the vision that was planted in my brain"),
            Text("Still remains"),
            Text("Within the sound of silence"),
          ],
        )
      ),
    );
  }
}