
const $ = id => document.getElementById(id);
const STORAGE_KEY = 'yeonsanrun_history_v1';

const TYPES = {
  3: [
    {id:'add3',name:'세 자리 수 덧셈',subs:['전체','받아올림 없음','받아올림 있음']},
    {id:'sub3',name:'세 자리 수 뺄셈',subs:['전체','받아내림 없음','받아내림 있음']},
    {id:'mul2x1',name:'두 자리 수 × 한 자리 수',subs:['전체','올림 없음','올림 있음']}
  ],
  4: [
    {id:'mul3x2',name:'세 자리 수 × 두 자리 수',subs:['전체','올림 없음','올림 있음']},
    {id:'div2x1',name:'두 자리 수 ÷ 한 자리 수',subs:['나머지 없음','나머지 있음']},
    {id:'div3x2',name:'세 자리 수 ÷ 두 자리 수',subs:['나머지 없음','나머지 있음']}
  ]
};

let questions = [];
let records = [];
let index = 0;
let questionStart = 0;
let answered = false;
let timerId = null;
let nextTimerId = null;
let sessionInfo = {};
let sessionSaved = false;

const rand = (lo, hi) =>
  lo + Math.floor(Math.random() * (hi - lo + 1));

function updateTypes() {
  const list = TYPES[$('grade').value];
  $('type').innerHTML = list.map(t =>
    `<option value="${t.id}">${t.name}</option>`
  ).join('');
  updateSubtypes();
}

function updateSubtypes() {
  const t = TYPES[$('grade').value]
    .find(x => x.id === $('type').value);

  $('subtype').innerHTML = t.subs.map(s =>
    `<option value="${s}">${s}</option>`
  ).join('');
}

function hasCarry(a, b) {
  let carry = 0;

  while (a > 0 || b > 0) {
    const sum = a % 10 + b % 10 + carry;
    if (sum >= 10) return true;

    carry = 0;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return false;
}

function hasBorrow(a, b) {
  let borrow = 0;

  while (a > 0 || b > 0) {
    const digit = a % 10 - borrow;
    if (digit < b % 10) return true;

    borrow = 0;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return false;
}

function multiplicationCarry(a, b) {
  for (const digit of String(b).split('').map(Number)) {
    let carry = 0;
    let n = a;

    while (n > 0) {
      const product = (n % 10) * digit + carry;
      if (product >= 10) return true;

      carry = Math.floor(product / 10);
      n = Math.floor(n / 10);
    }
  }
  return false;
}

function createCandidate(type, subtype) {
  let a, b, answer, symbol;
  let remainder = 0;

  switch (type) {
    case 'add3':
      a = rand(100, 999);
      b = rand(100, 999);
      answer = a + b;
      symbol = '+';
      break;

    case 'sub3':
      a = rand(100, 999);
      b = rand(100, a);
      answer = a - b;
      symbol = '−';
      break;

    case 'mul2x1':
      a = rand(10, 99);
      b = rand(2, 9);
      answer = a * b;
      symbol = '×';
      break;

    case 'mul3x2':
      a = rand(100, 999);
      b = rand(10, 99);
      answer = a * b;
      symbol = '×';
      break;

    case 'div2x1':
    case 'div3x2': {
      const three = type === 'div3x2';
      const minA = three ? 100 : 10;
      const maxA = three ? 999 : 99;
      const minB = three ? 10 : 2;
      const maxB = three ? 99 : 9;

      b = rand(minB, maxB);

      const wantRemainder = subtype === '나머지 있음';

      const minQ = Math.max(
        1,
        Math.ceil((minA - (wantRemainder ? b - 1 : 0)) / b)
      );

      const maxQ = Math.floor(
        (maxA - (wantRemainder ? 1 : 0)) / b
      );

      if (minQ > maxQ) return null;

      answer = rand(minQ, maxQ);

      const lowR = wantRemainder
        ? Math.max(1, minA - b * answer)
        : 0;

      const highR = wantRemainder
        ? Math.min(b - 1, maxA - b * answer)
        : 0;

      if (lowR > highR) return null;

      remainder = wantRemainder ? rand(lowR, highR) : 0;
      a = b * answer + remainder;

      if (a < minA || a > maxA) return null;

      symbol = '÷';
      break;
    }

    default:
      return null;
  }

  if (subtype !== '전체' && !type.startsWith('div')) {
    const carry = type === 'add3'
      ? hasCarry(a, b)
      : type === 'sub3'
        ? hasBorrow(a, b)
        : multiplicationCarry(a, b);

    if (subtype.endsWith('없음') && carry) return null;
    if (subtype.endsWith('있음') && !carry) return null;
  }

  const isRemainder = subtype === '나머지 있음';

  return {
    a,
    b,
    answer,
    remainder,
    type,
    subtype,
    isRemainder,
    text: `${a} ${symbol} ${b} = ?`,
    answerText: isRemainder
      ? `몫 ${answer}, 나머지 ${remainder}`
      : String(answer)
  };
}

function generateQuestions(total, type, subtype) {
  const out = [];
  const seen = new Set();
  let attempts = 0;

  while (out.length < total && attempts < 200000) {
    attempts++;

    const q = createCandidate(type, subtype);
    if (!q) continue;

    const key = `${q.type}:${q.a}:${q.b}`;
    if (seen.has(key)) continue;

    seen.add(key);
    out.push(q);
  }

  if (out.length < total) {
    throw Error(
      `이 유형은 중복 없이 ${total}문제를 만들 수 없습니다. 문제 수를 줄여 주세요.`
    );
  }

  return out;
}

function showScreen(name) {
  ['settings', 'game', 'summary', 'history'].forEach(id => {
    $(id).hidden = id !== name;
  });
}

function startGame() {
  sessionInfo = {
    grade: $('grade').selectedOptions[0].text,
    type: $('type').selectedOptions[0].text,
    subtype: $('subtype').value
  };

  try {
    questions = generateQuestions(
      Number($('total').value),
      $('type').value,
      $('subtype').value
    );
  } catch (e) {
    alert(e.message);
    return;
  }

  beginSession();
}

function beginSession() {
  clearInterval(timerId);
  clearTimeout(nextTimerId);

  records = [];
  index = 0;
  sessionSaved = false;

  showScreen('game');
  showQuestion();
}

function showQuestion() {
  if (index >= questions.length) {
    showSummary();
    return;
  }

  answered = false;

  $('checkBtn').disabled = false;
  $('answer').disabled = false;
  $('remainder').disabled = false;

  $('answer').value = '';
  $('remainder').value = '';
  $('result').textContent = '';
  $('result').className = '';

  const q = questions[index];

  $('question').textContent = q.text;
  $('progress').textContent =
    `${index + 1} / ${questions.length} 문제`;

  $('progressBar').style.width =
    `${index / questions.length * 100}%`;

  $('remainder').hidden = !q.isRemainder;
  $('answer').placeholder = q.isRemainder
    ? '몫 입력'
    : '정답 입력';

  questionStart = Date.now();
  $('timer').textContent = '0.0초';

  clearInterval(timerId);

  timerId = setInterval(() => {
    $('timer').textContent =
      `${((Date.now() - questionStart) / 1000).toFixed(1)}초`;
  }, 100);

  $('answer').focus();
}

function checkAnswer() {
  if (answered || $('answer').value.trim() === '') return;

  const q = questions[index];

  if (q.isRemainder && $('remainder').value.trim() === '') {
    $('remainder').focus();
    return;
  }

  answered = true;
  clearInterval(timerId);

  $('checkBtn').disabled = true;
  $('answer').disabled = true;
  $('remainder').disabled = true;

  const userAnswer = Number($('answer').value);
  const userRemainder = q.isRemainder
    ? Number($('remainder').value)
    : 0;

  const correct =
    userAnswer === q.answer &&
    (!q.isRemainder || userRemainder === q.remainder);

  const seconds = (Date.now() - questionStart) / 1000;

  records.push({
    ...q,
    userAnswer,
    userRemainder,
    correct,
    seconds
  });

  $('result').textContent = correct
    ? '정답!'
    : `오답! 정답은 ${q.answerText}`;

  $('result').className = correct
    ? 'correct'
    : 'incorrect';

  index++;

  $('progressBar').style.width =
    `${index / questions.length * 100}%`;

  nextTimerId = setTimeout(showQuestion, 800);
}

function getHistory() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveHistory(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([data, ...getHistory()].slice(0, 20))
    );
  } catch {
    alert('학습 기록 저장 실패');
  }
}

function showSummary() {
  clearInterval(timerId);
  showScreen('summary');

  const correct = records.filter(r => r.correct).length;
  const wrong = records.filter(r => !r.correct);

  const totalSeconds = records.reduce(
    (s, r) => s + r.seconds, 0
  );

  const average = totalSeconds / records.length;
  const accuracy = Math.round(
    correct / records.length * 100
  );

  $('accuracy').textContent = accuracy + '%';
  $('totalTime').textContent = totalSeconds.toFixed(1) + '초';
  $('avgTime').textContent = average.toFixed(1) + '초';

  $('scoreText').textContent =
    `${records.length}문제 중 ${correct}문제 정답`;

  const list = $('wrongList');
  list.replaceChildren();

  if (wrong.length) {
    const h = document.createElement('h3');
    h.textContent = '틀린 문제';
    list.append(h);

    wrong.forEach(r => {
      const item = document.createElement('div');
      item.className = 'item';

      const strong = document.createElement('strong');
      strong.textContent = r.text.replace('?', r.answerText);

      const small = document.createElement('small');
      small.textContent = `내 답: ${
        r.isRemainder
          ? `몫 ${r.userAnswer}, 나머지 ${r.userRemainder}`
          : r.userAnswer
      }`;

      item.append(strong, small);
      list.append(item);
    });
  } else {
    const p = document.createElement('p');
    p.textContent = '모두 정답입니다!';
    list.append(p);
  }

  $('retryBtn').hidden = !wrong.length;

  if (!sessionSaved) {
    saveHistory({
      date: new Date().toISOString(),
      ...sessionInfo,
      total: records.length,
      correct,
      accuracy,
      totalSeconds: Number(totalSeconds.toFixed(1)),
      averageSeconds: Number(average.toFixed(1))
    });

    sessionSaved = true;
  }
}

function retryWrong() {
  questions = records
    .filter(r => !r.correct)
    .map(r => ({
      a: r.a,
      b: r.b,
      answer: r.answer,
      remainder: r.remainder,
      type: r.type,
      subtype: r.subtype,
      isRemainder: r.isRemainder,
      text: r.text,
      answerText: r.answerText
    }));

  if (questions.length) beginSession();
}

function showHistory() {
  showScreen('history');

  const list = $('historyList');
  list.replaceChildren();

  const history = getHistory();

  if (!history.length) {
    const p = document.createElement('p');
    p.textContent = '학습 기록이 없습니다.';
    list.append(p);
    return;
  }

  history.forEach(h => {
    const card = document.createElement('div');
    card.className = 'history-card';

    const title = document.createElement('strong');
    title.textContent = new Date(h.date).toLocaleString('ko-KR');

    const detail = document.createElement('p');
    detail.textContent = [
      h.grade || '기존 학습',
      h.type || h.operation || '',
      h.subtype || ''
    ].filter(Boolean).join(' / ');

    const score = document.createElement('p');
    score.textContent =
      `${h.correct}/${h.total} 정답 (${h.accuracy}%)`;

    const time = document.createElement('small');
    time.textContent =
      `총 ${h.totalSeconds}초 / 평균 ${h.averageSeconds}초`;

    card.append(title, detail, score, time);
    list.append(card);
  });
}

function clearHistory() {
  if (!confirm('모든 학습 기록을 삭제할까요?')) return;

  localStorage.removeItem(STORAGE_KEY);
  showHistory();
}

function resetGame() {
  clearInterval(timerId);
  clearTimeout(nextTimerId);
  showScreen('settings');
}

$('grade').addEventListener('change', updateTypes);
$('type').addEventListener('change', updateSubtypes);
$('startBtn').addEventListener('click', startGame);
$('historyBtn').addEventListener('click', showHistory);
$('checkBtn').addEventListener('click', checkAnswer);
$('retryBtn').addEventListener('click', retryWrong);
$('clearBtn').addEventListener('click', clearHistory);

document.querySelectorAll('.homeBtn').forEach(b => {
  b.addEventListener('click', resetGame);
});

$('answer').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (!$('remainder').hidden) {
      $('remainder').focus();
    } else {
      checkAnswer();
    }
  }
});

$('remainder').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkAnswer();
});

updateTypes();
