import { Base } from "./Base";

/**
 * Interface for the route options
 * @export
 * @interface IRouteOptions
 */
export interface IRouteOptions {
	url: string;
	requestType: "GET" | "POST" | "PUT" | "DELETE";
	path: string;
	contentType: "application/json" | string;
}

/**
 * Route class represents rest directories in the server
 * Each one has a path, an url destination, a type of request and a content type
 * @export
 * @class Route
 * @extends {Base}
 */
export default class Route extends Base {

	/**
	 * Error types
	 * @private
	 * @static
	 * @memberof Route
	 */
	private static readonly errorTypes = {
		INVALID_OPTION: "Options provided are invalid",
		NONE: "none",
	};

	private error: boolean = false;
	private errorType: string = Route.errorTypes.NONE;

	/**
	 * Creates an instance of Route.
	 * @param {IRouteOptions} options
	 * @memberof Route
	 */
	constructor(private options: IRouteOptions) {
		super();
		this.validateOptions();
		this.log("info", `Created ${this.options.requestType}
				route with path ${this.options.path} and url ${this.options.url}`);
	}

	/**
	 * Returns a formated url or original url
	 * @param {*} params Params of the request, to substitute in the base url
	 * @returns
	 * @memberof Route
	 */
	public getUrl(params?: any) {
		let url =  this.options.url + "";
		if (params) {
			const keys = Object.keys(params);
			keys.forEach((key) => {
				url = url.replace(`:${key}`, params[key]);
			});
		}
		return url;
	}

	/**
	 * The path this route is known for
	 * @returns
	 * @memberof Route
	 */
	public getPath() {
		return this.options.path;
	}

	/**
	 * The type of request this route represents
	 * @returns
	 * @memberof Route
	 */
	public getRequestType() {
		return this.options.requestType;
	}

	/**
	 * Returns the content type o the route
	 * @returns
	 * @memberof Route
	 */
	public getContentType() {
		return this.options.contentType;
	}

	/**
	 * Route has an error in configuration
	 * @returns {boolean}
	 * @memberof Route
	 */
	public hasError(): boolean {
		return this.error;
	}

	/**
	 * Returns the type of error
	 * @returns {string}
	 * @memberof Route
	 */
	public getError(): string {
		return this.errorType;
	}

	protected log(level: string, message: string, metadata?: string) {
		super.log(level, RegExp.name, message, metadata);
	}

	/**
	 * Verification of the options provided in route
	 * @private
	 * @memberof Route
	 */
	private validateOptions() {
		const regx = /:+[A-Za-z0-9_-]*/g;
		const options = this.options;

		// verify params
		const params = options.path.match(regx);
		if (params !== null) {
			params.forEach( (param) => {
				if (this.options.url.indexOf(param) === -1) {
					this.error = true;
					this.errorType = Route.errorTypes.INVALID_OPTION;
					this.log("info", `Error in options, request params: ${param}
							 does not exists in url: ${this.options.url}`);
				}
			});
		}
	}
}
