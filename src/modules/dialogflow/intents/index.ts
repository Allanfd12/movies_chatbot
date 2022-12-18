import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { IntentService } from '../services/intent.service';
import { config } from 'dotenv';
import { TmdbService } from '../../tmdb/services/tmdb.service';
import { MessageService } from '../../whastapp/service/message.service';
config();

const tmdb = new TmdbService(process.env.TMDB_API_KEY?.toString()!);
const messageService = new MessageService();

export const intentService = new IntentService(tmdb, messageService);

export const intentMap = new Map<
  string,
  (agent: google.cloud.dialogflow.v2.IDetectIntentResponse, phone: string) => Promise<void>
>([
  ['Default Welcome Intent', (agent, phone) => intentService.welcome(agent, phone)],
  ['Default Fallback Intent', (agent, phone) => intentService.fallback(agent, phone)],
  ['Buscar filme', (agent, phone) => intentService.searchMovie(agent, phone)],
  ['Filmes em cartaz', (agent, phone) => intentService.moviesInTheaters(agent, phone)],
  ['Buscar filmes populares', (agent, phone) => intentService.popularMovies(agent, phone)],
]);

