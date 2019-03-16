import Winston, { format } from "winston";

/**
 * Logger options
 * @export
 * @interface ILoggerOptions
 */
export interface ILoggerOptions {
	logger?: "file" | "console" | "all" | "none"; // file, console, all, none;
	filename?: string;
}

export const instance = (loggerOptions?: ILoggerOptions) => {
	return Logger.getInstance(loggerOptions);
};

/**
 * Wrapper class o the winston logger
 * Creates only one logger object. Returns that instance.
 * @export
 * @class Logger
 */
export class Logger {

	/**
	 * Returns an instance of the Logger class.
	 * @static
	 * @param {ILoggerOptions} [loggerOptions] Options provided
	 * @returns {Logger}
	 * @memberof Logger
	 */
	public static getInstance(loggerOptions?: ILoggerOptions): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger(loggerOptions);
		}
		return Logger.instance;
	}

	private static instance: Logger;

	/**
	 * Winston transports default configs
	 * @private
	 * @static
	 * @memberof Logger
	 */
	private static transportConfigs = {
		console: {
			colorize: true,
			handleExceptions: true,
			json: false,
			level: "debug",
		},
		file: {
			colorize: false,
			filename: `./logs/app.log`,
			handleExceptions: true,
			json: true,
			level: "info",
			maxFiles: 5,
			maxsize: 5242880, // 5MB
		},
	};

	/**
	 * Available transports
	 * @private
	 * @static
	 * @memberof Logger
	 */
	private static readonly transports = {
		console: new Winston.transports.Console(Logger.transportConfigs.console),
		file: new Winston.transports.File(Logger.transportConfigs.file),

	};

	/**
	 * Default configurations of the winston logger
	 * @private
	 * @static
	 * @memberof Logger
	 */
	private static readonly defaultConfig = {
		exitOnError: false,
		format: format.combine(
			format.timestamp({
				format: "YYYY-MM-DD HH:mm:ss",
			}),
			format.json()),
		transports: [
			Logger.transports.file,
		],
	};

	private logger: Winston.Logger;
	private state: boolean;

	/**
	 * Creates an instance of Logger.
	 * @param {ILoggerOptions} [loggerOptions]
	 * @memberof Logger
	 */
	private constructor(private loggerOptions?: ILoggerOptions) {
		Logger.instance = this;
		this.state = true;

		if (this.loggerOptions && this.loggerOptions.filename) {
			Logger.transportConfigs.file.filename = this.loggerOptions.filename;
		}

		this.logger = Winston.createLogger(Logger.defaultConfig);
		if (this.loggerOptions && this.loggerOptions.logger) {
			if (this.loggerOptions.logger === "none") {
				this.state = false;
				return;
			} else if (this.loggerOptions.logger === "console") {
				this.logger.remove(Logger.transports.file);
				this.logger.add(Logger.transports.console);
			} else if (this.loggerOptions.logger === "all") {
				this.logger.add(Logger.transports.console);
			}
		}
	}

	/**
	 * Logger function of the wrapper class
	 * @param {string} level Level of loggin
	 * @param {string} className Class that call function
	 * @param {string} message Message to log
	 * @param {*} [metaData] Any metadata
	 * @memberof Logger
	 */
	public log(level: string, className: string, message: string, metaData?: any) {
		if (this.state) {
			this.logger.log(level, `${className} class - ${message}`, metaData);
		}
	}
}
