import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: { email: string; password: string; name: string; username: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        username: data.username,
        wallet: { create: {} },
        profile: { create: {} },
      },
      include: { wallet: true, profile: true },
    });
    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
    return { user: this.sanitize(user), token };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');
    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
    return { user: this.sanitize(user), token };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { wallet: true, profile: true } });
    if (!user) throw new Error('User not found');
    return this.sanitize(user);
  }

  async updateProfile(userId: string, data: { name?: string; bio?: string; phone?: string; username?: string; avatarUrl?: string }) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.username) updateData.username = data.username;
    if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;

    if (data.bio || data.phone) {
      const profileData: any = {};
      if (data.bio !== undefined) profileData.bio = data.bio;
      if (data.phone !== undefined) profileData.phone = data.phone;
      await this.prisma.userProfile.update({ where: { userId }, data: profileData });
    }

    if (Object.keys(updateData).length > 0) {
      await this.prisma.user.update({ where: { id: userId }, data: updateData });
    }

    return this.getMe(userId);
  }

  private sanitize(user: any) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
