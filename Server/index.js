import express from 'express';
import 'dotenv/config';

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server is up and running in port ${process.env.PORT}`);
})