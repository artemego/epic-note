const mockPages = [
  {
    blocks: [
      {
        tag: "h1",
        html: "Text blocks",
      },
      {
        tag: "h2",
        html: "Heading",
      },
      {
        tag: "h3",
        html: "Subheading",
      },
      {
        tag: "p",
        html: "paragraph",
      },
    ],
    name: "text blocks",
  },
  {
    blocks: [
      {
        tag: "h1",
        html: "Tool block page",
      },
      {
        tag: "h2",
        html: "Unordered list",
      },
      {
        tag: "unordered",
        html: "<li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.<br></li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li>",
      },
      {
        tag: "h2",
        html: "Ordered list",
      },
      {
        tag: "ordered",
        html: "<li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li>",
      },
      {
        tag: "h2",
        html: "Todo list",
      },
      {
        tag: "todolist",
        html: "<li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li><s>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</s></li><li><s>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</s></li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li><s>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</s></li>",
      },
      {
        tag: "h2",
        html: "Toggle list",
      },
      {
        tag: "toggle",
        html: "<li>Toggle list title</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.</li>",
      },
      {
        tag: "h2",
        html: "Couter block",
      },
      {
        tag: "btn",
        html: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.",
        counter: 0,
      },
      {
        tag: "btn",
        html: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestiae.",
        counter: 3,
      },
    ],

    name: "tool blocks",
  },
  {
    blocks: [
      {
        tag: "h1",
        html: "Todo list page",
      },
      {
        tag: "todolist",
        html: "<li>Morning run</li><li>Meeting</li><li>Lunch with Mike</li><li>Pay bills</li><li><s>Renew gym membership</s></li>",
      },
      {
        tag: "p",
        html: "Shopping list",
      },
      {
        tag: "todolist",
        html: "<li><s>milk</s></li><li>bacon</li><li>cheese</li><li><s>wine</s></li><li>onions</li><li><s>butter</s></li><li>rice</li>",
      },
    ],
    name: "todo list page example",
  },
];

module.exports = {
  mockPages,
};
