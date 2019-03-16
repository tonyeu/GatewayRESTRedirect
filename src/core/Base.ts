import { ILoggerOptions, instance, Logger  } from "../utils/Logger";

/**
 * Base class of all classes in module
 * @export
 * @abstract
 * @class Base
 */
export abstract class Base {

	/**
	 * Logger o the class. All Classes and object have the same instance of the logger
	 * @private
	 * @type {Logger}
	 * @memberof Base
	 */
	private logger: Logger;

	/**
	 * Creates an instance of Base.
	 * @param {ILoggerOptions} [options]
	 * @memberof Base
	 */
	constructor(options?: ILoggerOptions) {
		options = options || {};
		this.logger = instance(options);
	}

	/**
	 * Uses winston logging system to log messages
	 * @protected
	 * @param {string} level Level of logging
	 * @param {string} className Name of class that invoques the logging
	 * @param {string} message Message to log
	 * @param {string} [metaData] Any metadata
	 * @memberof Base
	 */
	protected log(level: string, className: string, message: string, metaData?: string) {
		this.logger.log(level, className, message, metaData);
	}
}
