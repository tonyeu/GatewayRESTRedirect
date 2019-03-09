import Winston, { format } from "winston";

export interface ILoggerOptions {
	logger?: string; // file, console, all, none;
	filename?: string;
}

export const instance = (loggerOptions?: ILoggerOptions) => {
	return Logger.getInstance(loggerOptions);
};

export class Logger {

	public static getInstance(loggerOptions?: ILoggerOptions) {
		if (!Logger.instance) {
			Logger.instance = new Logger(loggerOptions);
		}
		return Logger.instance;
	}

	private static instance: Logger;

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

	private static readonly transports = {
		console: new Winston.transports.Console(Logger.transportConfigs.console),
		file: new Winston.transports.File(Logger.transportConfigs.file),

	};
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

	public log(level: string, className: string, message: string, metaData?: any) {
		if (this.state) {
			this.logger.log(level, `${className} class - ${message}`, metaData);
		}
	}
}
