import { Component, ViewChild, OnInit, ElementRef, OnDestroy, signal } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application, TextView } from "@nativescript/core";
import { firstValueFrom, Observable } from "rxjs";
import { ChatService } from "~/app/services/chat.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "~/environments/environment";
import { Chat } from "../../models/chat";
import { MessageHistory } from '~/app/models/messageHistory'
import { Message } from "~/app/models/message";
import { localize } from "@nativescript/localize";

@Component({
  selector: "ns-aichat",
  templateUrl: "./aichat.component.html",
  styleUrls: ["./aichat.component.scss"],
})
export class AiChatComponent implements OnInit, OnDestroy {
  chatResponse: any;
  newMessage = signal('');
  messages: Message[] = [];
  messageHistory = signal<MessageHistory[]>([]);
  @ViewChild("messageInput", { static: false })
  messageInputRef: ElementRef<TextView>;

  constructor(private chatService: ChatService, private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.chatService.getMessagesFromFirebase();

      this.messages = this.chatService.messages();
      this.setMessageHistory();
    } catch (error) {
      console.error("Hiba az üzenetek lekérésekor:", error);
    }
  }
  setMessageHistory() {

    const history : MessageHistory[] = this.messages.map(m => ({
      role:m.isAi? 'assistant' :'user',
      content:m.message,
      timestamp:m.createdAt
    }));

    this.messageHistory.set(history);
  }

  ngOnDestroy(): void {
  }

  async sendMessage() {
    this.newMessage.set(this.newMessage().trim());
    if (this.newMessage() === "") return;
    this.messageHistory.update(history => [...history, { role: "user", content: this.newMessage(), timestamp: new Date() }]);
    this.chatService.saveMessage(this.newMessage(), false);
    this.newMessage.set("");
    try {
      this.chatResponse = await firstValueFrom(
        this.http.post(environment.backendUrl + "api/chat/ask", {
          prompt: this.messageHistory(),
        })
      );
      this.messageHistory.update(history => [...history, { role: "assistant", content: this.chatResponse, timestamp: new Date() }]);
      this.chatService.saveMessage(this.chatResponse, true);
    } catch (error) {
      console.error("Hiba a válasz lekérésekor:", error);
      this.messageHistory.update(history => [...history, { role: "assistant", content: localize('aiChat.chatError'), timestamp: new Date() }]);
    }
  }

  onTextChange(event) {
    const textView = this.messageInputRef.nativeElement;
    setTimeout(() => {
      const lineHeight = 100;
      const maxLines = 5;
      const lineCount = textView.text
        ? (textView.text.match(/\n/g)?.length || 0) + 1
        : 1;
      const newHeight = Math.min(lineCount, maxLines) * lineHeight + 16;
      textView.height = newHeight;
    });
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }
}