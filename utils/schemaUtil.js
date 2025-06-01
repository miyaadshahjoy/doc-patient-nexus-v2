const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.addInstanceMethods = (schema) => {
  schema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  schema.methods.passwordChangedAfter = function (iat) {
    // console.log(this.passwordChangedAt.getTime() / 1000, iat);
    return this.passwordChangedAt.getTime() / 1000 > iat + 1;
  };

  schema.methods.createPasswordResetToken = function () {
    // Generate a random token of 32 bytes
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token and set it to passwordResetToken field
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    // Set the expiration time for the token to 10 minutes from now

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // This is done to prevent the token from being used after 10 minutes
    return resetToken;
  };
  schema.methods.createEmailVerificationToken = function () {
    const verificationToken = jwt.sign(
      { email: this.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '10m', // Token will expire in 10 minutes
      },
    );

    // Hash the token and set it to emailVerificationToken field
    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Set the expiration time for the token to 10 minutes from now
    this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // This is done to prevent the token from being used after 10 minutes

    return verificationToken;
  };
};
