import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Repository } from 'typeorm';

import { v4 as uuid } from 'uuid';

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>
    ){}


    public async findByRefreshTokenAndUserId(refreshToken: string, userId: number): Promise<RefreshToken> {
        return this.refreshTokenRepository.findOne({ 
          refreshToken: refreshToken, 
          user: { id: userId }
        });
      }
    
      public async findNonBlacklistedByUserId(userId: number): Promise<RefreshToken> {
        return this.refreshTokenRepository.findOne({
          isBlacklisted: false,
          user: { id: userId }
        });
      }
    
      public async createNewRefreshToken(userId: number): Promise<RefreshToken> {
        const refreshToken: RefreshToken = this.refreshTokenRepository.create({
          refreshToken: uuid(),
          user: { id: userId }
        });
        return this.refreshTokenRepository.save(refreshToken);
      }

}
