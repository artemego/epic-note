const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const argon2 = require("argon2");
const { bool } = require("@hapi/joi");

// Создаем subSchema, чтобы убрать _id из объектов pages
// Здесь теперь будут храниться страницы в структуре дерева из atlaskit
const PageObj = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "page",
    },
    children: [Schema.Types.ObjectId],
    hasChildren: {
      type: Boolean,
      default: false,
    },
    isExpanded: {
      type: Boolean,
      default: false,
    },
    isChildrenLoading: {
      type: Boolean,
      default: false,
    },
    data: {
      title: {
        type: String,
        required: true,
        default: false,
      },
    },
  },
  { _id: false }
);

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
    // страницы пользователя и корневые страницы дерева
    pages: {
      pageItems: [PageObj],
      rootIds: [Schema.Types.ObjectId],
    },
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
