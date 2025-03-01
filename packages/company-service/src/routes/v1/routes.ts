/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CompanyController } from './../../controller/company.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "companycreateschema": {
        "dataType": "refObject",
        "properties": {
            "companyName": {"dataType":"string","required":true},
            "contactEmail": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "companyupdateschema": {
        "dataType": "refObject",
        "properties": {
            "companyName": {"dataType":"string"},
            "logo": {"dataType":"string"},
            "contactPhone": {"dataType":"double"},
            "websiteLink": {"dataType":"string"},
            "location": {"dataType":"string"},
            "contactEmail": {"dataType":"string"},
            "contactPerson": {"dataType":"string"},
            "numberOfEmployees": {"dataType":"double"},
            "address": {"dataType":"string"},
            "companyDescription": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "postcreateschema": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "requirements": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "responsibilities": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "people": {"dataType":"double","required":true},
            "location": {"dataType":"string","required":true},
            "duration": {"dataType":"double","required":true},
            "gender": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["male"]},{"dataType":"enum","enums":["female"]},{"dataType":"enum","enums":["other"]}],"required":true},
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["full-time"]},{"dataType":"enum","enums":["part-time"]}],"required":true},
            "available_position": {"dataType":"double","required":true},
            "language": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "deadline": {"dataType":"datetime","required":true},
            "salaries": {"dataType":"array","array":{"dataType":"double"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "postupdateschema": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string"},
            "description": {"dataType":"string"},
            "requirements": {"dataType":"array","array":{"dataType":"string"}},
            "responsibilities": {"dataType":"array","array":{"dataType":"string"}},
            "people": {"dataType":"double"},
            "location": {"dataType":"string"},
            "duration": {"dataType":"double"},
            "gender": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["male"]},{"dataType":"enum","enums":["female"]},{"dataType":"enum","enums":["other"]}]}},
            "type": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["full-time"]},{"dataType":"enum","enums":["part-time"]}]}},
            "available_position": {"dataType":"double"},
            "language": {"dataType":"array","array":{"dataType":"string"}},
            "deadline": {"dataType":"datetime"},
            "salaries": {"dataType":"array","array":{"dataType":"double"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.post('/v1/company',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.Create)),

            async function CompanyController_Create(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"companycreateschema"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'Create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/company/:id',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.GetByid)),

            async function CompanyController_GetByid(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'GetByid',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/v1/company/:id',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.Update)),

            async function CompanyController_Update(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    update: {"in":"body","name":"update","required":true,"ref":"companyupdateschema"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'Update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 302,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/v1/company/:id',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.Delete)),

            async function CompanyController_Delete(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'Delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/v1/company/posting',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.Postng)),

            async function CompanyController_Postng(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"postcreateschema"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'Postng',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/company/post/:id',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.GetPostCard)),

            async function CompanyController_GetPostCard(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'GetPostCard',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 302,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/v1/company/post:id',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.Updatepost)),

            async function CompanyController_Updatepost(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    update: {"in":"body","name":"update","required":true,"ref":"postupdateschema"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'Updatepost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/v1/company/post/:id',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.DeletePost)),

            async function CompanyController_DeletePost(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'DeletePost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
