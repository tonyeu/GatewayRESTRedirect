import { Base } from "./Base";

export interface IRouteOptions {
	url: string;
	requestType: "GET" | "POST" | "PUT" | "DELETE";
	path: string;
	contentType: "application/json" | string;
}

export default class Route extends Base {

	constructor(private options: IRouteOptions) {
		super();
	}

	public getUrl() { return this.options.url; }
	public getPath() { return this.options.path; }
	public getRequestType() { return this.options.requestType; }
	public getContentType() { return this.options.contentType; }
}
