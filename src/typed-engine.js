import {getContentType,CONTENT_TYPES} from './catalog.js?v=010-1';
import {createQuestion,gradeAnswer} from './engine.js?v=010-1';
import {createCurriculumQuestion,gradeCurriculumAnswer} from './curriculum-engine.js?v=010-1';
export function availableTypes(){return CONTENT_TYPES.filter(type=>type.status==='available')}
export function createTypedQuestion(typeId,random=Math.random,options={}){
 const type=getContentType(typeId);
 if(!type||type.status!=='available')throw new RangeError('훈련할 수 없는 유형');
 if(typeId.startsWith('natural.'))return {...createQuestion(typeId.slice(8),random,options),typeId};
 return createCurriculumQuestion(typeId,random);
}
export function gradeTypedAnswer(question,raw){
 if(!question||!question.typeId)throw new TypeError('유형 ID가 없는 문제');
 return question.typeId.startsWith('natural.')?gradeAnswer(question,raw):gradeCurriculumAnswer(question,raw);
}
export function isValidAnswerInput(typeId,raw){
 const text=String(raw).trim();
 if(typeId.startsWith('fraction.'))return /^-?\d+\s*\/\s*-?\d+$/.test(text)&&Number(text.split('/')[1])!==0;
 return /^-?(?:\d+\.?\d*|\.\d+)$/.test(text);
}
