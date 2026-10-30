# BrainDump – Frontend
https://braindump-frontend.onrender.com/

BrainDump är en webbaserad applikation för att samla in, organisera och hantera idéer tillsammans med andra deltagare. Syftet är att göra det enkelt att dela tankar, utveckla förbättringsförslag och hitta nya lösningar gemensamt.

Frontend är utvecklad med **Angular** och kommunicerar med en backend som hanterar data om boards, deltagare och idéer. Applikationen innehåller även en AI-assistent som hjälper användaren att hitta och gruppera idéer utifrån kategorier.

## Funktioner

### Hantering av boards:

- Visa och välja boards.
- Skapa en gemensam plats där idéer kan samlas.
- Hämta information om boards från backend.

### Hantering av idéer:

- Visa idéer som tillhör en board.
- Skapa nya idéer med titel och beskrivning.
- Visa information om vem som har skapat en idé.
- Ta bort enskilda idéer.
- Visa ett meddelande när det inte finns några idéer.

### Deltagare:

- Lägga till deltagare i en board.
- Använda visningsnamn för att identifiera vem som har skapat en idé.

### Kategorisering av idéer:

Idéer kategoriseras för att göra dem enklare att organisera och hitta.

Applikationen innehåller följande kategorier:

| Kategori | Beskrivning |
|---|---|
| `NEW_IDEA` | Nya idéer |
| `IMPROVEMENT` | Förbättringar |
| `PROBLEM_SOLVING` | Problemlösning |
| `PROCESS_AND_WAYS_OF_WORKING` | Processer och arbetssätt |
| `ACTIVITY_AND_PROJECT` | Aktiviteter och projekt |
| `CONTENT_AND_COMMUNICATION` | Innehåll och kommunikation |
| `OTHER` | Övrigt |

### AI-assistent:

AI-assistenten hjälper användaren att söka bland och gruppera befintliga idéer.

Funktioner:

- Söka efter idéer inom en viss kategori genom att skriva en fråga.
- Visa idéer som matchar en identifierad kategori.
- Gruppera idéer efter kategori.
- Visa ett meddelande när inga matchande idéer hittas.
- Ge exempel på frågor som användaren kan ställa.

> **Observera:** Den nuvarande assistenten i frontend använder nyckelord och textmatchning för att tolka frågor. Den använder alltså inte själv någon AI-modell för att förstå användarens frågor. Backend använder LangChain4j och OpenAI för automatisk kategorisering när nya idéer skapas.

## Tekniker

Frontend använder följande tekniker:

- **Angular** – ramverk för att bygga användargränssnittet.
- **TypeScript** – programmeringsspråk för komponenter och logik.
- **HTML** – struktur för gränssnittet.
- **CSS** – layout, färger, responsivitet och styling.
- **FormsModule** – hantering av formulär och databindning med exempelvis `ngModel`.
- **REST API** – kommunikation med backend för att hämta och hantera data.

Backend är utvecklad med:

- **Quarkus** – Java-baserat backendramverk.
- **Java** – programmeringsspråk för backend.
- **PostgreSQL** – relationsdatabas.
- **LangChain4j och OpenAI** – används för automatisk kategorisering av idéer.


### Viktiga delar

- **Board-komponenten:** Visar boardens innehåll och tillhörande idéer.
- **AiAssistant-komponenten:** Hanterar användarens frågor och visar matchande eller grupperade idéer.
- **Modeller:** Definierar strukturen för data som används i frontend.
- **Tjänster:** Samlar API-anrop och kommunikation med backend, om de används för dessa uppgifter i projektet.

## Installation

### 1. Klona projektet

```bash
git clone <repository-url>
cd <frontend-mapp>
```

### 2. Installera beroenden

```bash
npm install
```

### 3. Starta utvecklingsservern

```bash
ng serve
```

### 4. Anslutning sker vanligtvis till localhost:4200

