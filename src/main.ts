import GatewayRESTRedirect, { IGatewayOptions } from "./core/GatewayRESTRedirect";

// Constants
const PORT = 12345;
const HOST = "0.0.0.0";

// App
const options: IGatewayOptions = {
	host: HOST,
	logger: { logger: "console" },
	port: PORT,
};

const gateway = new GatewayRESTRedirect(options);

gateway.listen(PORT, HOST);
