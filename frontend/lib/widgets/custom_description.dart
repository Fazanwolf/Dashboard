import 'package:flutter/material.dart';

class CustomDescription extends StatelessWidget {
  late String description;
  late double width;
  late TextAlign textAlign;

  CustomDescription({super.key, required this.description, this.width = 300, this.textAlign = TextAlign.center});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      child: Text(
        description,
        textAlign: textAlign,
        style: const TextStyle(
          fontSize: 18.0,
        ),
        overflow: TextOverflow.ellipsis,
        maxLines: 2,
        softWrap: false,
      ),
    );
  }


}