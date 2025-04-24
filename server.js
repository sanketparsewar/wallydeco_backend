const server = require("./src/index");
require('dotenv').config()

const PORT = process.env.PORT;
// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
