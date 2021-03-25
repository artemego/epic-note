const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const argon2 = require("argon2");

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

// Метод вызываем каждый перед тем как сохранить пользователя при регистрации, он берет из объекта user незахешированный пароль и хэширует его.
UserSchema.methods.hashPassword = async function () {
  try {
    const hashedPassword = await argon2.hash(this.password);
    this.password = hashedPassword;
  } catch (error) {
    throw error;
  }
};

// Метод проверяет на правильность пароля. Находим пользователя в базе данных, далее вызываем на объекте user этот метод. В этом методе в this будет содержаться реальный пользователь, и мы сможем сравнить введенный пароль с настоящим.
UserSchema.methods.isValidPassword = async function (password) {
  try {
    console.log(password);
    return await argon2.verify(this.password, password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
