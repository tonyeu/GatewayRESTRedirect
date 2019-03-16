import { Request, Response } from "express";
import { ClientRequest } from "http";
import https from "https";
import { Base } from "./Base";
import Route from "./Route";

/**
 * Class that executes the request with https module
 * @export
 * @class Requests
 * @extends {Base}
 */
export default class Requests extends Base {

	/**
	 * Creates an instance of Requests.
	 * @memberof Requests
	 */
	constructor() { super(); }

	/**
	 * TODO: Add more content types
	 * GET type request
	 * Content type application/json only
	 * @param {Route} route Route that uses it
	 * @param {Request} req Request received by the server
	 * @param {Response} res Response that the server sends
	 * @returns {(ClientRequest | null)}
	 * @memberof Requests
	 */
	public get(route: Route, req: Request, res: Response): ClientRequest | null {

		if (route.hasError()) {
			res.status(500).send(route.getError());
			return null;
		}

		return https.get(route.getUrl(req.params), (response) => {
			let json = "";
			response.on("data", (data) => {
				json = json.concat(data);
			});

			response.on("end", () => {
				try {
					res.send(route.getContentType() === "application/json" ? JSON.parse(json) : json);
				} catch (e) {
					res.sendStatus(404);
					this.log("error", ` 404 error - Not found - ${JSON.stringify(e)}`);
				}
			});
		}).on("error", (e) => {
			this.log("error", `${e.name} - ${e.message} - ${e.stack}`);
			res.sendStatus(500);
		});
	}

	protected log(level: string, message: string, metadata?: string) {
		super.log(level, Requests.name, message, metadata);
	}
}
