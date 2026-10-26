import { Component, Input } from '@angular/core';
import { Idea } from '../../../../models/idea.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-assistant',
  imports: [FormsModule],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.css',
})
export class AiAssistant {

  @Input() ideas: Idea[] = [];

  // Användarens fråga samt ai assistentens respons
  question = '';
  answer = '';

  // Idéer grupperade utifrån kategorier
  groupedIdeas: {
    category: Idea['categories'];
    ideas: Idea[];
  }[] = [];

  askAI(): void {
    // Tar bort onödiga blanksteg och omvandlar frågan till gemener
    const query = this.question.trim().toLowerCase();

    this.answer = '';
    this.groupedIdeas = [];

    // Meddelande ifall användaren inte skrivit någon fråga
    if (!query) {
      this.answer = 'Skriv vad du vill hitta bland dina idéer.';
      return;
    }

    // Sökorden har genererats med hjälp av AI för att förbättra
    // kategorimatchningen och hjälpa assistenten att hitta relevanta idéer.
    const categories: {
      keywords: string[];
      category: Idea['categories'];
      name: string;
    }[] = [
        {
          keywords: ['ny idé', 'nya idéer', 'ny ide', 'nya ideer',
            'idéförslag', 'ideförslag', 'förslag på idéer',
            'förslag', 'uppslag', 'innovation', 'innovationer',
            'nytänkande', 'kreativa idéer', 'kreativitet',
            'ny lösning', 'nya lösningar', 'utveckla något nytt',
            'uppfinning', 'uppfinningar', 'brainstorm',
            'brainstorming', 'tänk nytt', 'nya möjligheter',
            'idébank', 'idéer att testa', 'nya initiativ'],
          category: 'NEW_IDEA',
          name: 'nya idéer',
        },
        {
          keywords: ['förbättring', 'förbättringar', 'förbättra',
            'utveckla', 'utveckling', 'effektivisera',
            'effektivisering', 'optimera', 'optimering',
            'göra bättre', 'bli bättre', 'förbättra kvalitet',
            'kvalitetsförbättring', 'smidigare', 'smartare',
            'förenkla', 'förenkling', 'förnya',
            'vidareutveckla', 'utvecklingsmöjligheter',
            'förbättringsförslag', 'potential', 'höja kvalitet',
            'tidsbesparing', 'resursbesparing', 'minska kostnader',
            'produktivitetsökning', 'förbättra resultat',
            'vad kan förbättras', 'vad kan bli bättre',
            'vad kan effektiviseras', 'göra mer effektivt'],
          category: 'IMPROVEMENT',
          name: 'förbättringar',
        },
        {
          keywords: ['problem', 'problemlösning', 'problem lösning',
            'lösa problem', 'lös problem', 'utmaning',
            'utmaningar', 'hinder', 'svårigheter',
            'fel', 'brister', 'felhantering', 'felsökning',
            'orsak', 'grundorsak', 'rotorsak',
            'risk', 'risker', 'riskhantering',
            'konflikt', 'konflikter', 'flaskhals',
            'flaskhalsar', 'stopp', 'försening',
            'förseningar', 'vad fungerar inte',
            'vad går fel', 'vad är problemet',
            'hur löser vi', 'åtgärd', 'åtgärder',
            'förebygga problem', 'förhindra fel',
            'minska risker', 'hitta lösning',
            'lösningsförslag', 'kritiska frågor'],
          category: 'PROBLEM_SOLVING',
          name: 'problemlösning',
        },
        {
          keywords: ['process', 'processer', 'arbetsprocess',
            'arbetsprocesser', 'arbetssätt', 'arbetsflöde',
            'arbetsflöden', 'rutiner', 'arbetsrutin',
            'arbetsrutiner', 'metod', 'metoder',
            'arbetsmetod', 'arbetsmetoder', 'workflow',
            'flöde', 'flöden', 'organisation',
            'organisering', 'planering', 'struktur',
            'strukturera', 'samarbetsprocess', 'samarbete',
            'ansvarsfördelning', 'rollfördelning',
            'överlämning', 'överlämningar', 'checklista',
            'dokumentation', 'standardisering',
            'automatisering', 'manuellt arbete',
            'arbetsbelastning', 'arbetsfördelning',
            'mötesstruktur', 'beslutsprocess',
            'hur arbetar vi', 'hur jobbar vi',
            'bättre rutiner', 'smidigare processer'],
          category: 'PROCESS_AND_WAYS_OF_WORKING',
          name: 'processer och arbetssätt',
        },
        {
          keywords: ['aktivitet',
            'aktiviteter', 'projekt', 'projektidé', 'projektidéer', 'projektförslag',
            'initiativ', 'arrangemang', 'evenemang', 'event', 'workshop',
            'workshops', 'utbildning', 'utbildningar', 'kampanj', 'kampanjer',
            'genomförande', 'projektplan', 'projektplanering', 'projektstart',
            'projektmål', 'milstolpe', 'milstolpar', 'leverans',
            'leveranser', 'projektarbete', 'pilotprojekt',
            'testprojekt', 'försöksprojekt', 'aktivitetsplan',
            'teamaktivitet', 'gruppaktivitet', 'kommande aktiviteter',
            'planerade projekt', 'vad ska vi genomföra',
            'vad kan vi starta',

            'utflykt', 'ut och fiska', 'ut och gå', 'gå ut',
            'promenad', 'ta en promenad', 'gå en promenad',
            'gå på promenad', 'promenera', 'vandring',
            'vandra', 'fiska', 'fiske', 'cykla',
            'cykeltur', 'springa', 'löprunda', 'träning',
            'spela spel', 'grillning', 'grilla', 'bada',
            'picknick', 'friluftsliv', 'hitta på något',
            'göra tillsammans', 'gemensam aktivitet'],
          category: 'ACTIVITY_AND_PROJECT',
          name: 'aktiviteter och projekt',
        },
        {
          keywords: ['innehåll', 'kommunikation', 'information',
            'informera', 'informationsflöde', 'informationsdelning',
            'kommunicera', 'budskap', 'budskapet',
            'text', 'texter', 'skriva', 'skrivande',
            'dokument', 'presentation', 'presentationer',
            'rapport', 'rapporter', 'nyhetsbrev',
            'sociala medier', 'publicering', 'publicera',
            'marknadsföring', 'kundkommunikation',
            'internkommunikation', 'externkommunikation',
            'målgrupp', 'målgrupper', 'feedback',
            'återkoppling', 'respons', 'språk',
            'tydlighet', 'tydligare information',
            'kunskapsdelning', 'kunskapsspridning',
            'webbplats', 'webbsida', 'innehållsstrategi',
            'kommunikationsplan', 'hur når vi ut',
            'bättre kommunikation', 'dela information'],
          category: 'CONTENT_AND_COMMUNICATION',
          name: 'innehåll och kommunikation',
        },
        {
          keywords: ['övrigt', 'övriga', 'annat', 'andra idéer',
            'diverse', 'blandat', 'osorterat',
            'allmänt', 'generellt', 'övriga förslag',
            'okategoriserad', 'okategoriserade',
            'vet inte kategori', 'passar inte in'],
          category: 'OTHER',
          name: 'övriga idéer',
        },
      ];

    // Checka ifall användaren vill gruppera idéer utifrån kategori
    const wantsGrouping =
      query.includes('gruppera') ||
      query.includes('gruppering') ||
      query.includes('alla idéer') ||
      query.includes('alla ideer');

    // Hittar den första kategorin som innehåller ett sökord
    // som förekommer i användarens fråga.
    const matchingCategory = categories.find(item =>
      item.keywords.some(keyword => query.includes(keyword))
    );

    // Filtrerar idéerna för att hitta dem som tillhör den matchande kategorin.
    if (matchingCategory && !wantsGrouping) {
      const matches = this.ideas.filter(
        idea => idea.categories === matchingCategory.category
      );

      // Sparar de hittade idéerna eller en tom lista om inga matchningar finns.
      this.groupedIdeas = matches.length
        ? [{ category: matchingCategory.category, ideas: matches }]
        : [];

      // Visar ett meddelande beroende på om några idéer hittades.
      this.answer = matches.length
        ? `Här är ${matches.length} idé(er) inom ${matchingCategory.name}.`
        : `Jag hittade inga idéer inom ${matchingCategory.name}.`;

      return;
    }
    // Grupperar alla idéer efter kategori
    if (wantsGrouping) {
      this.groupedIdeas = categories
        .map(item => ({
          category: item.category,
          ideas: this.ideas.filter(
            idea => idea.categories === item.category
          ),
        }))
        .filter(group => group.ideas.length > 0);

      // Visar meddelande ifall idéerna grupperats eller ifall det inte finns några
      this.answer = this.groupedIdeas.length
        ? 'Här är dina idéer grupperade efter kategori.'
        : 'Det finns inga idéer att gruppera ännu.';

      return;
    }

    // Hjälpmeddelande för frågesats
    this.answer =
      'Jag känner inte igen frågan ännu. Prova exempelvis "Visa alla förbättringar" eller "Gruppera alla idéer".';
  }

  // Omvandlar engelska kategorinamn till svenska
  getCategoryName(category: Idea['categories']): string {
    const names: Record<Idea['categories'], string> = {
      NEW_IDEA: 'Nya idéer',
      IMPROVEMENT: 'Förbättringar',
      PROBLEM_SOLVING: 'Problemlösning',
      PROCESS_AND_WAYS_OF_WORKING: 'Processer och arbetssätt',
      ACTIVITY_AND_PROJECT: 'Aktiviteter och projekt',
      CONTENT_AND_COMMUNICATION: 'Innehåll och kommunikation',
      OTHER: 'Övrigt',
    };

    return names[category];
  }
}