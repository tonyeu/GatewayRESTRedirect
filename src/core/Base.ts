import { ILoggerOptions, instance, Logger  } from "../utils/Logger";

export abstract class Base {

	private logger: Logger;

	constructor(options?: ILoggerOptions) {
		options = options || {};
		this.logger = instance(options);
	}

	protected log(level: string, className: string, message: string, metaData?: string){
		this.logger.log(level, className, message, metaData);
	}
}