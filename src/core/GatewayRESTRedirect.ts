import Express from "express";
import { ILoggerOptions } from "../utils/Logger";
import { Base } from "./Base";
import Requests from "./Requests";
import Route from "./Route";

/**
 * Options provided to top class
 * @export
 * @interface IGatewayOptions
 */
export interface IGatewayOptions {
	host ?: string;
	port ?: number;
	logger ?: ILoggerOptions;
	configFileName?: string;
}

/**
 * Top class of module
 * Instanciates all that is needed to start the gateway
 * @export
 * @class GatewayRESTRedirect
 * @extends {Base}
 */
export default class GatewayRESTRedirect extends Base {

	private app: Express.Application;
	private reqBuilder: Requests;
	private port: number;
	private host: string;

	/**
	 * Creates an instance of GatewayRESTRedirect.
	 * @param {IGatewayOptions} [options]
	 * @memberof GatewayRESTRedirect
	 */
	constructor(private options ?: IGatewayOptions) {
		super(options ? options.logger : undefined);
		this.app = Express();
		this.reqBuilder = new Requests();

		// options defaults
		this.options = options || {};
		this.port = this.options.port || 12345;
		this.host = this.options.host || "0.0.0.0";

		// load default configs
		this.loadDefaultConfigs();

		// load configurations from file
		this.loadConfigs();


		// FIXME: testing purposes
		const route = new Route({
			contentType: "application/json",
			path: "/teste/:stock",
			requestType: "GET",
			url: "https://api.iextrading.com/1.0/stock/:stock/book",
		});
		this.addRoute(route);
	}

	/**
	 * Adds a new route to the server, with a designated path and destination url
	 * @param {Route} route
	 * @memberof GatewayRESTRedirect
	 */
	public addRoute(route: Route): void {
		if (route.getRequestType() === "GET") {
			this.app.get(route.getPath(), (req, res) => {

				this.log("info",
					`${route.getRequestType()} ${JSON.stringify(req.path)} - ${JSON.stringify(req.params)} - ${req.query}`);

				this.reqBuilder.get(route, req, res);
			});
		}
	}

	/**
	 * Starts the server. Server listens to the default port at default host address, or provided port/host address
	 * @param {number} [port] Port used
	 * @param {string} [host] Host address
	 * @memberof GatewayRESTRedirect
	 */
	public listen(port ?: number, host ?: string): void {
		this.app.listen(port || this.port, host || this.host);
		this.log("info", GatewayRESTRedirect.name,
			`Running on http://${port || this.port}:${host || this.host}`);
	}

	protected log(level: string, message: string, metadata?: string) {
		super.log(level, GatewayRESTRedirect.name, message, metadata);
	}

	/**
	 * TODO:
	 * Configuration loading from file
	 * @private
	 * @returns
	 * @memberof GatewayRESTRedirect
	 */
	private loadConfigs(): void {
		return;
	}

	/**
	 * TODO: (like add routes for accepting new routes or delete existing routes)
	 * Default configurations of the module 
	 * @private
	 * @returns {void}
	 * @memberof GatewayRESTRedirect
	 */
	private loadDefaultConfigs(): void {
		return;
	}
}
