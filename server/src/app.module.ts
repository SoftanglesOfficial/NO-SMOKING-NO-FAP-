import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [ChallengesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
