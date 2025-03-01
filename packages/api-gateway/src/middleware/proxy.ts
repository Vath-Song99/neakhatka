import express, { Request, Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { ROUTE_PATHS } from "../routes-def";
import { logger } from "../utils/logger";
import { ClientRequest, IncomingMessage } from "http";
import getConfig from "@api-gateway/utils/createCofig";
import { StatusCode } from "../utils/consts";
import { OptionCookie } from "@api-gateway/utils/cookieOption";

interface ProxyConfig {
  [context: string]: Options<IncomingMessage, Response>;
}

interface NetworkError extends Error {
  code?: string;
}

const config = getConfig();

// Define the proxy rules and targets
const proxyConfigs: ProxyConfig = {
  [ROUTE_PATHS.AUTH_SERVICE]: {
    target: config.authServiceUrl as string,
    changeOrigin: true,
    selfHandleResponse: true,
    pathRewrite: (path, _req) => {
      return `${ROUTE_PATHS.AUTH_SERVICE}${path}`;
    },
    on: {
      proxyReq: (
        proxyReq: ClientRequest,
        req: IncomingMessage,
        _res: Response
      ) => {
        const expressReq = req as Request;
        // Log the request payload
        expressReq.on("data", (chunk) => {
          logger.info(`Request Body Chunk: ${chunk}`);
        });

        // Extract JWT token from session
        const token = expressReq.session!.jwt;
        if (token) {
          proxyReq.setHeader("Authorization", `Bearer ${token}`);
          logger.info(`JWT Token set in Authorization header for AUTH_SERVICE`);
        } else {
          logger.warn(`No JWT token found in session for AUTH_SERVICE`);
        }
        logger.info(
          `Proxied request URL: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
        );
        logger.info(`Headers Sent: ${JSON.stringify(proxyReq.getHeaders())}`);
      },
      proxyRes: (proxyRes, req, res) => {
        let originalBody: Buffer[] = [];
        proxyRes.on("data", function (chunk: Buffer) {
          originalBody.push(chunk);
        });
        proxyRes.on("end", function () {
          const bodyString = Buffer.concat(originalBody).toString("utf8");

          let responseBody: {
            message?: string;
            token?: string;
            errors?: Array<object>;
            url?: string;
          };

          try {
            logger.info(`Gateway recieved bodystrign ${bodyString}`);

            responseBody = JSON.parse(bodyString);

            logger.info(`Gateway received responsebody ${responseBody}`);
            // If Response Error, Not Modified Response
            if (responseBody.errors) {
              return res.status(proxyRes.statusCode!).json(responseBody);
            }

            // Store JWT in session
            if (responseBody.token) {
              (req as Request).session!.jwt = responseBody.token;
              logger.info(`New JWT token stored in session for AUTH_SERVICE`);
            }

            if (responseBody.url) {
              res.redirect(responseBody.url);
            }

            // Modify response to send only the message to the client
            res.json({ message: responseBody.message });
          } catch (error) {
            return res.status(500).json({ message: "Error parsing response" });
          }
        });
      },
      error: (err: NetworkError, _req, res) => {
        logger.error(`Proxy Error: ${err}`);
        switch (err.code) {
          case "ECONNREFUSED":
            (res as Response).status(StatusCode.ServiceUnavailable).json({
              message:
                "The service is temporarily unavailable. Please try again later.",
            });
            break;
          case "ETIMEDOUT":
            (res as Response).status(StatusCode.GatewayTimeout).json({
              message: "The request timed out. Please try again later.",
            });
            break;
          default:
            (res as Response)
              .status(StatusCode.InternalServerError)
              .json({ message: "An internal error occurred." });
        }
      },
    },
  },

  [ROUTE_PATHS.COMPANY_SERVICE]: {
    target: config.companyserviceurl as string,
    pathRewrite: (path, _req) => {
      return `${ROUTE_PATHS.COMPANY_SERVICE}${path}`;
    },
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
      proxyReq: (
        proxyReq: ClientRequest,
        req: IncomingMessage,
        _res: Response
      ) => {
        logger.info(
          `Proxied request URL: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
        );
        logger.info(`Headers Sent: ${JSON.stringify(proxyReq.getHeaders())}`);
        const expressReq = req as Request;

        // Extract JWT token from session
        const token = expressReq.session!.jwt;
        proxyReq.setHeader("Authorization", `Bearer ${token}`);
      },
      proxyRes: (proxyRes, req, res) => {
        let originalBody: Buffer[] = [];
        proxyRes.on("data", function (chunk: Buffer) {
          originalBody.push(chunk);
        });
        proxyRes.on("end", function () {
          const bodyString = Buffer.concat(originalBody).toString("utf8");
          let responseBody: {
            message?: string;
            token?: string;
            data?: Array<object>;
            errors?: Array<object>;
            detail?: object;
          };
          try {
            logger.info(`This is bodystring: ${bodyString}`);
            responseBody = JSON.parse(bodyString);
            logger.info(`Responebody : ${responseBody}`);

            // If Response Error, Not Modified Response
            if (responseBody.errors) {
              return res.status(proxyRes.statusCode!).json(responseBody);
            }

            if (responseBody.token) {
              (req as Request).session!.jwt = responseBody.token;
              res.cookie("persistent", responseBody.token, OptionCookie);
              delete responseBody.token;
            }
            // Modify response to send  the message and user to client to the client
            console.log(responseBody.data);
            res.json({
              message: responseBody.message,
              data: responseBody.data,
              detail: responseBody.detail,
            });
          } catch (error) {
            return res.status(500).json({ message: "Error parsing response" });
          }
        });
      },
      error: (err: NetworkError, _req, res) => {
        logger.error(`Proxy Error: ${err}`);
        switch (err.code) {
          case "ECONNREFUSED":
            (res as Response).status(StatusCode.ServiceUnavailable).json({
              message:
                "The service is temporarily unavailable. Please try again later.",
            });
            break;
          case "ETIMEDOUT":
            (res as Response).status(StatusCode.GatewayTimeout).json({
              message: "The request timed out. Please try again later.",
            });
            break;
          default:
            (res as Response)
              .status(StatusCode.InternalServerError)
              .json({ message: "An internal error occurred." });
        }
      },
    },
  },
};

const applyProxy = (app: express.Application) => {
  Object.keys(proxyConfigs).forEach((context: string) => {
    app.use(context, createProxyMiddleware(proxyConfigs[context]));
  });
  no: {
  }
};

export default applyProxy;
