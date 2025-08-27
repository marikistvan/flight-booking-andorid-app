import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "~/environments/environment";

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

@Injectable({ providedIn: "root" })
export class ChatService {
  private apiUrl = environment.backendUrl+"api/chat/ask";

  constructor(private http: HttpClient) {}

  async sendMessage(prompt: ChatMessage[]): Promise<Observable<any>> {
    const result= await this.http.post<any>(this.apiUrl, { prompt });
    console.log(result);
    return result;
  }
}
