const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('A clear sign that you are not yet dead!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
