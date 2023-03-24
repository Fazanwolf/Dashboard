import 'package:flutter/material.dart';

class CustomTitle extends StatelessWidget {
  final String title;
  final double width;
  final TextAlign textAlign;

  const CustomTitle({super.key, required this.title, this.width = 300, this.textAlign = TextAlign.center});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      child: Text(
        title,
        textAlign: textAlign,
        style: const TextStyle(
          fontSize: 32.0,
          fontWeight: FontWeight.w900,
        ),
        softWrap: false,
        maxLines: 2,
        overflow: TextOverflow.ellipsis,
      ),
    );
  }


}