const fs = require('fs');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;


class UsersComponent {
  constructor(statePath) {
    this.statePath = statePath;
    try {
      this.users = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
    } catch (err) {
      console.log(err.message);
      this.users = {};
      this.serialize();
    }
  }


  serialize() {
    fs.writeFileSync(this.statePath, JSON.stringify(this.users, null, 2));
  }


  async create(data) {
    const { email, password } = data;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    this.users[email] = { email, password: hashedPassword };
    this.serialize();
  }


  async login(email, password) {
    const user = this.users[email];
    if (user && await bcrypt.compare(password, user.password)) {
      return true;
    }
    return false;
  }
  async userExists(email) {
    return !!this.users[email];
  }


  async updatePassword(email, newPassword) {
    if (!this.users[email]) {
      return false;
    }
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    this.users[email].password = hashedPassword;
    this.serialize();
    return true;
  }
}


module.exports = UsersComponent;
