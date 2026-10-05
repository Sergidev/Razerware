import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdvisorService } from '../../advisor.service';
import { ChatMessage } from '../../models';

@Component({
  selector: 'app-advisor',
  imports: [RouterLink],
  templateUrl: './advisor.html',
  styleUrl: './advisor.scss',
})
export class Advisor {
  private advisor = inject(AdvisorService);

  @ViewChild('scroll') scrollEl?: ElementRef<HTMLElement>;

  messages = signal<ChatMessage[]>([]);
  draft = signal('');
  loading = signal(false);
  error = signal('');

  suggestions = [
    'I want to play AAA games at 1440p, budget around 1500 €',
    'Best gaming laptop under 1800 €',
    'I stream and edit video, money is not a problem',
    'Cheap setup to start gaming',
  ];

  send(text: string) {
    const content = text.trim();
    if (!content || this.loading()) return;

    this.messages.update((m) => [...m, { role: 'user', content }]);
    this.draft.set('');
    this.error.set('');
    this.loading.set(true);
    this.scrollDown();

    // Only role + content go to the API (never the product cards)
    const history = this.messages().map(({ role, content }) => ({ role, content }));

    this.advisor.ask(history).subscribe({
      next: (res) => {
        this.messages.update((m) => [
          ...m,
          { role: 'assistant', content: res.reply, products: res.products },
        ]);
        this.loading.set(false);
        this.scrollDown();
      },
      error: (err) => {
        this.error.set(
          err.status === 429
            ? 'Too many requests. Please wait a bit before asking again.'
            : 'The advisor is unavailable right now. If the server was asleep, try again in a few seconds.',
        );
        this.loading.set(false);
      },
    });
  }

  private scrollDown() {
    setTimeout(() => {
      const el = this.scrollEl?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }
}