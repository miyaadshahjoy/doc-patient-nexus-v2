const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.addInstanceMethods = (schema) => {
  schema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  schema.methods.passwordChangedAfter = function (iat) {
    // console.log(this.passwordChangedAt.getTime() / 1000, iat);
    return this.passwordChangedAt.getTime() / 1000 > iat + 1;
  };

  schema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };
  schema.methods.createEmailVerificationToken = function () {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    this.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
    return verificationToken;
  };
};
