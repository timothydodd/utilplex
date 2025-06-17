import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GeneratorServiceBase } from './generator.service';

export interface LoremIpsumOptions {
  type: 'words' | 'sentences' | 'paragraphs';
  count: number;
  startWithLorem: boolean;
}

@Injectable()
export class LoremIpsumGeneratorService extends GeneratorServiceBase {
  override title = 'Lorem Ipsum Generator';
  override routeName = 'Lorem';

  private readonly loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua',
    'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris',
    'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in',
    'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur',
    'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui',
    'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem', 'aperiam',
    'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis', 'et', 'quasi',
    'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo', 'nemo', 'ipsam',
    'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit', 'fugit', 'sed',
    'quia', 'consequuntur', 'magni', 'dolores', 'ratione', 'sequi', 'nesciunt',
    'neque', 'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam', 'eius', 'modi',
    'tempora', 'incidunt', 'magnam', 'quaerat', 'voluptatem'
  ];

  override generate(options: LoremIpsumOptions = { type: 'paragraphs', count: 3, startWithLorem: true }): Observable<string> {
    let result = '';

    switch (options.type) {
      case 'words':
        result = this.generateWords(options.count, options.startWithLorem);
        break;
      case 'sentences':
        result = this.generateSentences(options.count, options.startWithLorem);
        break;
      case 'paragraphs':
        result = this.generateParagraphs(options.count, options.startWithLorem);
        break;
    }

    return of(result);
  }

  private generateWords(count: number, startWithLorem: boolean): string {
    const words: string[] = [];
    
    if (startWithLorem && count > 0) {
      words.push('Lorem');
      count--;
    }

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * this.loremWords.length);
      words.push(this.loremWords[randomIndex]);
    }

    return words.join(' ');
  }

  private generateSentences(count: number, startWithLorem: boolean): string {
    const sentences: string[] = [];

    for (let i = 0; i < count; i++) {
      const sentenceLength = Math.floor(Math.random() * 10) + 5; // 5-14 words per sentence
      const isFirstSentence = i === 0 && startWithLorem;
      const sentence = this.generateWords(sentenceLength, isFirstSentence);
      const capitalizedSentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      sentences.push(capitalizedSentence + '.');
    }

    return sentences.join(' ');
  }

  private generateParagraphs(count: number, startWithLorem: boolean): string {
    const paragraphs: string[] = [];

    for (let i = 0; i < count; i++) {
      const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-7 sentences per paragraph
      const isFirstParagraph = i === 0 && startWithLorem;
      const paragraph = this.generateSentences(sentenceCount, isFirstParagraph);
      paragraphs.push(paragraph);
    }

    return paragraphs.join('\n\n');
  }
}