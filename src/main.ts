import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSettings } from './configs/appsettings';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalPrefixOptions } from '@nestjs/common/interfaces';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import _ from 'lodash';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(resolve('./src/public'));
    app.setBaseViewsDir(resolve('./src/views'));

    const routeExclude: GlobalPrefixOptions = {
        exclude: ['auth/([^\\s]+)'],
    };
    app.setGlobalPrefix('api', routeExclude);

    app.enableCors();

    // Init Login interceptor
    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new TransformInterceptor(),
    );

    app.setViewEngine('hbs');

    const mongoUrl = `${appSettings.mongoose.dbConn}/${appSettings.mongoose.dbName}`;
    const refreshTokenExpireMillisecond =
        appSettings.jwt.refreshExpireIn * 1000;
    const minuteMillisecond = 60 * 1000;
    app.use(
        session({
            store: new MongoStore({ mongoUrl: mongoUrl }),
            secret: appSettings.oidc.sessionSecret,
            resave: false,
            saveUninitialized: false,
            rolling: true,
            cookie: {
                maxAge: refreshTokenExpireMillisecond + minuteMillisecond,
                httpOnly: true,
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());
    app.useGlobalPipes(
        new ValidationPipe({ transform: true, whitelist: false }), // temp
    );

    if (_.isEqual(process.env.DEVELOPMENT, 'true')) {
        const config = new DocumentBuilder()
            .setTitle('Cats example')
            .setDescription('The cats API description')
            .setVersion('1.0')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('swagger', app, document);
    }

    await app.listen(appSettings.port);
}
bootstrap();
