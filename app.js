const languageSelect = document.getElementById('language');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');
const yearEl = document.getElementById('year');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const micBtn = document.getElementById('micBtn');
const speakBtn = document.getElementById('speakBtn');
const refreshChartBtn = document.getElementById('refreshChart');
const miniChartEl = document.getElementById('miniChart');
const clearChatBtn = document.getElementById('clearChat');

const i18n = {
  en: {
    welcome: "Hi! I'm HealthMate. Ask me about prevention, symptoms, or vaccines.",
    typing: "HealthMate is typing…",
    placeholder: "Type your message...",
    send: "Send",
    reply: (text) => `Thanks for your message: "${text}"\n\nHere are general tips:\n• Wash hands regularly\n• Stay hydrated\n• Keep vaccinations up to date\n\nThis is a demo response.`,
    time: (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  te: {
    welcome: "హాయ్! నేను హెల్త్‌మేట్. నిరోధం, లక్షణాలు లేదా టీకాల గురించి అడగండి.",
    typing: "హెల్త్‌మేట్ టైప్ చేస్తోంది…",
    placeholder: "మీ సందేశాన్ని టైప్ చేయండి...",
    send: "పంపండి",
    reply: (text) => `మీ సందేశానికి ధన్యవాదాలు: "${text}"\n\nసాధారణ చిట్కాలు:\n• చేతులు తరచుగా కడగండి\n• తగినంత నీరు తాగండి\n• టీకాలు సమయానికి వేయించుకోండి\n\nఇది డెమో సమాధానం`,
    time: (d) => d.toLocaleTimeString('te-IN', { hour: '2-digit', minute: '2-digit' })
  },
  hi: {
    welcome: "नमस्ते! मैं हेल्थमेट हूँ। रोकथाम, लक्षण या टीकाकरण के बारे में पूछें।",
    typing: "हेल्थमेट लिख रहा है…",
    placeholder: "अपना संदेश टाइप करें...",
    send: "भेजें",
    reply: (text) => `आपके संदेश के लिए धन्यवाद: "${text}"\n\nसामान्य सुझाव:\n• हाथ धोएँ\n• पर्याप्त पानी पीएँ\n• टीकाकरण समय पर कराएँ\n\nयह एक डेमो उत्तर है।`,
    time: (d) => d.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })
  },
  sw: {
    welcome: "Habari! Mimi ni HealthMate. Uliza kuhusu kinga, dalili, au chanjo.",
    typing: "HealthMate inaandika…",
    placeholder: "Andika ujumbe wako...",
    send: "Tuma",
    reply: (text) => `Asante kwa ujumbe wako: "${text}"\n\nVidokezo vya jumla:\n• Osha mikono mara kwa mara\n• Kunywa maji ya kutosha\n• Hakikisha chanjo ziko sasa\n\nHuu ni majibu ya majaribio.`,
    time: (d) => d.toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })
  }
};

function getT(key) {
  const lang = languageSelect?.value || 'en';
  return i18n[lang][key];
}

function appendMessage(text, from = 'bot') {
  const wrapper = document.createElement('div');
  wrapper.className = `bubble from-${from}`;
  wrapper.textContent = text;

  const meta = document.createElement('div');
  meta.className = 'msg-meta';
  meta.textContent = getT('time')(new Date());

  const container = document.createElement('div');
  container.appendChild(wrapper);
  container.appendChild(meta);

  chatMessages.appendChild(container);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // persist message
  try {
    const history = JSON.parse(localStorage.getItem('hm_chat_history') || '[]');
    history.push({ from, text, ts: Date.now() });
    localStorage.setItem('hm_chat_history', JSON.stringify(history).slice(0, 200000));
  } catch {}
}

function appendTyping() {
  const typing = document.createElement('div');
  typing.className = 'bubble from-bot';
  typing.dataset.typing = 'true';
  typing.textContent = getT('typing');
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typing;
}

function removeTyping(node) {
  if (node && node.parentNode) node.parentNode.removeChild(node);
}

function handleSubmit(event) {
  event.preventDefault();
  const text = (userInput.value || '').trim();
  if (!text) return;

  appendMessage(text, 'user');
  userInput.value = '';
  userInput.focus();

  const typingNode = appendTyping();
  setTimeout(() => {
    removeTyping(typingNode);
    appendMessage(i18n[languageSelect.value].reply(text), 'bot');
  }, 700);
}

function init() {
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (chatMessages) {
    // restore history
    try {
      const history = JSON.parse(localStorage.getItem('hm_chat_history') || '[]');
      if (history.length) {
        history.forEach((m) => appendMessage(m.text, m.from));
      } else {
        appendMessage(getT('welcome'), 'bot');
      }
    } catch {
      appendMessage(getT('welcome'), 'bot');
    }
  }
  chatForm?.addEventListener('submit', handleSubmit);
  // update placeholder and button text on language change
  const sendBtn = document.querySelector('.send-btn');
  function applyLanguageUi() {
    if (userInput) userInput.placeholder = getT('placeholder');
    if (sendBtn) sendBtn.textContent = getT('send');
  }
  applyLanguageUi();
  languageSelect?.addEventListener('change', () => {
    applyLanguageUi();
    // greet again in selected language to show change
    appendMessage(getT('welcome'), 'bot');
  });
  // disable send when input empty
  function updateSendState() {
    const hasText = (userInput.value || '').trim().length > 0;
    if (sendBtn) sendBtn.disabled = !hasText;
  }
  userInput?.addEventListener('input', updateSendState);
  updateSendState();

  // nav toggle and smooth scroll
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const id = a.getAttribute('href');
        if (!id) return;
        const target = document.querySelector(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // highlight active section link on scroll
  const sections = ['#home','#features','#benefits','#tech','#chat','#dashboard','#contact']
    .map((s) => document.querySelector(s))
    .filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = '#' + entry.target.id;
      const link = navMenu?.querySelector(`a[href="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navMenu.querySelectorAll('a').forEach((el) => el.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0.2 });
  sections.forEach((sec) => observer.observe(sec));

  // Voice input (SpeechRecognition) and TTS
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognizer = null;
  if (SpeechRecognition) {
    recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.maxAlternatives = 1;
  }
  function getLocaleForSpeech() {
    const lang = languageSelect?.value || 'en';
    if (lang === 'hi') return 'hi-IN';
    if (lang === 'te') return 'te-IN';
    if (lang === 'sw') return 'sw-TZ';
    return 'en-US';
  }
  micBtn?.addEventListener('click', () => {
    if (!recognizer) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    recognizer.lang = getLocaleForSpeech();
    micBtn.disabled = true;
    micBtn.textContent = '🎙️';
    recognizer.start();
  });
  if (recognizer) {
    recognizer.addEventListener('result', (event) => {
      const transcript = Array.from(event.results)
        .map((res) => res[0]?.transcript || '')
        .join(' ');
      userInput.value = transcript.trim();
      userInput.dispatchEvent(new Event('input'));
    });
    recognizer.addEventListener('end', () => {
      micBtn.disabled = false;
      micBtn.textContent = '🎤';
    });
    recognizer.addEventListener('error', () => {
      micBtn.disabled = false;
      micBtn.textContent = '🎤';
    });
  }

  // Text-to-Speech of last bot message
  speakBtn?.addEventListener('click', () => {
    const bubbles = chatMessages?.querySelectorAll('.from-bot');
    const last = bubbles && bubbles[bubbles.length - 1];
    if (!last) return;
    const utter = new SpeechSynthesisUtterance(last.textContent || '');
    utter.lang = getLocaleForSpeech();
    window.speechSynthesis.speak(utter);
  });

  // Weekly chart rendering
  function generateDemoWeek() {
    // Return 7 random values between 20 and 100
    return Array.from({ length: 7 }, () => Math.floor(20 + Math.random() * 80));
  }
  const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  function renderChart(values) {
    if (!miniChartEl) return;
    const max = Math.max(...values, 100);
    miniChartEl.innerHTML = '';
    values.forEach((v, i) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = `${dayLabels[i]}: ${v}`;
      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = dayLabels[i];
      bar.appendChild(tooltip);
      bar.appendChild(label);
      miniChartEl.appendChild(bar);
      // animate after append
      requestAnimationFrame(() => {
        bar.style.height = `${Math.round((v / max) * 100)}%`;
      });
    });
  }
  let currentWeek = generateDemoWeek();
  renderChart(currentWeek);
  refreshChartBtn?.addEventListener('click', () => {
    currentWeek = generateDemoWeek();
    renderChart(currentWeek);
  });

  // Clear chat
  clearChatBtn?.addEventListener('click', () => {
    if (!chatMessages) return;
    chatMessages.innerHTML = '';
    localStorage.removeItem('hm_chat_history');
    appendMessage(getT('welcome'), 'bot');
  });

  // Reveal-on-scroll for elements with .reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // Back-to-top button
  const topBtn = document.getElementById('toTop');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      topBtn.style.opacity = window.scrollY > 400 ? '1' : '0';
      topBtn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    });
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

init();


