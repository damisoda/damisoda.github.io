import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import dora from '../data/portfolio-dora.mjs';
import hive from '../data/portfolio-hive.mjs';
import piggy from '../data/portfolio-piggy.mjs';

const projects = [
  {
    slug: 'come-back-home',
    title: '돌아오길',
    feature: '조건부 보행 규칙과 모델 평가',
    contribution: '개발 팀장, 모델 역할 분리, LoRA 학습과 서빙, 배포 후 제보 운영',
    technology: 'Python, EXAONE, LoRA, vLLM, Supabase',
    metric: '40/48',
    measurement: '학습에 없던 지명으로 만든 합성 시험의 목적지 적중',
    ...dora,
  },
  {
    slug: 'dev-hive',
    title: 'Dev-Hive',
    feature: '지식그래프 편입과 선행관계 추천',
    contribution: '팀 리드, 2패스 편입과 동적 임계값 구현, 선행관계 추천',
    technology: 'FastAPI, PostgreSQL, pgvector, GraphRAG',
    metric: '825 → 24',
    measurement: '콘텐츠 924건 재구축 시 자동 생성 주제',
    ...hive,
  },
  {
    slug: 'career-piggybank',
    title: '커리어 저금통',
    feature: '모델 판독 검증과 사용자 승인',
    contribution: '개발 담당, 로컬 모델 검증, 배분 제안과 사용자 승인 구현',
    technology: 'Expo, FastAPI, Ollama, EXAONE, SQLite',
    metric: '0건',
    measurement: '합성 성향 평가의 방향 오류',
    ...piggy,
  },
];

const site = 'https://damisoda.github.io';
const email = 'jodaeheum800@gmail.com';
const projectPath = project => `/projects/${project.slug}/`;
const text = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const link = ([label, href]) => `<a href="${text(href)}">${text(label)}</a>`;
const links = items => items.length
  ? `<ul class="links">${items.map(item => `<li>${link(item)}</li>`).join('')}</ul>` : '';

function header() {
  return `<a class="skip-link" href="#main">본문 바로가기</a>
  <header class="site-header"><div class="shell mast">
    <a class="brand" href="/"><strong>조대흠</strong><span>AI Engineer</span></a>
    <button type="button" class="menu-toggle" aria-controls="navigation" aria-expanded="false">메뉴</button>
    <nav id="navigation" aria-label="주요 메뉴">
      <a href="/#work">프로젝트</a><a href="/#activity">경력과 활동</a><a href="/#skills">기술</a>
      <a href="/resume.pdf">이력서</a><a href="/portfolio.pdf">포트폴리오 PDF</a><a href="https://github.com/damisoda">GitHub</a>
    </nav>
  </div></header>`;
}

function footer() {
  return `<footer id="contact" class="site-footer"><div class="shell footer-inner">
    <div><h2>조대흠</h2><a href="mailto:${email}">${email}</a><button type="button" class="copy-email" data-email="${email}">이메일 복사</button><p class="copy-status" role="status"></p></div>
    ${links([['GitHub', 'https://github.com/damisoda'], ['이력서 PDF', '/resume.pdf'], ['포트폴리오 PDF', '/portfolio.pdf']])}
  </div></footer>`;
}

function document(title, description, path, content, version) {
  return `<!doctype html>
<html lang="ko"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#ffffff">
<title>${text(title)}</title><meta name="description" content="${text(description)}">
<link rel="canonical" href="${site}${path}"><meta property="og:title" content="${text(title)}">
<meta property="og:description" content="${text(description)}"><meta property="og:type" content="website">
<meta property="og:url" content="${site}${path}"><meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Noto+Sans+KR:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/portfolio.css?v=${version}">
<script src="/assets/app.js?v=${version}" defer></script>
</head><body>${header()}${content}${footer()}</body></html>`.replace(/[ \t]+$/gm, '') + '\n';
}

function workEntry(project) {
  return `<article class="work-entry" data-project="${project.slug}">
    <div class="work-title"><h3><a href="${projectPath(project)}">${text(project.title)}</a></h3><p>${text(project.period)}</p></div>
    <div class="work-description"><p>${text(project.intro)}</p>
      <dl class="work-details">
        <div><dt>역할</dt><dd>${text(project.contribution)}</dd></div>
        <div><dt>기술</dt><dd>${text(project.technology)}</dd></div>
      </dl>
      ${links([['프로젝트 읽기', projectPath(project)], ['GitHub 저장소', project.links[0][1]]])}
    </div>
    <div class="work-metric"><strong>${text(project.metric)}</strong><span>${text(project.measurement)}</span></div>
  </article>`;
}

function homepage(activities) {
  const experience = activities.filter(item => item.type !== '인턴십');
  return `<main id="main">
    <section class="hero" aria-labelledby="hero-title"><div class="shell hero-inner">
      <div class="hero-copy"><h1 id="hero-title">모델의 판단을 검증하고<br> 서비스에 연결합니다.</h1>
        <p>실종자 수색, AI 학습 추천, 생활금융 서비스에서 모델의 출력이 실제 기능에 반영되는 과정을 설계하고 검증했습니다.</p>
        <div class="actions"><a class="button primary" href="/portfolio.pdf">포트폴리오 PDF</a><a class="button secondary" href="/resume.pdf">이력서 PDF</a></div>
      </div>
      <nav class="hero-index" aria-label="프로젝트 바로가기">
        ${projects.map(project => `<a href="${projectPath(project)}"><strong>${text(project.title)}</strong><span>${text(project.feature)}</span></a>`).join('')}
      </nav>
    </div></section>
    <section id="work" class="shell section work" aria-labelledby="work-title">
      <h2 id="work-title">프로젝트</h2>
      <div class="work-list">${projects.map(workEntry).join('')}</div>
    </section>
    <section id="activity" class="shell section" aria-labelledby="activity-title">
      <h2 id="activity-title">경력과 활동</h2>
      <article class="experience">
        <div><h3>샤이닝라이언 인턴</h3><p class="minor">2026.03.09 - 2026.04.03</p></div>
        <div><p>LearnCraft에서 강의 녹음 텍스트를 바탕으로 퀴즈를 만드는 기능을 맡았습니다. 난이도 3단계에 맞춰 문항 스타일 5종을 배분하고, JSON 파싱이나 Pydantic 검증이 실패하면 오류를 전달해 한 번 교정하도록 했습니다. Python과 SQL 답안은 Judge0로 실행해 기대 출력과 비교했습니다.</p>
        ${links([
          ['프로젝트 코드', 'https://github.com/LearnCraftOrg/LearnCraft'],
          ['생성 개선 #3', 'https://github.com/LearnCraftOrg/LearnCraft/pull/3'],
          ['실행 채점 #10', 'https://github.com/LearnCraftOrg/LearnCraft/pull/10'],
        ])}</div>
      </article>
      <div class="experience-list">${experience.map(item => `<article class="experience">
        <div><h3>${text(item.title)}</h3><p class="minor">${text(item.period)}</p></div>
        <div><p><strong>${text(item.result)}</strong></p><p>${text(item.description)}</p>${links(item.links)}</div>
      </article>`).join('')}</div>

    </section>
    <section id="about" class="section profile-band"><div class="shell profile-grid">
      <div><h2>소개</h2>
        <p>서강대학교에서 미국문화를 전공하고 인공지능을 연계전공하고 있습니다. 지금은 LLM의 해석을 실행 가능한 규칙으로 옮기고, 계산과 검증을 코드에 맡기는 AI 서비스 흐름을 설계합니다.</p>
        <p>개발 팀장으로 기획, 디자인 팀원과 협업해 왔습니다. 누구나 AI의 도움을 받을 수 있는 서비스를 만드는 것이 제 목표입니다.</p>
      </div>
      <div id="skills"><h3>프로젝트에서 쓴 기술</h3>
        <dl class="profile-skills">
          <div><dt>모델과 검색</dt><dd>EXAONE, LoRA, vLLM, Ollama, pgvector</dd></div>
          <div><dt>서버와 데이터</dt><dd>Python, FastAPI, PostgreSQL, SQLite, Supabase</dd></div>
          <div><dt>화면과 운영</dt><dd>Next.js, Expo, Docker, pytest</dd></div>
        </dl>
      </div>
    </div></section>
    <div class="shell archive-wrap">
      <details class="archive">
        <summary>다른 프로젝트</summary>
        ${links([
          ['Paper-Digest', 'https://github.com/damisoda/Paper-Digest'],
          ['LOVELOP 에이전트 시뮬레이터', 'https://github.com/damisoda/LOVELOP-commercial-agent-simulator'],
          ['한국어 텍스트 복원', 'https://github.com/damisoda/text-recovery'],
          ['Paw Patrol Network', 'https://github.com/damisoda/TECH4GOOD_Hackerthon'],
        ])}
      </details>
    </div>
  </main>`;
}

function flow(steps, label) {
  return `<ol class="flow" aria-label="${text(label)}">
  ${steps.map(([title, description]) => `<li><strong>${text(title)}</strong><span>${text(description)}</span></li>`).join('')}
  </ol>`;
}

function table(data) {
  if (!data) return '';
  return `<div class="table-scroll"><table>
  ${data.caption ? `<caption>${text(data.caption)}</caption>` : ''}
  <thead><tr>${data.headers.map(item => `<th scope="col">${text(item)}</th>`).join('')}</tr></thead>
  <tbody>${data.rows.map(([first, ...rest]) => `<tr><th scope="row">${text(first)}</th>${rest.map(item => `<td>${text(item)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

function comparison(data) {
  if (!data) return '';
  return `<figure class="comparison"><figcaption>${text(data.label)}</figcaption>
    <ul>${data.rows.map(([label, value, total, display]) => `<li><span>${text(label)}</span><meter min="0" max="${Number(total)}" value="${Number(value)}" aria-label="${text(label)}"></meter><strong>${text(display)}</strong></li>`).join('')}</ul>
  </figure>`;
}

function chapter(entry) {
  return `<section class="chapter" id="${text(entry.id)}" aria-labelledby="${text(entry.id)}-title">
    <h2 id="${text(entry.id)}-title">${text(entry.title)}</h2>
    <p class="chapter-role"><strong>내가 맡은 일</strong> ${text(entry.role)}</p>
    <div class="analysis-grid"><div><h3>관찰과 원인</h3><p>${text(entry.observation)}</p></div>
    <div><h3>구현과 선택 이유</h3><p>${text(entry.decision)}</p></div></div>
    ${entry.flow ? flow(entry.flow, '구현 흐름') : ''}
    ${comparison(entry.comparison)}
    <h3>검증 결과</h3>
    ${table(entry.table)}
    ${table(entry.additionalTable)}
    ${entry.extra?.map(([heading, paragraph]) => `<div class="chapter-extra"><h3>${text(heading)}</h3><p>${text(paragraph)}</p></div>`).join('') ?? ''}
    <p class="scope"><strong>평가 범위</strong> ${text(entry.scope)}</p>
    ${links(entry.links)}
  </section>`;
}

function casePage(project, next, demo) {
  const lead = [['개요', '#problem'], ['전체 구조', '#architecture']];
  const chapterLabels = {
    rules: '조건부 보행 규칙',
    lora: '목적지 모델 재학습',
    validation: project.slug === 'come-back-home' ? '봉인 시험과 평가기 수정' : '성향 판독의 근거 검증',
    operations: '알림 정책과 제보 운영',
    'two-pass': '2패스 주제 편입',
    threshold: '노드별 동적 임계값',
    prerequisites: '선행관계 기반 추천',
    approval: '거래 분류와 사용자 승인',
  };
  const chapters = project.chapters.map(entry => [chapterLabels[entry.id], `#${entry.id}`]);
  return `<main id="main">
    <section class="case-hero" aria-labelledby="case-title"><div class="shell case-hero-inner">
      <div><a class="case-back" href="/#work">프로젝트 목록</a>
        <h1 id="case-title">${text(project.title)}</h1><p class="case-lede">${text(project.intro)}</p>
        ${links(project.links)}
      </div>
      <dl class="case-meta"><div><dt>팀과 역할</dt><dd>${text(project.team)}</dd></div>
        <div><dt>기간</dt><dd>${text(project.period)}</dd></div>
        <div><dt>프로젝트 기록</dt><dd>${text(project.recognition)}</dd></div>
      </dl>
    </div></section>
    <div class="shell reading">
      <aside class="case-index" aria-label="프로젝트 목차"><h2>목차</h2>
        ${links([...lead, ...chapters, ...(demo ? [['앱 데모', '#demo']] : [])])}
      </aside>
      <div class="case-content">
        <section class="chapter overview" id="problem" aria-labelledby="overview-title">
          <h2 id="overview-title">서비스 개요</h2>
          <div class="analysis-grid"><div><h3>문제 정의</h3><p>${text(project.problem)}</p></div>
          <div><h3>구현 방향</h3><p>${text(project.approach)}</p></div></div>
          <div class="role-note" id="contribution"><h3>내가 맡은 일</h3><p>${text(project.role)}</p></div>
          <p class="minor">${project.stack.map(text).join(', ')}</p>
        </section>
        <section class="chapter" id="architecture" aria-labelledby="architecture-title">
          <h2 id="architecture-title">전체 아키텍처</h2>
          ${project.flows.map(entry => `<h3>${text(entry.title)}</h3>${flow(entry.steps, entry.title)}`).join('')}
        </section>
        <div id="solving">
          <div id="decisions">${project.chapters.map(chapter).join('')}</div>
        </div>
        ${project.slug === 'come-back-home' ? `<div class="scope" id="reflection">
          <strong>실제 서비스에 적용할 때</strong>
          개인화 지도는 보호자의 설명과 모델 추정을 바탕으로 계산했습니다. 실제 이동 경로를 알 수 없는 상황에서 문헌 통계 지도를 별도로 계산해 결합했고, 예상과 반대로 이동한 경우의 포함률은 최종 정책에서도 낮아졌습니다. 돌아오길은 신고와 수색을 보조하는 도구입니다.
        </div>` : ''}
        ${demo}
        <nav class="next-case" aria-label="다음 프로젝트"><span>다음 프로젝트</span><a href="${projectPath(next)}">${text(next.title)}</a></nav>
      </div>
    </div>
  </main>`;
}

export function buildPortfolio(root, activities, legacyProjects, productTour) {
  const version = createHash('sha256')
    .update(readFileSync(join(root, 'assets/portfolio.css')))
    .update(readFileSync(join(root, 'assets/app.js')))
    .digest('hex').slice(0, 12);
  writeFileSync(join(root, 'index.html'), document(
    '조대흠, AI 엔지니어 포트폴리오',
    '돌아오길, Dev-Hive, 커리어 저금통의 아키텍처와 구현, 검증 기록.',
    '/', homepage(activities), version,
  ));
  for (const [index, project] of projects.entries()) {
    const next = projects[(index + 1) % projects.length];
    const path = projectPath(project);
    const legacy = legacyProjects.find(item => item.slug === project.slug);
    const demo = legacy.screens?.length
      ? productTour(legacy).replace(/\s*·\s*/g, ', ').replaceAll('구현 앱', '앱')
      : '';
    writeFileSync(join(root, path, 'index.html'), document(
      `${project.title}, 조대흠 포트폴리오`,
      project.intro, path, casePage(project, next, demo), version,
    ));
  }
}
