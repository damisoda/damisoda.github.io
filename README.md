# 조대흠 포트폴리오

GitHub Pages에서 제공하는 정적 포트폴리오입니다. 프로젝트의 문제, 참여 범위, 구현 선택, 검증 기록을 소개합니다.

## 수정

- 프로젝트 내용: `data/projects.json`
- 페이지 템플릿: `scripts/build.mjs`
- 스타일·상호작용: `assets/style.css`, `assets/app.js`
- 이미지: `assets/` — 기존 프로젝트에서 공개한 화면·시각화·캐릭터

빌드에는 Node.js가 필요하며 외부 패키지는 설치하지 않습니다.

```sh
npm run build
npm run check
python3 -m http.server 8765 --bind 127.0.0.1
```

`http://127.0.0.1:8765`에서 확인합니다. 생성되는 `index.html`과 프로젝트별 `index.html`은 템플릿을 수정한 뒤 다시 빌드합니다. 기존 `/projects/come-back-home/`, `/projects/career-piggybank/`, `/projects/dev-hive/` 주소를 유지합니다.

분류 필터, 테마 전환, 모바일 메뉴, 이메일 복사를 지원합니다. 실행 중인 프로젝트 서버나 모델에 접속하지 않고 공개 자료를 소개합니다.

## 게시

기존 `damisoda/damisoda.github.io` 저장소의 GitHub Pages 설정을 사용합니다. `main`에 게시하기 전 로컬 화면과 변경 내용을 검토합니다.

기존 Next.js 정적 내보내기의 `_next`·텍스트 산출물은 이번 정리에서 삭제하지 않았으며 새 페이지에서는 참조하지 않습니다.
