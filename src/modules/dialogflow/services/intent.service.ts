import { TmdbService } from '@/modules/tmdb/services/tmdb.service';
import { MessageService } from '@/modules/whastapp/service/message.service';
import { google } from '@google-cloud/dialogflow/build/protos/protos';

export class IntentService {
  constructor(private tmdb: TmdbService, private messageService: MessageService) {}

  async welcome(agent: google.cloud.dialogflow.v2.IDetectIntentResponse, phone: string) {
    //const message = agent.queryResult?.fulfillmentText!;
    const message = "Olá, seja bem vindo ao chatbot do cinema!\n"
    +" Funções disponíveis:\n"
    + "- Ver filmes em cartaz\n"
    + "- Ver filmes populares\n"
    + "- Buscar filme *nome do filme*"
    + "\nEscreva o que deseja fazer!\n";
    await this.messageService.sendTextMessage(message, phone);
  }

  async fallback(agent: google.cloud.dialogflow.v2.IDetectIntentResponse, phone: string) {
    const message = agent.queryResult?.fulfillmentText!+ 
    "\nSou um chatbot de cinema!\n"
    +" Funções disponíveis:\n"
    + "- Ver filmes em cartaz\n"
    + "- Ver filmes populares\n"
    + "- Buscar filme *nome do filme*"
    + "\nEscreva o que deseja fazer!\n";
    await this.messageService.sendTextMessage(message, phone);
  }

  
  async searchMovie(agent: google.cloud.dialogflow.v2.IDetectIntentResponse, phone: string) {
    const title = agent.queryResult?.parameters?.fields?.filmes.stringValue!;

    const movies = await this.tmdb.searchMovie({ query: title });
    console.log(title,movies.total_results);
    if(movies.total_results == 0){
      const message = "Não Consegui achar nenhum filme que corresponda a sua busca!\n";
      await this.messageService.sendTextMessage(message, phone);
      return;
    }

    const rows = movies.results.map((movie) => ({
      title: movie.title,
      id: movie.id.toString(),
    }));

    await this.messageService.sendListMessage(
      {
        title: '*Filmes relacionados*',
        rows,
      },
      phone,
    );
  }

  async moviesInTheaters(agent: google.cloud.dialogflow.v2.IDetectIntentResponse, phone: string) {
    const movies = await this.tmdb.playingNow();

    const rows = movies.results.map((movie) => ({
      title: movie.title,
      id: movie.id.toString(),
    }));

    await this.messageService.sendListMessage(
      {
        title: '*Filmes em cartaz no Brasil*',
        rows,
      },
      phone,
    );
  }

  async popularMovies(agent: google.cloud.dialogflow.v2.IDetectIntentResponse, phone: string) {
    const movies = await this.tmdb.popularMovies();

    const rows = movies.results.map((movie) => ({
      title: movie.title,
      id: movie.id.toString(),
    }));

    await this.messageService.sendListMessage(
      {
        title: '*Filmes populares*',
        rows,
      },
      phone,
    );
  }
}
