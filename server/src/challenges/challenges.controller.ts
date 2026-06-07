import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { StartChallengeDto } from './dto/start-challenge.dto';
import { BreakStreakDto } from './dto/break-streak.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post('start')
  startChallenge(@Body() dto: StartChallengeDto) {
    return this.challengesService.startChallenge(dto);
  }

  @Post('break')
  breakStreak(@Body() dto: BreakStreakDto) {
    return this.challengesService.breakStreak(dto);
  }

  @Get(':deviceId')
  getChallenge(@Param('deviceId') deviceId: string) {
    return this.challengesService.getChallenge(decodeURIComponent(deviceId));
  }
}
