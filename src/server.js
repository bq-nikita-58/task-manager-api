
const createApp = require("./app");

const app = createApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Task Manager API running on port ${PORT}`);
});
