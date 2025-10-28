import {
    Component,
    ViewChild,
    OnInit,
    ElementRef,
    signal,
} from '@angular/core';
import { TextView } from '@nativescript/core';
import { ChatService } from '~/app/services/chat.service';
import { Chat } from '../../models/chat';
import { MessageHistory } from '~/app/models/messageHistory';
import { Message } from '~/app/models/message';
import { localize } from '@nativescript/localize';

@Component({
    selector: 'ns-aichat',
    templateUrl: './aichat.component.html',
    styleUrls: ['./aichat.component.scss'],
})
export class AiChatComponent implements OnInit {
    chatResponse: any;
    newMessage = signal('');
    messages: Message[] = [];
    messageHistory = signal<MessageHistory[]>([]);
    @ViewChild('messageInput', { static: false })
    messageInputRef: ElementRef<TextView>;

    constructor(private chatService: ChatService) { }

    async ngOnInit(): Promise<void> {
        try {
            await this.chatService.getMessagesFromFirebase();

            this.messages = this.chatService.messages();
            this.setMessageHistory();
        } catch (error) {
            console.error('Hiba az üzenetek lekérésekor:', error);
        }
    }
    setMessageHistory() {
        const history: MessageHistory[] = this.messages.map((m) => ({
            role: m.isAi ? 'assistant' : 'user',
            content: m.message,
            timestamp: m.createdAt,
        }));

        this.messageHistory.set(history);
    }

    async sendMessage() {
        this.newMessage.set(this.newMessage().trim());
        if (this.newMessage() === '') return;
        this.messageHistoryUpdate('user', this.newMessage());
        this.chatService.saveMessage(this.newMessage(), false);
        this.newMessage.set('');
        try {
            this.chatResponse = await this.chatService.sendMessage(
                this.messageHistory()
            );
            this.messageHistoryUpdate('assistant', this.chatResponse);
            this.chatService.saveMessage(this.chatResponse, true);
        } catch (error) {
            console.error('Hiba a válasz lekérésekor:', error);
            this.messageHistoryUpdate(
                'assistant',
                localize('aiChat.chatError')
            );
        }
    }

    messageHistoryUpdate(senderRole, content: string) {
        this.messageHistory.update((history) => [
            ...history,
            {
                role: senderRole,
                content: content,
                timestamp: new Date(),
            },
        ]);
    }
}
