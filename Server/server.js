require('dotenv').config();

const app = require('./Src/app');
const connectedDB = require('./Src/config/db.config');
const PORT = process.env.PORT;

connectedDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});