# 조대흠 포트폴리오

GitHub Pages에서 제공하는 정적 포트폴리오입니다. 프로젝트의 문제, 참여 범위, 구현 선택, 검증 기록을 소개합니다.

## 수정

- 프로젝트 내용: `data/projects.json`
- 페이지 템플릿: `scripts/build.mjs`
- 스타일·상호작용: `assets/style.css`, `assets/app.js`
- 이미지: `assets/` — 기존 프로젝트를 실행해 캡처한 화면·시각화·캐릭터

빌드에는 Node.js가 필요하며 외부 패키지는 설치하지 않습니다.

```sh
npm run build
npm run check
python3 -m http.server 8765 --bind 127.0.0.1
```

`http://127.0.0.1:8765`에서 확인합니다. 생성되는 `index.html`과 프로젝트별 `index.html`은 템플릿을 수정한 뒤 다시 빌드합니다. 기존 `/projects/come-back-home/`, `/projects/career-piggybank/`, `/projects/dev-hive/` 주소를 유지합니다.

분류 필터, 테마 전환, 모바일 메뉴, 이메일 복사와 앱 화면 선택을 지원합니다. 커리어 저금통은 예제 데이터로 실행하는 체험 데모도 제공합니다. 실제 금융기관 API나 모델 서버에는 연결하지 않습니다.

## 게시

기존 `damisoda/damisoda.github.io` 저장소의 GitHub Pages 설정을 사용합니다. `main`에 게시하기 전 로컬 화면과 변경 내용을 검토합니다.

기존 Next.js 정적 내보내기의 `_next`·텍스트 산출물은 이번 정리에서 삭제하지 않았으며 새 페이지에서는 참조하지 않습니다.

## 커리어 저금통 체험 데모

`demos/career-piggybank/`는 기존 Expo 앱을 `EXPO_PUBLIC_DEMO=1`로 내보낸 정적 산출물입니다. 원본 저장소의 데모 픽스처를 그대로 사용하며, 이력 확인·봉투 제안·커리어·미션·미래 화면을 체험할 수 있습니다. 실제 금융기관 연결, 거래 또는 모델 추론은 실행하지 않습니다. 원본과 빌드 설정은 해당 폴더의 `source.json`에 기록했습니다.

재생성 시 원본 저장소의 `apps/mobile`에서 의존성을 준비하고 `app.json`의 `expo.experiments.baseUrl`을 `/demos/career-piggybank`로 설정한 다음 `EXPO_PUBLIC_DEMO=1 npx expo export --platform web`로 내보냅니다. 산출물에 원본의 `scripts/inject-phone-frame.mjs`를 적용하고, 포트폴리오의 데모 안내·돌아가기 링크를 유지합니다. 일반 포트폴리오 빌드는 이 데모를 다시 빌드하지 않습니다. `.nojekyll`은 Expo의 `_expo` 파일을 Pages에서 제공하는 데 필요합니다.

Dev-Hive 대표 화면은 기존 Next.js 프런트를 저장소 예제 데이터로 로컬 실행한 캡처입니다. 지식그래프는 상세 페이지의 별도 펼침 영역에 남겼습니다.
