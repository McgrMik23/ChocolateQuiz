const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const { DefaultAzureCredential } = require('@azure/identity');

const app = express();
app.use(cors());
app.use(express.json())

const dbConfig = {
    // Configures the database
    server: 'chocolate-server.database.windows.net',
    database: 'CandyQuizDB',
    options: {
        encrypt: true, // Use encryption
        enableArithAbort: true
    },
    authentication: {
        type: 'azure-active-directory-default',
        options: {
            clientId: '68d5a4b1-b51d-4278-96c6-60e7d4ac2bdb', // Admin Object/App ID
            authority: 'https://login.microsoftonline.com/301e01bd-ea86-4b41-aaf3-9d9ae450d18f',
            tenantId: '301e01bd-ea86-4b41-aaf3-9d9ae450d18f' // Tenant ID
        }
    }
};
// Test the database connection
async function testDatabaseConnection() {
    try {
        let pool = await sql.connect(dbConfig);
        console.log('Connected to the database successfully.');
        pool.close();
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}

// Call the function to test the connection when the server starts
testDatabaseConnection();

app.post('/save-result', async (req, res) => {
    // Input validation
    if (!req.body || !req.body.result || !req.body.chocoType) {
        console.error('Incomplete data provided in the request body');
        return res.status(400).send('Bad Request: Incomplete data provided');
    }

    try {
        const { result, chocoType } = req.body;
        console.log('Received result:', result, 'Chocolate Type:', chocoType);

        // Connect to the database
        let pool = await sql.connect(dbConfig);
        console.log('Connected to the database.');

        // Insert the result into the database
        await pool.request()
            .input('UserResult', sql.VarChar(50), result)
            .input('ChocoType', sql.VarChar(4), chocoType)
            .query('INSERT INTO QuizResults (UserResult, ChocoType) VALUES (@UserResult, @ChocoType)');
        
        console.log('Result saved successfully to the database.');
        res.status(200).send('Result saved!');
    } catch (error) {
        console.error('Error occurred while saving the result:', error);
        res.status(500).send('An error occurred while saving the result.');
    } finally {
        // Close the database connection if open
        if (sql.connected) {
            await sql.close();
            console.log('Database connection closed.');
        }
    }
});

// General error handler for unexpected errors
app.use((err, req, res, next) => {
    console.error('An unexpected error occurred:', err);
    res.status(500).send('An unexpected error occurred.');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});