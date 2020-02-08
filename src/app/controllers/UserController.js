import User from '../models/User';

class UserController {
  async store(req, res) {
    const { id, name, email } = await User.create(req.body);

    return res.json({ data: { id, name, email } });
  }

  async update(req, res) {
    const { user } = req;
    const { oldPassword } = req.body;

    if (oldPassword) {
      if (!(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    const { id, name, email } = await user.update(req.body);

    return res.json({ data: { id, name, email } });
  }
}
export default new UserController();
