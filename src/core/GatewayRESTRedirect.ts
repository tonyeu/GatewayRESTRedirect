import Express from "express";
import https from "https";
import { ILoggerOptions } from "../utils/Logger";
import { Base } from "./Base";
import Route from "./Route";

export interface IGatewayOptions {
	host?: string;
	port?: number;
	logger?: ILoggerOptions;
}

export default class GatewayRESTRedirect extends Base {

	private app: Express.Application;
	private port: number;
	private host: string;

	constructor(private options?: IGatewayOptions) {
		super(options ? options.logger : undefined);
		this.app = Express();

		// options defaultsS
		this.options = options || {};
		this.port = this.options.port || 12345;
		this.host = this.options.host || "0.0.0.0";

		// testing
		/* const URL = "https://api.iextrading.com/1.0";
		const stock = "AAPL";
		this.app.get("/", (_req, res) => {
			https.get(`${URL}/stock/${stock}/book`, (response) => {

				let json = "";
				response.on("data", (data) => {
					json += data;
				});
				response.on("end", () => {
					res.send(JSON.stringify(JSON.parse(json)));
				});

			}).on("error", (e) => {
				this.log("info", "main", `${e.name} - ${e.message} - ${e.stack}`);
			});
		}); */
		const route = new Route({
			contentType: "application/json",
			path: "/teste/:stock",
			requestType: "GET",
			url: "https://api.iextrading.com/1.0/stock/AAPL/book",
		});
		this.addRoute(route);

		// finds "abc/:cdf-asb/asdsa/:aassssd"
		const regx = /:+[A-Za-z0-9_-]*/g;
		const teste = "abc/:cdf-asb/asdsa/:aassssd";
		// returns array
		// tslint:disable-next-line: no-console
		console.log(teste.match(regx));
	}

	public addRoute(route: Route) {
		if (route.getRequestType() === "GET") {
			this.app.get(route.getPath(), (req, res) => {

				this.log("info", GatewayRESTRedirect.name,
				`${route.getRequestType()} ${JSON.stringify(req.path)} - ${JSON.stringify(req.params)} - ${req.query}`);

				https.get(route.getUrl(), (response) => {
					let json = "";
					response.on("data", (data) => {
						json += data;
					});
					response.on("end", () => {
						res.send(JSON.stringify(JSON.parse(json)));
					});
				}).on("error", (e) => {
					this.log("info", GatewayRESTRedirect.name, `${e.name} - ${e.message} - ${e.stack}`);
				});
			});
		}
	}

	public listen(port?: number, host?: string): void {
		this.app.listen(port || this.port, host || this.host);
		this.log("info", GatewayRESTRedirect.name,
						`Running on http://${port || this.port}:${host || this.host}`);
	}
}
