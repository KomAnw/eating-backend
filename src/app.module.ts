import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    AuthenticationModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
