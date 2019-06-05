const express = require('express');
const app = express();
const graphqlhttp = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');
const PORT = process.env.PORT || 4000
app.use(cors());
app.use('/graphql', graphqlhttp({
	schema,
	graphiql: true
}));

app.listen(PORT, () => console.log("Server connected" + PORT))
