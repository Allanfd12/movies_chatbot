import { intentMap } from './intents';
import { SendBotDto } from './model/dialogflow';
import { SendDialogflowService } from './services/send.service';

export const handleDialogflow = async (dto: SendBotDto) => {
  const sendDialogflowService = new SendDialogflowService('primeiroagente-oxtm', dto.phone, 'pt-BR');

  const response = await sendDialogflowService.detectIntent(dto.message);

  console.log(response);

  const intentName = response.queryResult?.intent?.displayName;
console.log(intentName);
  if (!intentName || !intentMap.has(intentName)) throw new Error('Intent not found');

  const fn = intentMap.get(intentName)!;

  return fn(response, dto.phone);
};
