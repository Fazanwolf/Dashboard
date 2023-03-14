class User {
  String email;
  String username;
  String password;
  bool isVerified = false;
  String role = 'user';

  User(this.email, this.username, this.password);

  void verify() {
    isVerified = true;
  }

}

class Administrator extends User {

  Administrator(String email, String username, String password) : super(email, username, password) {
    role = 'admin';
  }

}