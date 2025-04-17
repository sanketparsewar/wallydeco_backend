const app = require("./src/index");
require('dotenv').config()

const PORT = process.env.PORT;
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
