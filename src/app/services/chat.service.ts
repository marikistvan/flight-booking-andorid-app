import { Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '~/environments/environment';
import { AuthService } from './auth.service';
import { firebase } from '@nativescript/firebase-core';
import { Message } from '~/app/models/message';
import { FieldValue } from '@nativescript/firebase-firestore';
export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

@Injectable({ providedIn: 'root' })
export class ChatService implements OnInit {
    private apiUrl = environment.backendUrl + 'api/chat/ask';
    public messages = signal<Message[]>([]);
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    ngOnInit(): void { }

    async sendMessage(prompt: ChatMessage[]): Promise<Observable<any>> {
        const result = await firstValueFrom(this.http.post<any>(this.apiUrl, { prompt }));;
        return result;
    }

    async saveMessage(message: string, isAi = false) {
        const msgRef = firebase()
            .firestore()
            .collection('users')
            .doc(this.authService.currentUser.uid)
            .collection('messages');

        await msgRef.add({
            message,
            isAi,
            createdAt: FieldValue.serverTimestamp()
        });
    }

    deleteMessages() {
        firebase()
            .firestore()
            .collection('conversations')
            .doc(this.authService.currentUser.uid)
            .delete();
    }

    async getMessagesFromFirebase() {
        try {
            const querySnapshot = await firebase()
                .firestore()
                .collection('users')
                .doc(this.authService.currentUser.uid)
                .collection('messages')
                .orderBy('createdAt', 'asc')
                .limitToLast(4)
                .get();

            const newMessages: any[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                newMessages.push({
                    id: doc.id,
                    message: data?.message ?? '',
                    isAi: data?.isAi,
                    createdAt: data?.createdAt?.toDate() ?? null,
                });
            });

            this.messages.set(newMessages);
        } catch (error) {
            console.error('Hiba a Firebase üzenetek lekérésekor:', error);
        }
    }
}
