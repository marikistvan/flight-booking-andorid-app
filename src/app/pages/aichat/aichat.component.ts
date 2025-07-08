import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application, TextView } from "@nativescript/core";
import { FirebaseAuth } from "@nativescript/firebase-auth";
import { firstValueFrom } from "rxjs";
import { ChatService } from "~/app/services/chat.service";
import { HttpClient } from "@angular/common/http";
import { text } from "stream/consumers";
import { environment } from "~/environments/environment";
export interface Chat {
  userDate?: Date;
  userid: string;
  userMessage: string;
  aiDate?: Date;
  ai?: string;
  aiMessage?: string;
}
@Component({
  selector: "AiChat",
  templateUrl: "./aichat.component.html",
  styleUrls: ["./aichat.component.css"],
})
export class AiChatComponent implements OnInit {
  userMessage = "";
  chatResponse = "";
  isMessageNotNull: boolean;
  month: Date;


  messageHistory: { role: "user" | "assistant" | "system"; content: string, timestamp?: Date }[] = [
  ];

  newMessage: string;
  @ViewChild("messageInput", { static: false })
  messageInputRef: ElementRef<TextView>;

  async sendMessage() {
    if (!this.newMessage || this.newMessage.trim() === "") return;
    this.isMessageNotNull = true;

    const userMessage = this.newMessage.trim();
    this.messageHistory.push({ role: "user", content: this.newMessage });
    this.newMessage = "";
    try {
      const response: any = await firstValueFrom(
        this.http.post(environment.backendUrl+"api/chat/ask", {
          prompt: this.messageHistory,
        })
      );
      this.messageHistory.push({ role: "assistant", content: response.response, timestamp: new Date() });
      //this.saveMessage();
    } catch (error) {
      console.error("Hiba a válasz lekérésekor:", error);
      this.messageHistory.push({
        role: "assistant",
        content: "Sajnálom, hiba történt a válasz lekérésekor.",
      });
    }
  }
  constructor(private chatService: ChatService, private http: HttpClient) { }
  createChat(userid: string) {
    const body = {
      userId1: userid,
      userId2: "AnnaAi",
    };
    console.log("hallo");
    fetch(environment.backendUrl+"api/chat/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        const chatId = data.chatId;
        console.log("létre lett hozva a chat. Id: " + chatId);
      });
  }
  saveMessage(userid: string): void {
    const newChat: Chat = {
      userid: "",
      userMessage: "ada",
    };
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

  ngOnInit(): void {
    this.newMessage = "";
    this.isMessageNotNull = false;
    this.month = new Date();
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }
}