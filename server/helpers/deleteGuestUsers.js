const user = require("../models/User");
const page = require("../models/Page");

const TWO_HOURS = 60000 * 60 * 2;

const deleteGuestUsers = async () => {
  console.log(`Starting job: ${deleteGuestUsers.name}`);
  try {
    const guestUsersToDelete = await user.find({
      isGuest: true,
      createdAt: { $lt: new Date(Date.now() - TWO_HOURS).toISOString() },
    });
    const guestIds = guestUsersToDelete.map((el) => el._id);
    console.log("guestIds", guestIds);

    // delete guest pages
    const pagesResponse = await page.deleteMany({
      creator: { $in: guestIds },
    });
    console.log(`SUCCESS - Deleted ${pagesResponse.deletedCount} pages.`);
    // delete guest users
    const response = await user.deleteMany({
      _id: { $in: guestIds },
    });
    console.log(`SUCCESS - Deleted ${response.deletedCount} users.`);
  } catch (err) {
    console.log(`ERROR - ${err.message}`);
  }
};

module.exports = deleteGuestUsers;
