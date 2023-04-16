import { APP_ENV } from '@app/app.config';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { APP_CONFIG } from '@app/app.constants';


export function MicroServicesConfig() {
    const appConfig: ConfigType<typeof APP_ENV> = APP_ENV()

    return ClientsModule.register([
        {
            name: APP_CONFIG.EVENT_SERVICE,
            transport: Transport.RMQ,
            options: {
                urls: [`${appConfig.RMQ_URI}`],
                queue: `${appConfig.RMQ_EVENT_QUEUE}`,
                queueOptions: { durable: false },
                persistent: true
            },
        },
        // {
        //     name: APP_CONFIG.EXPERIENCE_SERVICE,
        //     transport: Transport.REDIS,
        //     options: {
        //         url: appConfig.EXPERIENCE_SERVICE
        //     }
        // },
        // {
        //     name: APP_CONFIG.PROJECT_SERVICE,
        //     transport: Transport.RMQ,
        //     options: {
        //         urls: [`${appConfig.RMQ_URI}`],
        //         queue: `${appConfig.RMQ_PROJECT_QUEUE}`,
        //         queueOptions: { durable: false },
        //         persistent: true
        //     },
        // }
    ]);
}
