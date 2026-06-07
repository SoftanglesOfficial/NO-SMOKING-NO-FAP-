import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { differenceInCalendarDays, startOfDay } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { Challenge, ChallengeResponse } from './challenge.entity';
import { StartChallengeDto } from './dto/start-challenge.dto';
import { BreakStreakDto } from './dto/break-streak.dto';

type Database = Record<string, Challenge>;

@Injectable()
export class ChallengesService {
  private readonly dbPath = path.join(process.cwd(), 'database.json');

  private normalizeDeviceId(deviceId: string): string {
    return deviceId.trim();
  }

  private readDb(): Database {
    try {
      const raw = fs.readFileSync(this.dbPath, 'utf-8');
      return JSON.parse(raw) as Database;
    } catch {
      return {};
    }
  }

  private writeDb(data: Database): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  private calculateStreak(lastResetDate: string): number {
    const today = startOfDay(new Date());
    const resetDay = startOfDay(new Date(lastResetDate));
    return Math.max(0, differenceInCalendarDays(today, resetDay));
  }

  private toResponse(challenge: Challenge): ChallengeResponse {
    return {
      ...challenge,
      currentStreak: this.calculateStreak(challenge.lastResetDate),
    };
  }

  startChallenge(dto: StartChallengeDto): ChallengeResponse {
    const deviceId = this.normalizeDeviceId(dto.deviceId ?? '');
    const challengeName = dto.challengeName?.trim() ?? '';

    if (!deviceId) {
      throw new BadRequestException('deviceId is required');
    }
    if (!challengeName) {
      throw new BadRequestException('challengeName is required');
    }

    const db = this.readDb();
    const now = new Date().toISOString();
    const existing = db[deviceId];

    const challenge: Challenge = {
      deviceId,
      challengeName,
      startDate: now,
      lastResetDate: now,
      highestStreak: existing?.highestStreak ?? 0,
      isActive: true,
    };

    db[deviceId] = challenge;
    this.writeDb(db);

    return this.toResponse(challenge);
  }

  getChallenge(deviceId: string): ChallengeResponse {
    const normalizedId = this.normalizeDeviceId(deviceId);

    if (!normalizedId) {
      throw new BadRequestException('deviceId is required');
    }

    const db = this.readDb();
    const challenge = db[normalizedId];

    if (!challenge) {
      throw new NotFoundException(
        `No challenge found for device ${normalizedId}`,
      );
    }

    return this.toResponse(challenge);
  }

  breakStreak(dto: BreakStreakDto): ChallengeResponse {
    const deviceId = this.normalizeDeviceId(dto.deviceId ?? '');

    if (!deviceId) {
      throw new BadRequestException('deviceId is required');
    }

    const db = this.readDb();
    const challenge = db[deviceId];

    if (!challenge) {
      throw new NotFoundException(`No challenge found for device ${deviceId}`);
    }

    if (!challenge.isActive) {
      throw new BadRequestException('Challenge is not active');
    }

    const currentStreak = this.calculateStreak(challenge.lastResetDate);

    if (currentStreak > challenge.highestStreak) {
      challenge.highestStreak = currentStreak;
    }

    challenge.isActive = false;
    db[deviceId] = challenge;
    this.writeDb(db);

    return this.toResponse(challenge);
  }
}
