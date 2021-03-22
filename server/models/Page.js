const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PageSchema = new Schema(
  {
    blocks: [
      {
        tag: {
          type: String,
          required: true,
        },
        html: {
          type: String,
          required: false,
        },
        // imageUrl: {
        //   type: String,
        //   required: false
        // }
      },
    ],
    // foreign key на object id - many to many
    creator: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Page = mongoose.model("page", PageSchema);
module.exports = Page;
