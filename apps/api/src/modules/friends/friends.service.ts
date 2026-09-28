import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async getFriends(userId: string) {
    const sent = await this.prisma.friendRequest.findMany({
      where: { senderId: userId, status: 'ACCEPTED' },
      include: { receiver: { include: { profile: true } } },
    });
    const received = await this.prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'ACCEPTED' },
      include: { sender: { include: { profile: true } } },
    });
    const friends = [
      ...sent.map((r) => ({ ...r.receiver, friendshipId: r.id, since: r.createdAt })),
      ...received.map((r) => ({ ...r.sender, friendshipId: r.id, since: r.createdAt })),
    ];
    return friends;
  }

  async getPendingRequests(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: { sender: { include: { profile: true } } },
    });
  }

  async getSentRequests(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: { senderId: userId, status: 'PENDING' },
      include: { receiver: { include: { profile: true } } },
    });
  }

  async sendRequest(userId: string, targetUserId: string) {
    if (userId === targetUserId) throw new Error('Cannot send friend request to yourself');
    const existing = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: userId },
        ],
      },
    });
    if (existing) throw new Error('Friend request already exists');
    return this.prisma.friendRequest.create({
      data: { senderId: userId, receiverId: targetUserId },
    });
  }

  async acceptRequest(userId: string, requestId: string) {
    const request = await this.prisma.friendRequest.findFirst({
      where: { id: requestId, receiverId: userId, status: 'PENDING' },
    });
    if (!request) throw new Error('Friend request not found');
    return this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });
  }

  async rejectRequest(userId: string, requestId: string) {
    const request = await this.prisma.friendRequest.findFirst({
      where: { id: requestId, receiverId: userId, status: 'PENDING' },
    });
    if (!request) throw new Error('Friend request not found');
    return this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  }

  async getSuggestions(userId: string) {
    const friendIds = (await this.getFriends(userId)).map((f) => f.id);
    const pendingIds = (await this.getPendingRequests(userId)).map((r) => r.senderId);
    const sentIds = (await this.getSentRequests(userId)).map((r) => r.receiverId);
    const excludeIds = new Set([userId, ...friendIds, ...pendingIds, ...sentIds]);
    return this.prisma.user.findMany({
      where: { id: { notIn: Array.from(excludeIds) } },
      take: 10,
      include: { profile: true },
    });
  }
}
