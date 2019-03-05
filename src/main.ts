import express from "express";
import https from "https";

// Constants
const PORT = 12345;
const HOST = "0.0.0.0";
const URL = "https://api.iextrading.com/1.0";
const stock = "AAPL";
// App
const app = express();
app.get("/", (_req, res) => {
	https.get(`${URL}/stock/${stock}/book`, (response) => {

		let json = "";
		response.on("data", (data) => {
			json += data;
		});
		response.on("end", () => {
			res.send(JSON.stringify(JSON.parse(json)));
		});

	}).on("error", (e) => {
		console.log(e);
	});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);