import express from 'express';
import { listenPort } from "../Interface";


const app = express();

app.get('/', (req, res) => {
    res.send('Hello');
    
});

const localHostPort: listenPort = { PORT: 3000 };
app.listen(localHostPort.PORT, () => {
    console.log(`server running on ${localHostPort.PORT}`)
});


