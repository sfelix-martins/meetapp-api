import { check, body } from 'express-validator';
import bcrypt from 'bcryptjs';

import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static async findByEmail(email) {
    const user = await User.findOne({ where: { email } });

    return user;
  }

  static async validateUserExists(email) {
    const user = await User.findByEmail(email);

    if (user) {
      throw new Error('E-mail already in use');
    }
  }

  async checkPassword(password) {
    return bcrypt.compare(password.toString(), this.password_hash);
  }

  static rules() {
    return {
      store: [
        check('name')
          .exists()
          .withMessage('Name is required')
          .isString()
          .withMessage('Name must be a valid string'),
        check('email')
          .exists()
          .withMessage('Email is required')
          .isEmail()
          .withMessage('Email must be a valid email')
          .custom(User.validateUserExists),
        check('password')
          .exists()
          .withMessage('Password is required')
          .isLength({ min: 6 })
          .withMessage('Password must be at least 6 chars long'),
      ],
      update: [
        check('name')
          .isString()
          .withMessage('Name must be a valid string'),
        check('email')
          .isEmail()
          .withMessage('Email must be a valid email')
          .if(body('email').exists())
          .not()
          .isEmpty()
          .custom((email, { req }) => {
            if (email !== req.user.email) {
              this.validateUserExists(email);
            }
            return true;
          }),
        check('oldPassword')
          // if the new password is provided...
          .if(body('password').exists())
          // ...then the old password must be too...
          .not()
          .isEmpty()
          .withMessage('Old password is required')
          .isLength({ min: 6 })
          .withMessage('Old password must be at least 6 chars long')
          // ...and they must not be equal.
          .custom((value, { req }) => value !== req.body.password)
          .withMessage('New password cannot be equals the old password'),
        check('passwordConfirmation')
          .if(body('password').exists())
          .not()
          .isEmpty()
          .withMessage('Password confirmation is required')
          .custom((value, { req }) => value === req.body.password)
          .withMessage('Passwords does not match'),
      ],
    };
  }
}

export default User;
