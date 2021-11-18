# epic-note
Notion-like fullstack note taking application with text editor based on contenteditable html blocks. Users have the ability to log in/register or try out the app with a guest account (comes with mock data), create/delete/organize note pages in the side menu which woks with drag and drop and once a page has been selected, they can take notes in the text editor.
## Functionality
Backend:
- Authentication based on JWT refresh and access tokens, refresh tokens stored in redis
- Guest accounts with some mock data (deleted after 2 hours)
-	Ability to save note pages on the server

Frontend:
-	Register and log in pages
-	Side menu with ability to create, delete, organize and select note pages. Supports drag and drop and creating folder pages in a tree structure
-	Note editor with the ability to create, delete and edit blocks.
-	Users can also change block types in the note editor with tag selector menu (opens when typing «/» or with action menu)
-	Text blocks and special tool blocks with extra functionality. Text blocks: page title, heading, subheading, paragraph. Tool blocks: counter, unordered/ordered lists, toggle list, todo list. 
-	Action menu for each block where users can delete or change block type

## Technologies used
Backend: Node.js, express, mongoDB, mongoose, redis, JWT

Frontend: React.js, react-query, chakra-ui and css modules for styling

## Controls
- Adding blocks: While focused on block press ENTER if in text block or CTRL + ENTER in list blocks
- Deleting: press BACKSPACE in an empty block
- Edit block: click to focus
- Change block type: type «/» to open tag menu, then use arrow buttons or mouse to select. You can also type needed tag and press ENTER
