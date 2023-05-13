import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appSettings } from './configs/appsettings';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';
import { MobileModule } from './apis/mobile/mobile.module';
import { AuthModule } from './apis/auth/auth.module';
@Module({
    imports: [
        MongooseModule.forRoot(
            `${appSettings.mongoose.dbConn}/${appSettings.mongoose.dbName}`,
        ),
        AutomapperModule.forRoot([
            {
                name: 'classes',
                strategyInitializer: classes(),
                namingConventions: new CamelCaseNamingConvention(),
            },
        ]),
        MobileModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggingMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
