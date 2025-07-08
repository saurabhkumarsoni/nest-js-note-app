import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotesService } from './notes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private readonly notesService: NotesService,
    private userService: UsersService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminders() {
    const now = new Date();
    const from = new Date(now.getTime() - 60_000);

    const users = await this.userService.getAllUsers(); // assume this returns [{ id: 1 }, { id: 2 }, ...]

    for (const user of users) {
      const due = await this.notesService.findDueReminders(user.id, from, now);

      for (const note of due) {
        this.logger.log(`Reminder for ${user.id}: "${note.name}" is due now!`);
        await this.notesService.clearReminder(note.id);
      }
    }
  }
}
