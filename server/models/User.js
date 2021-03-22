const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const argon2 = require("argon2");

// Todo: добавить больше полей, expirationTime для refreshToken
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // страницы пользователя
    pages: [
      {
        type: Schema.Types.ObjectId,
        ref: "page",
      },
    ],
  },
  { timestamps: true }
);

// Метод срабатывает каждый раз перед тем как сохранить пользователя, он берет из объекта user незахерированный пароль и хэширует его.
UserSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await argon2.hash(this.password);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Метод проверяет на правильность пароля. Находим пользователя в базе данных, далее вызываем на объекте user этот метод. В этом методе в this будет содержаться реальный пользователь, и мы сможем сравнить введенный пароль с настоящим.
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await argon2.verify(this.password, password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
